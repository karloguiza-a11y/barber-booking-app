import { Twilio } from 'twilio';

export type MessageType = 'confirmation' | 'cancellation' | 'reminder';

interface SMSConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  enabled: boolean;
}

interface SMSTemplate {
  subject: string;
  body: string;
}

class SMSConfigService {
  private config: SMSConfig;
  private client: Twilio | null = null;

  constructor() {
    this.config = {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
      enabled: process.env.ENABLE_SMS === 'true',
    };

    if (this.config.enabled && this.config.accountSid && this.config.authToken) {
      this.client = new Twilio(this.config.accountSid, this.config.authToken);
    }
  }

  getConfig(): SMSConfig {
    return this.config;
  }

  getClient(): Twilio | null {
    return this.client;
  }

  isEnabled(): boolean {
    return this.config.enabled && !!this.client;
  }

  getPhoneNumber(): string {
    return this.config.phoneNumber;
  }

  getTemplate(type: MessageType, data: Record<string, any>): SMSTemplate {
    const templates: Record<MessageType, (data: Record<string, any>) => SMSTemplate> = {
      confirmation: this.getConfirmationTemplate,
      cancellation: this.getCancellationTemplate,
      reminder: this.getReminderTemplate,
    };

    const templateFn = templates[type];
    if (!templateFn) {
      throw new Error(`Unknown message type: ${type}`);
    }

    return templateFn.call(this, data);
  }

  private getConfirmationTemplate(data: Record<string, any>): SMSTemplate {
    const { barberName, serviceName, date, time, clientName } = data;
    return {
      subject: 'Confirmación de Reserva',
      body: `Hola ${clientName},\n\nTu reserva ha sido confirmada:\n- Barbero: ${barberName}\n- Servicio: ${serviceName}\n- Fecha: ${date}\n- Hora: ${time}\n\n¡Te esperamos!`,
    };
  }

  private getCancellationTemplate(data: Record<string, any>): SMSTemplate {
    const { barberName, serviceName, date, time, clientName } = data;
    return {
      subject: 'Cancelación de Reserva',
      body: `Hola ${clientName},\n\nTu reserva ha sido cancelada:\n- Barbero: ${barberName}\n- Servicio: ${serviceName}\n- Fecha: ${date}\n- Hora: ${time}\n\nSi tienes preguntas, contáctanos.`,
    };
  }

  private getReminderTemplate(data: Record<string, any>): SMSTemplate {
    const { barberName, serviceName, date, time, clientName } = data;
    return {
      subject: 'Recordatorio de Reserva',
      body: `¡Hola ${clientName}!\n\nRecordatorio: Tu cita es mañana a las ${time} con ${barberName} para ${serviceName}.\n\nConfirma o cancela en nuestra app si es necesario.`,
    };
  }
}

export const smsConfig = new SMSConfigService();

export default smsConfig;
