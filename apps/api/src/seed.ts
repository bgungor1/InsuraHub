import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  console.log('🌱 Seeding işlemi başlıyor...');
  const initialPassword = process.env.SEED_ADMIN_PASSWORD || '123456';
  const hashedPassword = await bcrypt.hash(initialPassword, 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@insurahub.com' },
    update: {
      password: hashedPassword,
      role: UserRole.SUPERADMIN,
    },
    create: {
      email: 'admin@insurahub.com',
      password: hashedPassword,
      firstName: 'Sistem',
      lastName: 'Yöneticisi',
      role: UserRole.SUPERADMIN,
    },
  });
  console.log(`✅ Superadmin kullanıcısı hazır: ${superAdmin.email}`);

  let testCompany = await prisma.company.findFirst({
    where: { name: 'Test Sigorta A.Ş.' },
  });
  if (!testCompany) {
    testCompany = await prisma.company.create({
      data: { name: 'Test Sigorta A.Ş.', taxNumber: '1234567890' },
    });
    console.log(`✅ Test Şirketi oluşturuldu: ${testCompany.name}`);
  } else {
    console.log(`ℹ️ Test Şirketi zaten mevcut: ${testCompany.name}`);
  }

  await app.close();
  console.log('🎉 Seeding başarıyla tamamlandı!');
}

bootstrap().catch((err) => {
  console.error('❌ Seeding sırasında hata oluştu:', err);
  process.exit(1);
});
