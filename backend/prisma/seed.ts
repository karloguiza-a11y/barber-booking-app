import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Corte Clásico',
        description: 'Corte tradicional con tijeras',
        duration: 30,
        price: 25,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Corte + Barba',
        description: 'Corte completo con afeitado de barba',
        duration: 45,
        price: 35,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Peinado Especial',
        description: 'Peinado con producto premium',
        duration: 20,
        price: 15,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Tingido de Barba',
        description: 'Tingido profesional de barba',
        duration: 30,
        price: 20,
      },
    }),
  ]);

  console.log(`✅ Created ${services.length} services`);

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@barber.com',
      password: adminPassword,
      role: 'ADMIN',
      admin: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@barber.com',
        },
      },
    },
  });

  console.log('✅ Created admin user');

  // Create sample barbers
  const barberPassword = await bcrypt.hash('Barber@123', 12);
  const barbers = await Promise.all([
    prisma.barber.create({
      data: {
        firstName: 'Carlos',
        lastName: 'López',
        email: 'carlos@barber.com',
        phone: '+1234567890',
        specialty: 'Cortes Modernos',
        bio: 'Especialista en cortes contemporáneos',
        user: {
          create: {
            email: 'carlos@barber.com',
            password: barberPassword,
            role: 'BARBER',
          },
        },
        schedules: {
          create: [
            {
              dayOfWeek: 0, // Monday
              startTime: '09:00',
              endTime: '18:00',
            },
            {
              dayOfWeek: 1, // Tuesday
              startTime: '09:00',
              endTime: '18:00',
            },
            {
              dayOfWeek: 2, // Wednesday
              startTime: '09:00',
              endTime: '18:00',
            },
            {
              dayOfWeek: 3, // Thursday
              startTime: '09:00',
              endTime: '18:00',
            },
            {
              dayOfWeek: 4, // Friday
              startTime: '09:00',
              endTime: '18:00',
            },
            {
              dayOfWeek: 5, // Saturday
              startTime: '10:00',
              endTime: '17:00',
            },
          ],
        },
      },
    }),
    prisma.barber.create({
      data: {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@barber.com',
        phone: '+1234567891',
        specialty: 'Afeitados de Precisión',
        bio: 'Maestro en la técnica del afeitado tradicional',
        user: {
          create: {
            email: 'juan@barber.com',
            password: barberPassword,
            role: 'BARBER',
          },
        },
        schedules: {
          create: [
            {
              dayOfWeek: 0,
              startTime: '10:00',
              endTime: '19:00',
            },
            {
              dayOfWeek: 1,
              startTime: '10:00',
              endTime: '19:00',
            },
            {
              dayOfWeek: 2,
              startTime: '10:00',
              endTime: '19:00',
            },
            {
              dayOfWeek: 3,
              startTime: '10:00',
              endTime: '19:00',
            },
            {
              dayOfWeek: 4,
              startTime: '10:00',
              endTime: '19:00',
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${barbers.length} barbers`);

  // Create barber services
  for (const barber of barbers) {
    await Promise.all(
      services.map((service) =>
        prisma.barberService.create({
          data: {
            barberId: barber.id,
            serviceId: service.id,
          },
        })
      )
    );
  }

  console.log('✅ Assigned services to barbers');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
