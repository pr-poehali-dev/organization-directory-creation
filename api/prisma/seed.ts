import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hashedAdminPassword = await bcrypt.hash('admin123', 12);
  const hashedUserPassword = await bcrypt.hash('user123', 12);

  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedAdminPassword,
      role: 'ADMIN'
    }
  });

  const regularUser = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      email: 'user@example.com',
      password: hashedUserPassword,
      role: 'USER'
    }
  });

  const org1 = await prisma.organization.create({
    data: {
      name: 'Департамент цифрового развития',
      type: 'Государственное учреждение',
      description: 'Ответственно за цифровую трансформацию'
    }
  });

  const org2 = await prisma.organization.create({
    data: {
      name: 'Администрация города',
      type: 'Муниципальное учреждение',
      description: 'Органы местного самоуправления'
    }
  });

  const dept1 = await prisma.department.create({
    data: {
      name: 'Отдел информационных технологий',
      organizationId: org1.id
    }
  });

  const dept2 = await prisma.department.create({
    data: {
      name: 'Отдел кадров',
      organizationId: org1.id
    }
  });

  const dept3 = await prisma.department.create({
    data: {
      name: 'Управление градостроительства',
      organizationId: org2.id
    }
  });

  await prisma.employee.createMany({
    data: [
      {
        firstName: 'Иван',
        lastName: 'Петров',
        middleName: 'Сергеевич',
        position: 'Начальник отдела ИТ',
        email: 'i.petrov@gov.ru',
        phone: '+7 (495) 123-45-67',
        organizationId: org1.id,
        departmentId: dept1.id
      },
      {
        firstName: 'Мария',
        lastName: 'Сидорова',
        middleName: 'Александровна',
        position: 'Ведущий разработчик',
        email: 'm.sidorova@gov.ru',
        phone: '+7 (495) 123-45-68',
        organizationId: org1.id,
        departmentId: dept1.id
      },
      {
        firstName: 'Алексей',
        lastName: 'Кузнецов',
        middleName: 'Владимирович',
        position: 'Специалист по кадрам',
        email: 'a.kuznetsov@gov.ru',
        phone: '+7 (495) 123-45-69',
        organizationId: org1.id,
        departmentId: dept2.id
      },
      {
        firstName: 'Елена',
        lastName: 'Васильева',
        middleName: 'Игоревна',
        position: 'Главный архитектор',
        email: 'e.vasilieva@city.ru',
        phone: '+7 (495) 987-65-43',
        organizationId: org2.id,
        departmentId: dept3.id
      },
      {
        firstName: 'Дмитрий',
        lastName: 'Морозов',
        middleName: 'Андреевич',
        position: 'Инженер-строитель',
        email: 'd.morozov@city.ru',
        phone: '+7 (495) 987-65-44',
        organizationId: org2.id,
        departmentId: dept3.id
      }
    ]
  });

  await prisma.systemSettings.create({
    data: {
      organizationTypes: [
        'Государственное учреждение',
        'Муниципальное учреждение',
        'Бюджетное учреждение',
        'Автономное учреждение',
        'Унитарное предприятие'
      ],
      notificationDays: [1, 15],
      enableNotifications: true
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin user: admin / admin123`);
  console.log(`👤 Regular user: user / user123`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });