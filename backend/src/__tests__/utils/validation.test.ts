import { describe, it, expect } from '@jest/globals';
import {
  validateEmail,
  validatePassword,
  emailSchema,
  passwordSchema,
  phoneSchema,
  nameSchema
} from '../../utils/validators';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'name+tag@example.org'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        'missing@domain',
        '@nodomain.com',
        'space in@email.com',
        ''
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    it('should use Zod emailSchema for validation', () => {
      const validEmail = 'test@example.com';
      const invalidEmail = 'notanemail';

      expect(() => emailSchema.parse(validEmail)).not.toThrow();
      expect(() => emailSchema.parse(invalidEmail)).toThrow();
    });
  });

  describe('validatePassword', () => {
    it('should accept strong passwords', () => {
      const strongPasswords = [
        'SecurePass123',
        'MyPassword456',
        'TestPass789abc'
      ];

      strongPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(true);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'short',
        'nouppercase123',
        'NOLOWERCASE123',
        'NoNumbers',
        'abc123'
      ];

      weakPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(false);
      });
    });

    it('should require at least 8 characters', () => {
      const shortPassword = 'Pass12';

      expect(validatePassword(shortPassword)).toBe(false);
    });

    it('should require uppercase letter', () => {
      const noUppercase = 'password123';

      expect(validatePassword(noUppercase)).toBe(false);
    });

    it('should require lowercase letter', () => {
      const noLowercase = 'PASSWORD123';

      expect(validatePassword(noLowercase)).toBe(false);
    });

    it('should require number', () => {
      const noNumber = 'PasswordTest';

      expect(validatePassword(noNumber)).toBe(false);
    });
  });

  describe('phoneSchema', () => {
    it('should validate correct phone formats', () => {
      const validPhones = [
        '123-456-7890',
        '+1 (123) 456-7890',
        '123.456.7890',
        '+1234567890'
      ];

      validPhones.forEach(phone => {
        expect(() => phoneSchema.parse(phone)).not.toThrow();
      });
    });

    it('should reject invalid phone formats', () => {
      const invalidPhones = [
        '123456',
        'not-a-phone',
        '999-9999',
        ''
      ];

      invalidPhones.forEach(phone => {
        expect(() => phoneSchema.parse(phone)).toThrow();
      });
    });
  });

  describe('nameSchema', () => {
    it('should accept valid names', () => {
      const validNames = [
        'John',
        'Maria Garcia',
        'Jean-Pierre'
      ];

      validNames.forEach(name => {
        expect(() => nameSchema.parse(name)).not.toThrow();
      });
    });

    it('should reject names shorter than 2 characters', () => {
      const shortName = 'J';

      expect(() => nameSchema.parse(shortName)).toThrow();
    });

    it('should reject names longer than 50 characters', () => {
      const longName = 'A'.repeat(51);

      expect(() => nameSchema.parse(longName)).toThrow();
    });
  });

  describe('Combined validation', () => {
    it('should validate complete user registration data', () => {
      const userData = {
        email: 'user@example.com',
        password: 'SecurePass123',
        name: 'John Doe'
      };

      expect(validateEmail(userData.email)).toBe(true);
      expect(validatePassword(userData.password)).toBe(true);
      expect(() => nameSchema.parse(userData.name)).not.toThrow();
    });

    it('should reject incomplete registration data', () => {
      const userData = {
        email: 'invalid-email',
        password: 'weak',
        name: 'J'
      };

      expect(validateEmail(userData.email)).toBe(false);
      expect(validatePassword(userData.password)).toBe(false);
      expect(() => nameSchema.parse(userData.name)).toThrow();
    });
  });
});
