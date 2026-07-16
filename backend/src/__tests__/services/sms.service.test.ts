import { SMSService, ReservationData } from '../services/sms.service.js';
import smsConfig from '../config/sms.js';

jest.mock('../config/sms.js');

describe('SMSService', () => {
  let smsService: SMSService;

  beforeEach(() => {
    smsService = new SMSService();
    jest.clearAllMocks();
  });

  describe('validatePhoneNumber', () => {
    test('should validate E.164 format phone number', () => {
      const result = smsService.validatePhoneNumber('+12025551234');
      expect(result).toBe(true);
    });

    test('should validate standard US 10-digit phone number', () => {
      const result = smsService.validatePhoneNumber('2025551234');
      expect(result).toBe(true);
    });

    test('should validate phone number with spaces', () => {
      const result = smsService.validatePhoneNumber('202 555 1234');
      expect(result).toBe(true);
    });

    test('should validate phone number with dashes', () => {
      const result = smsService.validatePhoneNumber('202-555-1234');
      expect(result).toBe(true);
    });

    test('should validate phone number with parentheses', () => {
      const result = smsService.validatePhoneNumber('(202) 555-1234');
      expect(result).toBe(true);
    });

    test('should reject empty phone number', () => {
      const result = smsService.validatePhoneNumber('');
      expect(result).toBe(false);
    });

    test('should reject invalid phone number', () => {
      const result = smsService.validatePhoneNumber('123');
      expect(result).toBe(false);
    });

    test('should reject null/undefined phone number', () => {
      const result = smsService.validatePhoneNumber(null as any);
      expect(result).toBe(false);
    });

    test('should reject phone number with invalid characters', () => {
      const result = smsService.validatePhoneNumber('202-555-ABCD');
      expect(result).toBe(false);
    });
  });

  describe('normalizePhoneNumber', () => {
    test('should normalize 10-digit US number to E.164 format', () => {
      const result = smsService.normalizePhoneNumber('2025551234');
      expect(result).toBe('+12025551234');
    });

    test('should normalize phone number with formatting', () => {
      const result = smsService.normalizePhoneNumber('(202) 555-1234');
      expect(result).toBe('+12025551234');
    });

    test('should keep existing E.164 format', () => {
      const result = smsService.normalizePhoneNumber('+12025551234');
      expect(result).toBe('+12025551234');
    });

    test('should handle phone number with +1 prefix', () => {
      const result = smsService.normalizePhoneNumber('+1 (202) 555-1234');
      expect(result).toBe('+12025551234');
    });

    test('should handle international phone numbers', () => {
      const result = smsService.normalizePhoneNumber('+5491123456789');
      expect(result).toBe('+5491123456789');
    });
  });

  describe('sendReservationConfirmation', () => {
    test('should send confirmation SMS with valid reservation data', async () => {
      (smsConfig.isEnabled as jest.Mock).mockReturnValue(true);

      const mockSendSMS = jest.spyOn(smsService as any, 'sendSMS').mockResolvedValue(undefined);

      const reservation: ReservationData = {
        id: '123',
        clientName: 'Juan Pérez',
        clientPhone: '+12025551234',
        barberName: 'Carlos',
        serviceName: 'Corte Clásico',
        appointmentDate: new Date('2025-08-15'),
        startTime: '10:00',
      };

      const result = await smsService.sendReservationConfirmation(reservation.clientPhone, reservation);

      expect(result).toBe(true);
      expect(mockSendSMS).toHaveBeenCalled();
    });

    test('should return false for invalid phone number', async () => {
      (smsConfig.isEnabled as jest.Mock).mockReturnValue(true);

      const reservation: ReservationData = {
        id: '123',
        clientName: 'Juan Pérez',
        clientPhone: 'invalid',
        barberName: 'Carlos',
        serviceName: 'Corte Clásico',
        appointmentDate: new Date('2025-08-15'),
        startTime: '10:00',
      };

      const result = await smsService.sendReservationConfirmation(reservation.clientPhone, reservation);

      expect(result).toBe(false);
    });

    test('should return false when SMS is disabled', async () => {
      (smsConfig.isEnabled as jest.Mock).mockReturnValue(false);

      const reservation: ReservationData = {
        id: '123',
        clientName: 'Juan Pérez',
        clientPhone: '+12025551234',
        barberName: 'Carlos',
        serviceName: 'Corte Clásico',
        appointmentDate: new Date('2025-08-15'),
        startTime: '10:00',
      };

      const result = await smsService.sendReservationConfirmation(reservation.clientPhone, reservation);

      expect(result).toBe(false);
    });

    test('should handle SMS sending errors gracefully', async () => {
      (smsConfig.isEnabled as jest.Mock).mockReturnValue(true);

      jest.spyOn(smsService as any, 'sendSMS').mockRejectedValue(new Error('Twilio error'));

      const reservation: ReservationData = {
        id: '123',
        clientName: 'Juan Pérez',
        clientPhone: '+12025551234',
        barberName: 'Carlos',
        serviceName: 'Corte Clásico',
        appointmentDate: new Date('2025-08-15'),
        startTime: '10:00',
      };

      const result = await smsService.sendReservationConfirmation(reservation.clientPhone, reservation);

      expect(result).toBe(false);
    });
  });

  describe('sendReservationCancellation', () => {
    test('should send cancellation SMS with valid reservation data', async () => {
      (smsConfig.isEnabled as jest.Mock).mockReturnValue(true);

      const mockSendSMS = jest.spyOn(smsService as any, 'sendSMS').mockResolvedValue(undefined);

      const reservation: ReservationData = {
        id: '123',
        clientName: 'Juan Pérez',
        clientPhone: '+12025551234',
        barberName: 'Carlos',
        serviceName: 'Corte Clásico',
        appointmentDate: new Date('2025-08-15'),
        startTime: '10:00',
      };

      const result = await smsService.sendReservationCancellation(reservation.clientPhone, reservation);

      expect(result).toBe(true);
      expect(mockSendSMS).toHaveBeenCalled();
    });

    test('should return false when SMS is disabled', async () => {
      (smsConfig.isEnabled as jest.Mock).mockReturnValue(false);

      const reservation: ReservationData = {
        id: '123',
        clientName: 'Juan Pérez',
        clientPhone: '+12025551234',
        barberName: 'Carlos',
        serviceName: 'Corte Clásico',
        appointmentDate: new Date('2025-08-15'),
        startTime: '10:00',
      };

      const result = await smsService.sendReservationCancellation(reservation.clientPhone, reservation);

      expect(result).toBe(false);
    });
  });

  describe('send24HourReminder', () => {
    test('should send reminder SMS for tomorrow appointment', async () => {
      (smsConfig.isEnabled as jest.Mock).mockReturnValue(true);

      const mockSendSMS = jest.spyOn(smsService as any, 'sendSMS').mockResolvedValue(undefined);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const reservation: ReservationData = {
        id: '123',
        clientName: 'Juan Pérez',
        clientPhone: '+12025551234',
        barberName: 'Carlos',
        serviceName: 'Corte Clásico',
        appointmentDate: tomorrow,
        startTime: '10:00',
      };

      const result = await smsService.send24HourReminder(reservation.clientPhone, reservation);

      expect(result).toBe(true);
      expect(mockSendSMS).toHaveBeenCalled();
    });
  });

  describe('sendGenericSMS', () => {
    test('should send generic SMS with valid phone and message', async () => {
      (smsConfig.isEnabled as jest.Mock).mockReturnValue(true);

      const mockSendSMS = jest.spyOn(smsService as any, 'sendSMS').mockResolvedValue(undefined);

      const result = await smsService.sendGenericSMS('+12025551234', 'Hola, este es un mensaje de prueba');

      expect(result).toBe(true);
      expect(mockSendSMS).toHaveBeenCalledWith('+12025551234', 'Hola, este es un mensaje de prueba');
    });

    test('should return false for invalid phone number in generic SMS', async () => {
      (smsConfig.isEnabled as jest.Mock).mockReturnValue(true);

      const result = await smsService.sendGenericSMS('invalid-phone', 'Mensaje');

      expect(result).toBe(false);
    });
  });

  describe('Message Templates', () => {
    test('should generate correct confirmation message template', () => {
      const template = smsConfig.getTemplate('confirmation', {
        clientName: 'Juan',
        barberName: 'Carlos',
        serviceName: 'Corte Clásico',
        date: '15 de agosto de 2025',
        time: '10:00',
      });

      expect(template.subject).toBe('Confirmación de Reserva');
      expect(template.body).toContain('Juan');
      expect(template.body).toContain('Carlos');
      expect(template.body).toContain('Corte Clásico');
    });

    test('should generate correct cancellation message template', () => {
      const template = smsConfig.getTemplate('cancellation', {
        clientName: 'Juan',
        barberName: 'Carlos',
        serviceName: 'Corte Clásico',
        date: '15 de agosto de 2025',
        time: '10:00',
      });

      expect(template.subject).toBe('Cancelación de Reserva');
      expect(template.body).toContain('cancelada');
    });

    test('should generate correct reminder message template', () => {
      const template = smsConfig.getTemplate('reminder', {
        clientName: 'Juan',
        barberName: 'Carlos',
        serviceName: 'Corte Clásico',
        date: '15 de agosto de 2025',
        time: '10:00',
      });

      expect(template.subject).toBe('Recordatorio de Reserva');
      expect(template.body).toContain('mañana');
    });

    test('should throw error for unknown template type', () => {
      expect(() => {
        smsConfig.getTemplate('unknown' as any, {});
      }).toThrow();
    });
  });
});
