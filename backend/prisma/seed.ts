import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@xai-tech.com' },
    update: {},
    create: {
      email: 'admin@xai-tech.com',
      password: adminPassword,
      displayName: 'Admin User',
      role: 'admin',
    },
  });

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@xai-tech.com' },
    update: {},
    create: {
      email: 'user@xai-tech.com',
      password: userPassword,
      displayName: 'Test User',
      role: 'user',
    },
  });

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Web Application Security',
      description: 'Security assessment for web application',
      ownerId: admin.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'API Security Audit',
      description: 'Comprehensive API security audit',
      ownerId: user.id,
    },
  });

  // Create sample threats
  await prisma.threat.createMany({
    data: [
      {
        title: 'SQL Injection Attack',
        description: 'Malicious SQL code injection attempt detected',
        severity: 'high',
      },
      {
        title: 'Cross-Site Scripting (XSS)',
        description: 'Reflected XSS vulnerability found in login form',
        severity: 'medium',
      },
      {
        title: 'Brute Force Attack',
        description: 'Multiple failed login attempts detected',
        severity: 'critical',
      },
      {
        title: 'Outdated SSL Certificate',
        description: 'SSL certificate expired, needs renewal',
        severity: 'low',
      },
    ],
  });

  // Create sample incidents
  await prisma.incident.createMany({
    data: [
      {
        title: 'Data Breach Attempt',
        status: 'investigating',
        projectId: project1.id,
      },
      {
        title: 'Unauthorized Access',
        status: 'open',
        projectId: project2.id,
      },
      {
        title: 'Malware Detection',
        status: 'resolved',
        projectId: project1.id,
      },
    ],
  });

  // Create sample reports
  await prisma.report.createMany({
    data: [
      {
        title: 'Monthly Security Report',
        content: 'Monthly security assessment report for January 2024',
      },
      {
        title: 'Incident Response Summary',
        content: 'Summary of recent security incidents and responses',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin user: admin@xai-tech.com / admin123');
  console.log('👤 Test user: user@xai-tech.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
