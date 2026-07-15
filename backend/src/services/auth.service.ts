import bcrypt from 'bcryptjs';
import { PrismaClient, UserRole } from '@prisma/client';
import { generateToken } from '../utils/jwt.js';
import { BadRequest, Unauthorized, Conflict } from '../utils/errors.js';
import { RegisterInput, LoginInput } from '../schemas/auth.js';

const prisma = new PrismaClient();

export class AuthService {
  async register(input: RegisterInput, role: UserRole = UserRole.CLIENT) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Conflict('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        role,
      },
    });

    if (role === UserRole.CLIENT) {
      await prisma.client.create({
        data: {
          userId: user.id,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
        },
      });
    } else if (role === UserRole.BARBER) {
      await prisma.barber.create({
        data: {
          userId: user.id,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          specialty: 'General',
        },
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new Unauthorized('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new Unauthorized('Invalid credentials');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
