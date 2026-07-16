import { PrismaClient, NotificationType, NotificationStatus, Reservation } from '@prisma/client';
import transporter from '../config/email.js';
import { config } from '../config/env.js';

const prisma = new PrismaClient();

export class NotificationService {
  async sendReservationConfirmation(reservation: Reservation & { client: any; barber: any; service: any }) {
    const subject = 'Cita Confirmada - Barber Shop';
    const message = `
      <h2>¡Tu cita ha sido reservada!</h2>
      <p>Detalles de tu cita:</p>
      <ul>
        <li><strong>Barbero:</strong> ${reservation.barber.firstName} ${reservation.barber.lastName}</li>
        <li><strong>Servicio:</strong> ${reservation.service.name}</li>
        <li><strong>Fecha:</strong> ${reservation.appointmentDate.toLocaleDateString()}</li>
        <li><strong>Hora:</strong> ${reservation.startTime}</li>
        <li><strong>Precio:</strong> $${reservation.totalPrice}</li>
      </ul>
      <p>Te esperamos. ¡No olvides llegar 10 minutos antes!</p>
    `;

    return this.createNotification({
      reservationId: reservation.id,
      type: NotificationType.RESERVATION_CREATED,
      email: reservation.client.email,
      subject,
      message,
    });
  }

  async sendCancellationNotification(reservation: Reservation & { client: any }) {
    const subject = 'Cita Cancelada - Barber Shop';
    const message = `
      <h2>Tu cita ha sido cancelada</h2>
      <p>La cita del ${reservation.appointmentDate.toLocaleDateString()} a las ${reservation.startTime} ha sido cancelada.</p>
      <p>Si tienes preguntas, contáctanos.</p>
    `;

    return this.createNotification({
      reservationId: reservation.id,
      type: NotificationType.RESERVATION_CANCELLED,
      email: reservation.client.email,
      subject,
      message,
    });
  }

  async sendCompletionNotification(reservation: Reservation & { client: any; barber?: any }) {
    const subject = 'Tu cita fue completada - Deja una reseña';
    const message = `
      <h2>¡Tu cita fue completada!</h2>
      <p>Esperamos que hayas tenido una excelente experiencia con ${reservation.barber?.firstName || 'tu barbero'}.</p>
      <p>Por favor, ayúdanos dejando una reseña. Tu opinión es muy importante para nosotros y ayuda a otros clientes a encontrar los mejores servicios.</p>
      <p><a href="${config.server.frontendUrl}/reservations/${reservation.id}/review">Dejar una Reseña</a></p>
      <p>¡Gracias!</p>
    `;

    return this.createNotification({
      reservationId: reservation.id,
      type: NotificationType.RESERVATION_COMPLETED,
      email: reservation.client.email,
      subject,
      message,
    });
  }

  private async createNotification(data: {
    reservationId: string;
    type: NotificationType;
    email: string;
    subject: string;
    message: string;
  }) {
    const notification = await prisma.notification.create({
      data,
    });

    // Send email asynchronously
    this.sendEmailAsync(data.email, data.subject, data.message, notification.id);

    return notification;
  }

  private async sendEmailAsync(email: string, subject: string, html: string, notificationId: string) {
    try {
      await transporter.sendMail({
        from: config.gmail.user,
        to: email,
        subject,
        html,
      });

      // Update notification status
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: NotificationStatus.SENT,
          sentAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to send email:', error);

      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: NotificationStatus.FAILED,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }
}
