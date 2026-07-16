import { PrismaClient } from '@prisma/client';
import smsConfig from '../config/sms.js';

const prisma = new PrismaClient();

export interface ReservationData {
  id: string;
  clientName: string;
  clientPhone: string;
  barberName: string;
  serviceName: string;
  appointmentDate: Date;
  startTime: string;
}

export class SMSService {
  async sendReservationConfirmation(phone: string, reservation: ReservationData): Promise<boolean> {
    if (!this.validatePhoneNumber(phone)) {
      console.warn(`Invalid phone number format: ${phone}`);
      return false;
    }

    if (!smsConfig.isEnabled()) {
      console.log('SMS service is disabled');
      return false;
    }

    try {
      const date = this.formatDate(reservation.appointmentDate);
      const template = smsConfig.getTemplate('confirmation', {
        clientName: reservation.clientName,
        barberName: reservation.barberName,
        serviceName: reservation.serviceName,
        date,
        time: reservation.startTime,
      });

      await this.sendSMS(phone, template.body);
      return true;
    } catch (error) {
      console.error('Error sending reservation confirmation SMS:', error);
      return false;
    }
  }

  async sendReservationCancellation(phone: string, reservation: ReservationData): Promise<boolean> {
    if (!this.validatePhoneNumber(phone)) {
      console.warn(`Invalid phone number format: ${phone}`);
      return false;
    }

    if (!smsConfig.isEnabled()) {
      console.log('SMS service is disabled');
      return false;
    }

    try {
      const date = this.formatDate(reservation.appointmentDate);
      const template = smsConfig.getTemplate('cancellation', {
        clientName: reservation.clientName,
        barberName: reservation.barberName,
        serviceName: reservation.serviceName,
        date,
        time: reservation.startTime,
      });

      await this.sendSMS(phone, template.body);
      return true;
    } catch (error) {
      console.error('Error sending cancellation SMS:', error);
      return false;
    }
  }

  async send24HourReminder(phone: string, reservation: ReservationData): Promise<boolean> {
    if (!this.validatePhoneNumber(phone)) {
      console.warn(`Invalid phone number format: ${phone}`);
      return false;
    }

    if (!smsConfig.isEnabled()) {
      console.log('SMS service is disabled');
      return false;
    }

    try {
      const date = this.formatDate(reservation.appointmentDate);
      const template = smsConfig.getTemplate('reminder', {
        clientName: reservation.clientName,
        barberName: reservation.barberName,
        serviceName: reservation.serviceName,
        date,
        time: reservation.startTime,
      });

      await this.sendSMS(phone, template.body);
      return true;
    } catch (error) {
      console.error('Error sending reminder SMS:', error);
      return false;
    }
  }

  async sendGenericSMS(phone: string, message: string): Promise<boolean> {
    if (!this.validatePhoneNumber(phone)) {
      console.warn(`Invalid phone number format: ${phone}`);
      return false;
    }

    if (!smsConfig.isEnabled()) {
      console.log('SMS service is disabled');
      return false;
    }

    try {
      await this.sendSMS(phone, message);
      return true;
    } catch (error) {
      console.error('Error sending generic SMS:', error);
      return false;
    }
  }

  private async sendSMS(phone: string, message: string): Promise<void> {
    const client = smsConfig.getClient();
    if (!client) {
      throw new Error('Twilio client is not initialized');
    }

    const fromPhone = smsConfig.getPhoneNumber();
    if (!fromPhone) {
      throw new Error('Twilio phone number is not configured');
    }

    // Ensure phone number is in E.164 format
    const formattedPhone = this.normalizePhoneNumber(phone);

    await client.messages.create({
      body: message,
      from: fromPhone,
      to: formattedPhone,
    });
  }

  validatePhoneNumber(phone: string): boolean {
    if (!phone || typeof phone !== 'string') {
      return false;
    }

    // Remove whitespace and check length
    const cleaned = phone.replace(/\s+/g, '');

    // Check if it matches E.164 format or common formats
    const e164Regex = /^\+?[1-9]\d{1,14}$/;
    const standardRegex = /^(\+\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

    return e164Regex.test(cleaned) || standardRegex.test(phone);
  }

  normalizePhoneNumber(phone: string): string {
    // Remove all non-digit characters except leading +
    let cleaned = phone.replace(/[^\d+]/g, '');

    // If it doesn't start with +, assume it's a US number
    if (!cleaned.startsWith('+')) {
      if (cleaned.length === 10) {
        cleaned = '+1' + cleaned;
      } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
        cleaned = '+' + cleaned;
      } else if (!cleaned.startsWith('+')) {
        cleaned = '+' + cleaned;
      }
    }

    return cleaned;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  async getReservationsForTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    return await prisma.reservation.findMany({
      where: {
        appointmentDate: {
          gte: tomorrow,
          lte: endOfTomorrow,
        },
        status: 'PENDING',
      },
      include: {
        client: true,
        barber: true,
        service: true,
      },
    });
  }
}

export const smsService = new SMSService();

export default smsService;
