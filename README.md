<div align="center">

# 🛡️ InsuraHub

**Kurumsal Sigortacılık, Poliçe Yaşam Döngüsü ve Finansal Dağıtım Platformu**

Modern monorepo mimarisi, gerçek zamanlı WebSocket entegrasyonu ve rol tabanlı veri izolasyonu ile güçlendirilmiş uçtan uca kurumsal sigorta ve acente yönetim sistemi.

[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo%202.10-000000?style=for-the-badge&logo=turborepo)](https://turbo.build/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/UI-React%2019.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2011.0-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%206.4-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

<br />

### 🌐 [Canlı Demo Uygulamasını Ziyaret Edin](https://insura-hub-web-nu.vercel.app/login)

</div>

---

## 👥 Canlı Demo & Test Giriş Hesapları

Platformu doğrudan canlı ortamda deneyimlemek için aşağıdaki test hesaplarını kullanabilirsiniz:

| Rol | E-Posta | Ortak Şifre | Kapsam / Yetki Alanı |
| :--- | :--- | :---: | :--- |
| 👑 **Süper Admin** | `admin@insurahub.com` | `123456` | Tüm sistem, şirketler, acenteler, denetim kayıtları |
| 🏢 **Şirket Yetkilisi** | `sirket@insurahub.com` | `123456` | Şirket operasyonları, komisyon kuralları, poliçe havuzu |
| 🏛️ **Acente Müdürü** | `acenta@insurahub.com` | `123456` | Acente bünyesindeki şubeler, brokerlar, poliçeler |
| 🏪 **Şube Müdürü** | `sube1@insurahub.com` | `123456` | Şube brokerları, poliçe atamaları ve talepleri |
| 💼 **Broker 1** | `broker1@insurahub.com` | `123456` | Poliçe sahiplenme (Claim), müşteri ve hakediş takibi |
| 💼 **Broker 2** | `broker2@insurahub.com` | `123456` | Poliçe sahiplenme (Claim), müşteri ve hakediş takibi |
| 💼 **Broker 3** | `broker3@insurahub.com` | `123456` | Poliçe sahiplenme (Claim), müşteri ve hakediş takibi |

---

## 📖 Genel Bakış

**InsuraHub**, sigorta şirketleri, acenteler, şubeler ve brokerlar arasındaki poliçe, müşteri, destek ve komisyon operasyonlarını tek bir merkezden yönetmek üzere geliştirilmiş modüler bir kurumsal platformdur.

Poliçelerin taslak aşamasından tamamlanmasına kadar olan katı durum makinesi (State Machine), zamansal versiyonlanan komisyon paylaşımları, anlık WebSocket bildirimleri, operasyonel destek talepleri (Ticketing) ve değiştirilemez denetim kayıtları (Audit Logs) projenin temel işlevlerini oluşturur.

---

## 🏛️ Mimari ve Dizin Yapısı

InsuraHub, **PNPM Workspaces** ve **Turborepo** üzerine kurulu **Modüler Monolit (Modular Monorepo)** yapısıyla yapılandırılmıştır:

```text
InsuraHub/
├── 🌐 apps/web/                  # Next.js 16 (App Router) Frontend Uygulaması
│   ├── src/app/                  # Rota Grupları: (auth), (dashboard)
│   │   ├── (auth)/login/         # Kimlik doğrulama & Demo hesap listesi
│   │   └── (dashboard)/          # Dashboard, Poliçeler, Komisyonlar, Müşteriler,
│   │                             # Destek Masası, Denetim Kayıtları, Organizasyonlar
│   ├── src/components/           # Reusable UI & Shadcn/Radix bileşenleri
│   ├── src/features/             # Domain bazlı özellik modülleri
│   │   ├── agencies/             # Acente yönetimi & listeleme
│   │   ├── audit-logs/           # Denetim günlüğü & diff görüntüleyici
│   │   ├── auth/                 # Kimlik doğrulama & Demo kartı
│   │   ├── branches/             # Şube yönetimi & listeleme
│   │   ├── commissions/          # Komisyon kuralları & snapshot tabloları
│   │   ├── companies/            # Şirket yönetimi
│   │   ├── customers/            # Müşteri portföyü
│   │   ├── dashboard/            # KPI özetleri & amCharts grafikleri
│   │   ├── notifications/        # Anlık bildirim çanı & soket dinleyicileri
│   │   ├── policies/             # Poliçe wizard'ı, durum geçişleri, AG Grid
│   │   ├── tickets/              # Destek talepleri & mesajlaşma
│   │   └── users/                # Kullanıcı yönetimi & rol atama
│   ├── src/hooks/                # Ortak yardımcı React hook'ları
│   ├── src/lib/                  # Axios apiClient, socket.io client, query keys
│   ├── src/stores/               # Zustand global UI & oturum state yönetimi
│   └── tests/                    # Vitest birim & Playwright E2E testleri
│
├── ⚙️ apps/api/                  # NestJS 11 REST & WebSocket Backend Servisi
│   ├── prisma/                   # schema.prisma (MongoDB) & seed betiği
│   ├── src/auth/                 # JWT Strategy, RolesGuard, Cookie & Bearer auth
│   ├── src/common/               # Exception filter'lar, Pipes, Decorators
│   ├── src/domains/              # Domain Odaklı Backend Modülleri
│   │   ├── agencies/             # Acente servis & kontrolleri
│   │   ├── audit-logs/           # Denetim günlüğü kayıt & sorgulama
│   │   ├── branches/             # Şube servis & kontrolleri
│   │   ├── commissions/          # Komisyon motoru, hesaplayıcı, scope helper
│   │   ├── companies/            # Şirket CRUD & hiyerarşi
│   │   ├── customers/            # Müşteri yönetimi
│   │   ├── dashboard/            # İstatistik & analitik KPI servisleri
│   │   ├── notifications/        # WebSocket Gateway & bildirim servisi
│   │   ├── policies/             # Poliçe State Machine, Lifecycle & Gateway
│   │   ├── tickets/              # Ticket, TicketMessage & Scope helper
│   │   └── users/                # Kullanıcı yönetimi
│   ├── src/finance/              # Finansal operasyonlar & raporlama
│   └── src/prisma/               # Prisma Service & lifecycle yönetimi
│
├── 🐳 docker-compose.yml          # Container orkestrasyonu
├── 📦 package.json               # Kök monorepo bağımlılıkları
├── 📄 pnpm-workspace.yaml        # Workspace tanımları
└── ⚡ turbo.json                  # Turborepo görev akışları
```

---

## 🌟 Temel Modüller ve Özellikler

### 1. 🔐 Rol Tabanlı Yetkilendirme & Veri İzolasyonu (RBAC)
- **5 Seviyeli Hiyerarşik Rol:** `SUPERADMIN` → `COMPANY_USER` → `AGENCY_MANAGER` → `BRANCH_MANAGER` → `BROKER`.
- **Organizasyonel İzolasyon:** Her kullanıcı yalnızca bağlı olduğu şirketin, acentenin veya şubenin verilerini görebilir ve yönetebilir.
- **Güvenli Oturum:** Kimlik doğrulama hem HTTP-Only Cookie hem de `Authorization: Bearer <token>` standartları üzerinden güvenli şekilde yürütülür.

### 2. 📋 Poliçe Yaşam Döngüsü & Durum Makinesi
- **Katı Durum Akışı:** `DRAFT` ➔ `UNASSIGNED` ➔ `CLAIMED` ➔ `COMPLETED` / `CANCELLED`.
- **Broker Sahiplenme (Claiming):** Boştaki (`UNASSIGNED`) poliçeler brokerlar tarafından sahiplenilir veya yöneticiler tarafından doğrudan atanabilir.
- **Bağlantılı Yenileme (Renewals):** Süresi dolan poliçeler `previousPolicyId` ile birbirine bağlanarak yenilenebilir.

### 3. 💰 Zamansal Versiyonlu Komisyon Motoru
- **Temporal Versioning:** Komisyon kuralları geçerlilik aralıklarıyla (`validFrom`, `validUntil`) saklanır; geçmiş kurallar ezilmez.
- **Dondurulmuş Dağıtım (CommissionSnapshot):** Poliçe tamamlandığında geçerli kural oranlarına göre Şirket, Acente, Şube ve Broker payları kuruş hassasiyetinde hesaplanıp dondurulur.
- **Hakediş Takibi (Payouts):** `Payout` ve `PayoutItem` modelleri ile broker hakedişleri takip edilir.

### 4. 🎫 Destek Masası (Ticketing)
- Şube ve acentelerin merkez birimlerle iletişim kurmasını sağlayan kategorize edilmiş (`TECHNICAL`, `POLICY_APPROVAL`, `FINANCE`) destek talepleri ve mesajlaşma sistemi.

### 5. ⚡ Gerçek Zamanlı İletişim (WebSockets)
- Socket.io üzerinden `/policies` ve `/notifications` namespace'leri ile poliçe sahiplenme, durum değişiklikleri ve bildirimler anlık olarak istemcilere iletilir.

### 6. 📊 Analitik & Görselleştirme
- **amCharts 5:** Aylık poliçe trendleri, komisyon dağılımları ve performans metrikleri.
- **AG Grid:** Büyük veri setlerinde hızlı filtreleme, sıralama ve sayfalama.

---

## 🛠️ Teknoloji Yığını ve Paket Versiyonları

Projeye ait bağımlılıklar doğrudan `package.json` dosyalarından doğrulanmıştır:

| Kategori | Teknoloji / Kütüphane | Versiyon | Kullanım Alanı |
| :--- | :--- | :--- | :--- |
| **Monorepo** | **Turborepo** | `^2.10` | Çoklu paket derleme ve önbellekleme |
| **Paket Yöneticisi** | **pnpm** | `10.25.0` | Hızlı ve katı bağımlılık yönetimi |
| **Frontend Framework**| **Next.js** | `16.3.0` | React Server Components & App Router |
| **UI Çekirdeği** | **React & React-DOM** | `19.2.8` | En güncel React UI motoru |
| **Stil & Tasarım** | **Tailwind CSS** | `^4.3.3` | PostCSS tabanlı modern CSS |
| **Bileşen Altyapısı**| **Radix UI & Lucide** | `1.6.7` / `1.31.0` | Erişilebilir headless UI ve ikon seti |
| **Veri Izgarası** | **AG Grid (`ag-grid-react`)** | `36.1.0` | Sanallaştırılmış yüksek performanslı veri tabloları |
| **Grafik & Analitik** | **amCharts 5** | `5.20.1` | İnteraktif performans ve dağılım grafikleri |
| **Sunucu Durumu** | **TanStack React Query** | `5.101.4` | Axios ile veri çekme, önbellekleme ve senkronizasyon |
| **İstemci Durumu** | **Zustand** | `5.0.14` | Global UI ve oturum durumu |
| **Backend Framework** | **NestJS** | `11.0.1` | Modüler kurumsal Node.js framework'ü |
| **Veritabanı & ORM** | **Prisma Client (MongoDB)** | `6.4.1` | Tip güvenli veritabanı modellemesi ve sorgu motoru |
| **Kimlik & Güvenlik** | **Passport JWT & Bcrypt** | `^4.0.1` / `^6.0.0` | JWT kimlik doğrulama ve parola hashleme |
| **Gerçek Zamanlı** | **Socket.io** | `4.8.3` | Çift yönlü gerçek zamanlı olay akışı |
| **Test Altyapısı** | **Vitest / Jest / Playwright** | `4.1` / `30.0` / `1.62` | Birim, entegrasyon ve E2E testleri |

---

## ⚡ Geliştirme ve Test Komutları

Turborepo ile monorepo komutları kök dizinden yönetilebilir:

```bash
# Tüm uygulamaları (Frontend & Backend) geliştirme modunda başlatır
pnpm dev

# Tüm projeleri derler (Production build)
pnpm build

# Kod kalitesi ve ESLint kontrollerini çalıştırır
pnpm lint

# Tüm test suite'lerini (Jest & Vitest) çalıştırır
pnpm test
```

### Projeye Özel Komutlar:
```bash
# Sadece Frontend (Next.js) başlat:
pnpm --filter web dev

# Sadece Backend (NestJS) başlat:
pnpm --filter api dev

# Backend testlerini çalıştır:
pnpm --filter api test

# Frontend birim testlerini çalıştır:
pnpm --filter web test

# Frontend E2E testlerini çalıştır:
pnpm --filter web exec playwright test
```

---

## 🧪 Test Kapsamı

InsuraHub projesinde testler modül düzeyinde izole edilmiştir:

- **Backend (Jest):** 36 Test Suite, 79 Birim & Servis Testi (Policy Lifecycle, Scope Helper, Commission Calculator, Guards, Filters).
- **Frontend (Vitest):** Auth Store, Ticket & Commission şemaları, UI durum rozetleri.
- **E2E (Playwright):** Login, Dashboard ve Ticket akışları.

---

## 📄 Lisans

Bu proje özel mülkiyet altındadır (Private Repository). Tüm hakları saklıdır.
