import 'dotenv/config';
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

async function main() {
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
  console.log(`✅ Superadmin hazır: ${superAdmin.email}`);

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

  let defaultCommissionRule = await prisma.commissionRule.findFirst({
    where: { name: 'Varsayılan Komisyon Kuralı' },
  });
  if (!defaultCommissionRule) {
    defaultCommissionRule = await prisma.commissionRule.create({
      data: {
        name: 'Varsayılan Komisyon Kuralı',
        companyShare: 10,
        agencyShare: 30,
        branchShare: 30,
        brokerShare: 30,
      },
    });
    console.log(`✅ Küresel Komisyon Kuralı oluşturuldu: ${defaultCommissionRule.name}`);
  } else {
    console.log(`ℹ️ Komisyon Kuralı zaten mevcut: ${defaultCommissionRule.name}`);
  }

  console.log('🎉 Seeding işlemi başarıyla tamamlandı!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding sırasında hata oluştu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });