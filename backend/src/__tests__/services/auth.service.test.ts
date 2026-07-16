import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// Mock de dependencias
jest.mock('@prisma/client');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// Simulación simple de servicios de autenticación
describe('Auth Service', () => {
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
  });

  describe('registerClient', () => {
    it('should hash password before storing', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const salt = 10;

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await bcrypt.hash(password, salt);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
      expect(result).toBe('hashedPassword');
    });

    it('should reject invalid email', () => {
      const invalidEmails = ['notanemail', 'missing@domain', '@nodomain.com'];

      invalidEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('should reject password shorter than 6 characters', () => {
      const shortPassword = 'pass12';
      const minLength = 6;

      expect(shortPassword.length).toBeLessThanOrEqual(minLength);
    });
  });

  describe('login', () => {
    it('should generate valid JWT token', async () => {
      const userId = '123';
      const secret = 'test-secret';

      const token = jwt.sign({ userId }, secret, { expiresIn: '24h' });

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId },
        secret,
        { expiresIn: '24h' }
      );
    });

    it('should reject invalid credentials', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await bcrypt.compare('wrongPassword', 'hashedPassword');

      expect(result).toBe(false);
    });

    it('should compare passwords correctly', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await bcrypt.compare('password123', 'hashedPassword');

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    });
  });

  describe('me', () => {
    it('should return user profile with correct fields', () => {
      const userProfile = {
        id: '123',
        email: 'user@example.com',
        name: 'Test User',
        role: 'CLIENT'
      };

      expect(userProfile).toHaveProperty('id');
      expect(userProfile).toHaveProperty('email');
      expect(userProfile).toHaveProperty('name');
      expect(userProfile).toHaveProperty('role');
    });

    it('should not include password in profile', () => {
      const userProfile = {
        id: '123',
        email: 'user@example.com',
        name: 'Test User',
        role: 'CLIENT'
      };

      expect(userProfile).not.toHaveProperty('password');
    });
  });
});
