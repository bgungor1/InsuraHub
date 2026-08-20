import { PrismaClient, UserRole, PolicyState, TicketCategory, TicketStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 [1/8] Veritabanı temizleniyor...');

  // Bağımlılık sırasına göre temizlik
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.payoutItem.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.commissionSnapshot.deleteMany();
  await prisma.commissionRule.deleteMany();
  await prisma.ticketMessage.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.policyAssignment.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.agency.deleteMany();
  await prisma.company.deleteMany();

  console.log('🏢 [2/8] Şirket, Acente ve Şubeler oluşturuluyor...');

  // 1. Sigorta Şirketi
  const company = await prisma.company.create({
    data: {
      name: 'Güneş Sigorta A.Ş.',
      taxNumber: '1234567890',
      isActive: true,
    },
  });

  // 2. Acente
  const agency = await prisma.agency.create({
    data: {
      name: 'Güven Aracılık Hizmetleri',
      companyId: company.id,
      isActive: true,
    },
  });

  // 3. Şubeler
  const branch1 = await prisma.branch.create({
    data: {
      name: 'Kadıköy Şubesi',
      agencyId: agency.id,
      isActive: true,
    },
  });

  const branch2 = await prisma.branch.create({
    data: {
      name: 'Beşiktaş Şubesi',
      agencyId: agency.id,
      isActive: true,
    },
  });

  console.log('👥 [3/8] Kullanıcılar oluşturuluyor...');

  const password = await bcrypt.hash('123456', 10);

  // 1. Superadmin (Tüm sisteme tam yetkili)
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@insurahub.com',
      password,
      firstName: 'Sistem',
      lastName: 'Yöneticisi',
      role: UserRole.SUPERADMIN,
      isActive: true,
    },
  });

  // 2. Şirket Kullanıcısı (Güneş Sigorta Yetkilisi)
  const companyUser = await prisma.user.create({
    data: {
      email: 'sirket@insurahub.com',
      password,
      firstName: 'Ahmet',
      lastName: 'Güneş',
      role: UserRole.COMPANY_USER,
      companyId: company.id,
      isActive: true,
    },
  });

  // 3. Acente Yöneticisi (Güven Aracılık Müdürü)
  await prisma.user.create({
    data: {
      email: 'acente@insurahub.com',
      password,
      firstName: 'Mehmet',
      lastName: 'Güven',
      role: UserRole.AGENCY_MANAGER,
      agencyId: agency.id,
      isActive: true,
    },
  });

  // 4. Şube Müdürü (Kadıköy Şube Müdürü)
  await prisma.user.create({
    data: {
      email: 'sube1@insurahub.com',
      password,
      firstName: 'Ayşe',
      lastName: 'Kadıköy',
      role: UserRole.BRANCH_MANAGER,
      branchId: branch1.id,
      isActive: true,
    },
  });

  // 5. Brokerlar (Kadıköy Şubesi Temsilcileri)
  const broker1 = await prisma.user.create({
    data: {
      email: 'broker1@insurahub.com',
      password,
      firstName: 'Can',
      lastName: 'Yılmaz',
      role: UserRole.BROKER,
      branchId: branch1.id,
      isActive: true,
    },
  });

  const broker2 = await prisma.user.create({
    data: {
      email: 'broker2@insurahub.com',
      password,
      firstName: 'Zeynep',
      lastName: 'Kaya',
      role: UserRole.BROKER,
      branchId: branch1.id,
      isActive: true,
    },
  });

  // 6. Beşiktaş Şubesi Temsilcisi
  await prisma.user.create({
    data: {
      email: 'broker3@insurahub.com',
      password,
      firstName: 'Emre',
      lastName: 'Demir',
      role: UserRole.BROKER,
      branchId: branch2.id,
      isActive: true,
    },
  });

  console.log('💰 [4/8] Komisyon Kuralları tanımlanıyor...');

  const commissionRule1 = await prisma.commissionRule.create({
    data: {
      name: 'Standart Komisyon Dağılım Kuralı',
      companyShare: 40,
      agencyShare: 30,
      branchShare: 15,
      brokerShare: 15,
    },
  });

  console.log('👤 [5/8] Müşteriler oluşturuluyor...');

  const customer1 = await prisma.customer.create({
    data: {
      identityNo: '11111111110',
      firstName: 'Ali',
      lastName: 'Veli',
      contactInfo: { phone: '05551112233', email: 'ali.veli@gmail.com' },
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      identityNo: '22222222220',
      firstName: 'Fatma',
      lastName: 'Demir',
      contactInfo: { phone: '05554445566', email: 'fatma.demir@gmail.com' },
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      identityNo: '33333333330',
      firstName: 'Mustafa',
      lastName: 'Öztürk',
      contactInfo: { phone: '05557778899', email: 'mustafa.ozturk@gmail.com' },
    },
  });

  console.log('📋 [6/8] Poliçeler ve Yaşam Döngüsü Simülasyonu...');

  // Poliçe 1: Tamamlanmış Kasko Poliçesi (Komisyon Snapshot & Payout ile)
  const policy1 = await prisma.policy.create({
    data: {
      branchId: branch1.id,
      customerId: customer1.id,
      brokerId: broker1.id,
      product: 'Geniş Kapsamlı Kasko',
      coverageAmount: 1200000,
      totalAmount: 24000,
      state: PolicyState.COMPLETED,
    },
  });

  const snapshot1 = await prisma.commissionSnapshot.create({
    data: {
      policyId: policy1.id,
      commissionRuleId: commissionRule1.id,
      totalAmount: 24000,
      companyAmount: 24000 * 0.4, // 9600
      agencyAmount: 24000 * 0.3, // 7200
      branchAmount: 24000 * 0.15, // 3600
      brokerAmount: 24000 * 0.15, // 3600
      calculatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  // Hakediş (Payout) Örneği
  const payout = await prisma.payout.create({
    data: {
      brokerId: broker1.id,
      periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(),
      totalAmount: 3600,
      status: 'PAID',
    },
  });

  await prisma.payoutItem.create({
    data: {
      payoutId: payout.id,
      snapshotId: snapshot1.id,
      amount: 3600,
    },
  });

  // Poliçe 2: Üzerine Alınmış Trafik Sigortası (CLAIMED)
  await prisma.policy.create({
    data: {
      branchId: branch1.id,
      customerId: customer2.id,
      brokerId: broker1.id,
      product: 'Zorunlu Trafik Sigortası',
      coverageAmount: 200000,
      totalAmount: 8500,
      state: PolicyState.CLAIMED,
    },
  });

  // Poliçe 3: Şube Havuzunda Bekleyen Konut Sigortası (UNASSIGNED)
  await prisma.policy.create({
    data: {
      branchId: branch1.id,
      customerId: customer3.id,
      product: 'Tam Kapsamlı Konut & DASK',
      coverageAmount: 3500000,
      totalAmount: 6200,
      state: PolicyState.UNASSIGNED,
    },
  });

  // Poliçe 4: Beşiktaş Şubesi Havuzunda Bekleyen Sağlık Sigortası (UNASSIGNED)
  await prisma.policy.create({
    data: {
      branchId: branch2.id,
      customerId: customer1.id,
      product: 'Tamamlayıcı Sağlık Sigortası (TSS)',
      coverageAmount: 500000,
      totalAmount: 14500,
      state: PolicyState.UNASSIGNED,
    },
  });

  console.log('🎫 [7/8] Destek Talepleri (Tickets) oluşturuluyor...');

  const ticket1 = await prisma.ticket.create({
    data: {
      creatorId: broker1.id,
      category: TicketCategory.POLICY_APPROVAL,
      status: TicketStatus.OPEN,
      subject: '2026-KASKO-001 Özel Teminat İskontosu Talebi',
    },
  });

  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket1.id,
      senderId: broker1.id,
      body: 'Müşterinin 5 yıllık hasarsızlık indirimi bulunmaktadır, ek %10 iskonto tanımlanabilir mi?',
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      creatorId: broker2.id,
      category: TicketCategory.TECHNICAL,
      status: TicketStatus.IN_PROGRESS,
      subject: 'Kurumsal Filo Teklifi Onay Süreci',
    },
  });

  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket2.id,
      senderId: broker2.id,
      body: '150.000 TL üzeri kurumsal filo kasko teklifi için şirket onayı rica ediyoruz.',
    },
  });

  console.log('🔔 [8/8] Bildirimler ve Denetim İzi (Audit Log) ekleniyor...');

  await prisma.notification.create({
    data: {
      userId: broker1.id,
      type: 'POLICY_ASSIGNED',
      title: 'Yeni Poliçe Atandı',
      message: 'Geniş Kapsamlı Kasko poliçesi başarıyla tamamlandı.',
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: superAdmin.id,
      action: 'SYSTEM_SEED',
      entityType: 'SYSTEM',
      entityId: superAdmin.id,
      before: null,
      after: { description: 'Veritabanı başlangıç test verileriyle tohumlandı.' },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: broker1.id,
      action: 'CLAIM_POLICY',
      entityType: 'POLICY',
      entityId: policy1.id,
      before: { state: 'UNASSIGNED', brokerId: null },
      after: { state: 'CLAIMED', brokerId: broker1.id },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: broker1.id,
      action: 'COMPLETE_POLICY',
      entityType: 'POLICY',
      entityId: policy1.id,
      before: { state: 'CLAIMED' },
      after: { state: 'COMPLETED', totalAmount: 24000, snapshotId: snapshot1.id },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: companyUser.id,
      action: 'CREATE_COMMISSION_RULE',
      entityType: 'COMMISSION_RULE',
      entityId: commissionRule1.id,
      before: null,
      after: { companyShare: 40, agencyShare: 30, branchShare: 15, brokerShare: 15 },
    },
  });

  console.log('---------------------------------------------------------');
  console.log('🎉 SEED İŞLEMİ BAŞARIYLA TAMAMLANDI!');
  console.log('🔑 Giriş Şifresi (Tüm Hesaplar İçin): 123456');
  console.log('   - Superadmin: admin@insurahub.com');
  console.log('   - Şirket:     sirket@insurahub.com');
  console.log('   - Acente:     acente@insurahub.com');
  console.log('   - Şube:       sube1@insurahub.com');
  console.log('   - Broker 1:   broker1@insurahub.com');
  console.log('   - Broker 2:   broker2@insurahub.com');
  console.log('---------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seed sırasında hata oluştu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });