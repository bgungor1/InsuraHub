<div align="center">

# 🛡️ InsuraHub

**Yeni Nesil Kurumsal Sigortacılık, Poliçe Yönetimi ve Finansal Operasyon Platformu**

Modern monorepo mimarisi, gerçek zamanlı veri akışı ve yüksek performanslı kurumsal iş kuralları ile güçlendirilmiş uçtan uca sigorta yönetim ekosistemi.

[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-000000?style=for-the-badge&logo=turborepo)](https://turbo.build/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/UI-React%2019.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2011.0-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%206.4-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 📖 Genel Bakış

**InsuraHub**, sigorta şirketleri, acenteler, şubeler ve brokerlar arasındaki tüm iş akışlarını tek bir çatı altında toplayan enterprise-grade bir yönetim platformudur. 

Poliçe oluşturma ve talep (claim) mekanizmalarından, kademeli komisyon hesaplamalarına, gerçek zamanlı destek taleplerinden (ticketing), denetim kayıtlarına (audit log) kadar kurumsal sigortacılık operasyonlarını uçtan uca dijitalleştirir.

---

## 🏛️ Mimari ve Teknolojik Altyapı

InsuraHub, **PNPM Workspaces** ve **Turborepo** üzerine kurulu yüksek ölçeklenebilir bir **Monorepo (Modular Monolith)** yapısı ile geliştirilmiştir.

```
InsuraHub/
├── 🌐 apps/web/                  # Next.js Frontend Uygulaması (App Router)
│   ├── src/app/                  # Route Group'ları: (auth), (dashboard)
│   ├── src/components/           # Reusable UI & Shadcn bileşenleri
│   ├── src/features/             # Domain bazlı modüller (policies, tickets, commissions, vb.)
│   ├── src/hooks/                # Custom hooks & TanStack Query factory'leri
│   ├── src/stores/               # Zustand UI state yönetimi
│   └── tests/                    # Vitest & Playwright E2E testleri
│
├── ⚙️ apps/api/                  # NestJS Enterprise REST & WebSocket API
│   ├── prisma/                   # Veritabanı şeması & Seed betikleri
│   ├── src/auth/                 # JWT & Passport tabanlı kimlik doğrulama
│   ├── src/common/               # Guards, Interceptors, Pipes, Filters
│   ├── src/domains/              # DDD prensipleriyle ayrılmış Domain Modülleri
│   │   ├── companies/            # Şirket yönetimi
│   │   ├── agencies/             # Acente yönetimi
│   │   ├── branches/             # Şube yönetimi
│   │   ├── policies/             # Poliçe yaşam döngüsü & State Machine
│   │   ├── commissions/          # Zamansal komisyon motoru & Payout
│   │   ├── customers/            # Müşteri portföyü
│   │   ├── tickets/              # Merkezi operasyonel destek havuzu
│   │   └── audit-logs/           # Değiştirilemez denetim kayıtları
│   └── src/finance/              # Finansal operasyonlar & Raporlama
│
├── 🐳 docker-compose.yml          # Yerel geliştirme & Container orkestrasyonu
├── 📦 package.json               # Kök çalışma alanı yapılandırması
├── 📄 pnpm-workspace.yaml        # Workspace bağımlılık yönetimi
└── ⚡ turbo.json                  # Turborepo pipeline kuralları
```

---

## 🌟 Temel Özellikler ve İş Kuralları

### 1. 🔐 Rol Tabanlı Yetkilendirme & Organizasyonel Kapsam (RBAC)
- **Hiyerarşik Kapsam:** `SUPERADMIN` → `COMPANY_USER` → `AGENCY_MANAGER` → `BRANCH_MANAGER` → `BROKER`.
- **Veri Güvenliği ve İzolasyon:** Her kullanıcı yalnızca kendi yetkili olduğu organizasyonel birimin (şirket/acente/şube) verilerini görür ve işlem yapabilir.
- **Tek Doğruluk Kaynağı (Single Source of Truth):** Tüm yetki kontrolleri ve iş mantığı backend katmanında enforce edilir.

### 2. 📋 Poliçe Yaşam Döngüsü & Durum Makinesi (State Machine)
- **Katı Durum Akışı:** `DRAFT` ➔ `UNASSIGNED` ➔ `CLAIMED` ➔ `COMPLETED` / `CANCELLED`.
- **Atomik Poliçe Sahiplenme (Atomic Claiming):** Eşzamanlı (concurrency) çakışmaları engellemek için broker atamaları veritabanı düzeyinde atomik kilitlenme ile gerçekleşir.
- **Bağlantılı Yenileme (Linked Renewal Model):** Süresi dolan poliçelerin yenilemeleri `previousPolicyId` ile geçmişe bağlı yeni bir kayıt olarak üretilir.

### 3. 💰 Zamansal Versiyonlu Komisyon & Hakediş Motoru (Finance)
- **Temporal Rule Versioning:** Komisyon kuralları asla ezilmez (`validFrom`, `validUntil`).
- **Değiştirilemez Dağıtım Snapshots:** Poliçe `COMPLETED` olduğu an geçerli kurala göre alt kademeden (Broker ➔ Şube ➔ Acente ➔ Şirket) başlayarak kuruş hassasiyetinde dağıtılır ve `CommissionSnapshot` tablosuna dondurulur.
- **İdempotent Payouts:** Hakedişler (`PayoutItem` ➔ `Payout`) köprüsü üzerinden çift ödemeye karşı korunur.

### 4. 🎫 Merkezi Destek & Operasyon Havuzu (Centralized Ticketing)
- Şube ve acentelerin şirket merkez operasyon birimiyle iletişim kurmasını sağlayan kategorize edilmiş (`TECHNICAL`, `POLICY_APPROVAL`, `FINANCE`) canlı mesajlaşma ve dosya takip sistemi.

### 5. ⚡ Gerçek Zamanlı Bildirimler (WebSockets)
- Socket.io entegrasyonu sayesinde poliçe sahiplenme, durum güncellemeleri ve yeni destek mesajları anında istemciye iletilir ve TanStack Query önbelleğini dinamik olarak yeniler.

---

## 🛠️ Teknoloji Yığını ve Paket Versiyonları

Projeye ait güncel paket sürümleri `package.json` dosyalarından doğrulanmıştır:

| Alan | Teknoloji / Kütüphane | Versiyon | Görev / Kullanım Alanı |
| :--- | :--- | :--- | :--- |
| **Monorepo** | **Turborepo** | `^2.x` | Akıllı build önbellekleme ve çoklu paket orkestrasyonu |
| **Paket Yöneticisi** | **pnpm** | `10.25.0` | Katı ve hızlı bağımlılık yönetimi |
| **Frontend Core** | **Next.js** | `16.3.0` | React Server Components (RSC) & App Router |
| **UI Kütüphanesi** | **React & React-DOM** | `19.2.8` | En güncel React UI motoru |
| **Stil / Tasarım** | **Tailwind CSS** | `^4.0.0` | PostCSS tabanlı modern CSS mimarisi |
| **Bileşen Seti** | **Radix UI & Lucide** | `1.6.7` / `1.31.0` | Erişilebilir headless bileşenler ve ikonlar |
| **Veri Tabloları** | **AG Grid (`ag-grid-react`)** | `36.1.0` | Milyonlarca satırı destekleyen sanallaştırılmış veri ızgarası |
| **Grafik & Analitik** | **amCharts 5** | `5.20.1` | İnteraktif performans ve finansal analiz panelleri |
| **Server State** | **TanStack React Query** | `5.101.4` | Axios ile veri çekme, önbellekleme ve arka plan senkronizasyonu |
| **Client UI State** | **Zustand** | `5.0.14` | Modal, sidebar ve filtreler için hafif UI state yönetimi |
| **Backend Core** | **NestJS** | `11.0.1` | Modüler, ölçeklenebilir ve kurumsal Node.js framework'ü |
| **ORM / Veritabanı**| **Prisma Client** | `6.4.1` | MongoDB veri modellemesi ve type-safe sorgu motoru |
| **Kimlik & Güvenlik**| **Passport JWT & Bcrypt**| `^11.0` / `^6.0` | Stateless kimlik doğrulama & şifreleme |
| **Gerçek Zamanlı** | **Socket.io** | `4.8.3` | Çift yönlü gerçek zamanlı olay iletimi |
| **Test (Web/API)** | **Vitest / Jest / Playwright**| `4.1` / `30.0` / `1.62`| Kapsamlı birim, entegrasyon ve uçtan uca (E2E) testler |

---

## 🚀 Hızlı Başlangıç (Quick Start)

### Ön Gereksinimler
- **Node.js**: `v20.x` veya üzeri
- **pnpm**: `v10.x` veya üzeri
- **MongoDB**: `v7.0+` (veya Docker)

### 1. Depoyu Klonlayın ve Bağımlılıkları Yükleyin
```bash
git clone https://github.com/bgungor1/InsuraHub.git
cd InsuraHub
pnpm install
```

### 2. Çevre Değişkenlerini Ayarlayın

**Backend (`apps/api/.env`):**
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=MongoDB Atlas bağlantı adresiniz
JWT_SECRET="your_jwt_key_here"
JWT_EXPIRATION="8h"
FRONTEND_URL="http://localhost:3000"
SEED_ADMIN_PASSWORD="your_password_here"
```

**Frontend (`apps/web/.env.local`):**
```env
PORT=3000
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 3. Veritabanını Hazırlayın ve Tohumlayın (Seeding)
```bash
# Prisma Client'ı oluşturun
pnpm --filter api exec prisma generate

# Başlangıç verilerini (SuperAdmin ve Test Şirketi) yükleyin
pnpm --filter api seed
```

> **Varsayılan Giriş:**  
> **E-posta:** `admin@insurahub.com`  
> **Parola:** `.env` dosyasında tanımlanan veya `123456`

---

## ⚡ Çalıştırma ve Geliştirme Komutları

Turborepo sayesinde tüm monorepo komutları kök dizinden yönetilebilir:

```bash
# Tüm uygulamaları (Frontend & Backend) paralel olarak geliştirme modunda başlatır
pnpm dev

# Tüm projeleri derler (Production build)
pnpm build

# Kod kalitesi ve lint kontrollerini çalıştırır
pnpm lint

# Tüm test suite'lerini koşturur
pnpm test
```

### Belirli Bir Uygulama Üzerinde Çalışma:
```bash
# Yalnızca Frontend (Next.js) başlat:
pnpm --filter web dev

# Yalnızca Backend (NestJS) başlat:
pnpm --filter api dev

# Yalnızca Backend Unit testlerini çalıştır:
pnpm --filter api test

# Yalnızca Frontend E2E testlerini çalıştır:
pnpm --filter web exec playwright test
```

---

## 🐳 Docker ile Tek Komutta Çalıştırma

Tüm sistemi (MongoDB, NestJS API ve Next.js Web) container ortamında ayağa kaldırmak için:

```bash
docker-compose up -d --build
```

- **Web Portalı:** [http://localhost:3000](http://localhost:3000)
- **REST & Socket API:** [http://localhost:3001](http://localhost:3001)
- **MongoDB Veritabanı:** `localhost:27017`

---

## 🧪 Test Stratejisi

InsuraHub katı test standartlarına göre geliştirilmektedir:

- **Birim & Entegrasyon (Backend):** Jest kullanılarak servisler ve state transition testleri uygulanır.
- **Birim & UI Testleri (Frontend):** Vitest ve React Testing Library ile bileşen izolasyonu sağlanır.
- **Uçtan Uca (E2E):** Playwright senaryoları ile login, poliçe oluşturma, claim ve onay akışları taranır.

---

## 🤝 Katkıda Bulunma

1. Projeyi Fork'layın (`Fork`)
2. Özellik Dalınızı Açın (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi Commit Edin (`git commit -m 'feat: Yeni özellik eklendi'`)
4. Dalınıza Push Edin (`git push origin feature/YeniOzellik`)
5. Bir **Pull Request** Oluşturun

---

## 📄 Lisans

Bu proje özel mülkiyet altındadır (Private Repository). Tüm hakları saklıdır.
