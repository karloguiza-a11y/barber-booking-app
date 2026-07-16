import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { smsService } from '../services/sms.service.js';

const prisma = new PrismaClient();

class RemindersJob {
  private task: cron.ScheduledTask | null = null;

  async start(): Promise<void> {
    console.log('Starting reminders job...');

    // Run every hour at minute 0
    this.task = cron.schedule('0 * * * *', async () => {
      await this.processReminders();
    });

    // Process reminders immediately on startup
    await this.processReminders();

    console.log('Reminders job started. Will run every hour.');
  }

  async stop(): Promise<void> {
    if (this.task) {
      this.task.stop();
      console.log('Reminders job stopped.');
    }
  }

  private async processReminders(): Promise<void> {
    try {
      console.log(`[${new Date().toISOString()}] Processing 24-hour reminders...`);

      const reservations = await this.getReservationsForTomorrow();

      if (reservations.length === 0) {
        console.log('No reservations for tomorrow.');
        return;
      }

      console.log(`Found ${reservations.length} reservations for tomorrow.`);

      for (const reservation of reservations) {
        await this.sendReminderForReservation(reservation);
      }

      console.log('Finished processing reminders.');
    } catch (error) {
      console.error('Error processing reminders:', error);
    }
  }

  private async sendReminderForReservation(reservation: any): Promise<void> {
    try {
      const { client, barber, service } = reservation;

      if (!client || !client.phone) {
        console.warn(`No phone number for client ${client?.id}`);
        return;
      }

      const reservationData = {
        id: reservation.id,
        clientName: `${client.firstName} ${client.lastName}`,
        clientPhone: client.phone,
        barberName: `${barber.firstName} ${barber.lastName}`,
        serviceName: service.name,
        appointmentDate: reservation.appointmentDate,
        startTime: reservation.startTime,
      };

      const success = await smsService.send24HourReminder(client.phone, reservationData);

      if (success) {
        console.log(`SMS reminder sent for reservation ${reservation.id}`);
      } else {
        console.warn(`Failed to send SMS reminder for reservation ${reservation.id}`);
      }
    } catch (error) {
      console.error(`Error sending reminder for reservation ${reservation.id}:`, error);
    }
  }

  private async getReservationsForTomorrow(): Promise<any[]> {
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
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      include: {
        client: true,
        barber: true,
        service: true,
      },
    });
  }
}

// Singleton instance
const remindersJob = new RemindersJob();

// Handle CLI arguments
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const isCron = args.includes('--cron');

  if (isCron) {
    // Start cron job and keep process alive
    await remindersJob.start();
    console.log('Reminders cron job is running. Press Ctrl+C to stop.');

    process.on('SIGINT', async () => {
      console.log('\nShutting down...');
      await remindersJob.stop();
      await prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\nShutting down...');
      await remindersJob.stop();
      await prisma.$disconnect();
      process.exit(0);
    });
  } else {
    // Run once and exit
    console.log('Running reminders job once...');
    await remindersJob.processReminders();
    await prisma.$disconnect();
    process.exit(0);
  }
}

main().catch(async (error) => {
  console.error('Fatal error:', error);
  await prisma.$disconnect();
  process.exit(1);
});

export default remindersJob;
