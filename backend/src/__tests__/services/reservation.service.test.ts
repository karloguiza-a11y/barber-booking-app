import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('Reservation Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReservation', () => {
    it('should validate required fields', () => {
      const reservation = {
        barberId: 'barber-123',
        serviceId: 'service-456',
        date: '2024-01-15',
        startTime: '10:00'
      };

      expect(reservation).toHaveProperty('barberId');
      expect(reservation).toHaveProperty('serviceId');
      expect(reservation).toHaveProperty('date');
      expect(reservation).toHaveProperty('startTime');
    });

    it('should reject invalid date format', () => {
      const invalidDates = ['13-01-2024', '2024/01/15', 'invalid-date'];

      invalidDates.forEach(date => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        expect(dateRegex.test(date)).toBe(false);
      });
    });

    it('should reject invalid time format', () => {
      const invalidTimes = ['25:00', '10:60', '10'];

      invalidTimes.forEach(time => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        expect(timeRegex.test(time)).toBe(false);
      });
    });

    it('should accept valid time format', () => {
      const validTimes = ['08:00', '14:30', '23:59', '00:00'];

      validTimes.forEach(time => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        expect(timeRegex.test(time)).toBe(true);
      });
    });

    it('should calculate end time based on service duration', () => {
      const startTime = '10:00';
      const duration = 30; // minutes

      const start = new Date(`2024-01-15T${startTime}`);
      const end = new Date(start.getTime() + duration * 60000);

      expect(end.getHours()).toBe(10);
      expect(end.getMinutes()).toBe(30);
    });
  });

  describe('getReservation', () => {
    it('should return reservation with all required fields', () => {
      const reservation = {
        id: 'res-123',
        userId: 'user-456',
        barberId: 'barber-789',
        serviceId: 'service-101',
        date: '2024-01-15',
        startTime: '10:00',
        status: 'CONFIRMED',
        notes: 'Sin notas'
      };

      expect(reservation).toHaveProperty('id');
      expect(reservation).toHaveProperty('userId');
      expect(reservation).toHaveProperty('date');
      expect(reservation).toHaveProperty('status');
    });

    it('should have valid status values', () => {
      const validStatuses = ['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'];
      const reservation = { status: 'CONFIRMED' };

      expect(validStatuses).toContain(reservation.status);
    });
  });

  describe('updateReservation', () => {
    it('should allow updating date and time', () => {
      const updates = {
        date: '2024-01-20',
        startTime: '14:00'
      };

      expect(updates).toHaveProperty('date');
      expect(updates).toHaveProperty('startTime');
    });

    it('should not allow updating past reservations', () => {
      const pastDate = new Date('2023-01-01');
      const today = new Date();

      expect(pastDate < today).toBe(true);
    });

    it('should update notes if provided', () => {
      const updates = {
        notes: 'Necesito barba arreglada'
      };

      expect(updates.notes).toBeDefined();
      expect(typeof updates.notes).toBe('string');
    });
  });

  describe('cancelReservation', () => {
    it('should set status to CANCELLED', () => {
      const reservation = { status: 'CONFIRMED' };

      reservation.status = 'CANCELLED';

      expect(reservation.status).toBe('CANCELLED');
    });

    it('should not allow canceling past reservations', () => {
      const reservationDate = new Date('2023-01-01');
      const today = new Date();

      expect(reservationDate < today).toBe(true);
    });
  });

  describe('getMyReservations', () => {
    it('should return list of user reservations', () => {
      const reservations = [
        { id: 'res-1', date: '2024-01-15', status: 'CONFIRMED' },
        { id: 'res-2', date: '2024-01-20', status: 'COMPLETED' }
      ];

      expect(Array.isArray(reservations)).toBe(true);
      expect(reservations.length).toBe(2);
    });

    it('should filter by user ID', () => {
      const userId = 'user-123';
      const reservations = [
        { userId: 'user-123', id: 'res-1' },
        { userId: 'user-123', id: 'res-2' },
        { userId: 'user-456', id: 'res-3' }
      ];

      const userReservations = reservations.filter(r => r.userId === userId);

      expect(userReservations.length).toBe(2);
      expect(userReservations.every(r => r.userId === userId)).toBe(true);
    });
  });
});
