# InsuraHub

**InsuraHub**, modern web teknolojileri ve monorepo mimarisi kullanılarak geliştirilen bir platform projesidir.

---

## 🚀 Teknolojiler ve Mimari

Bu proje **PNPM Workspaces** ve **Turborepo** tabanlı bir **Monorepo** yapısına sahiptir.

### 🏢 Uygulamalar (`apps/`)

* **`apps/web` (Frontend)**
  * **Framework:** Next.js 16 (App Router)
  * **Kütüphane & UI:** React 19, Tailwind CSS v4
  * **Veri Görselleştirme & Tablo:** amCharts 5, AG Grid (`ag-grid-react`)
  * **Test:** Vitest, React Testing Library, Playwright (E2E)
  * **Dil:** TypeScript

* **`apps/api` (Backend)**
  * **Framework:** NestJS 11
  * **ORM & Veritabanı:** Prisma ORM 7 (PostgreSQL)
  * **Gerçek Zamanlı İletişim:** WebSockets / Socket.io (`@nestjs/websockets`)
  * **Test:** Jest (Birim ve E2E)
  * **Dil:** TypeScript

---

## 🛠️ Kurulum ve Başlangıç

### Gereksinimler
* **Node.js** (v20+)
* **pnpm** (v9+)
* **PostgreSQL** (Veritabanı bağlantısı için)

### Bağımlılıkları Yükleme
```bash
pnpm install
```

---

## ⚡ Çalıştırma Komutları

Monorepo kök dizininde Turborepo kullanarak tüm uygulamaları yönetebilirsiniz:

### Kök Dizin Komutları (Turborepo)

| Komut | Açıklama |
| :--- | :--- |
| `pnpm dev` | Tüm uygulamaları (`web` ve `api`) geliştirme modunda başlatır |
| `pnpm build` | Tüm projeleri derler (`dist`, `.next`) |
| `pnpm lint` | Tüm projelerde linter çalıştırır |
| `pnpm test` | Test süreçlerini çalıştırır |

### Uygulama Bazlı Komutlar

* **Frontend (`apps/web`) Başlatma:**
  ```bash
  pnpm --filter web dev
  ```

* **Backend (`apps/api`) Başlatma:**
  ```bash
  pnpm --filter api start:dev
  ```

---

## 📁 Proje Yapısı

```text
InsuraHub/
├── apps/
│   ├── api/                  # NestJS Backend servisi
│   │   ├── prisma/           # Prisma ORM şeması (schema.prisma)
│   │   ├── src/              # NestJS modül, controller ve servisleri
│   │   └── test/             # Jest E2E ve birim testleri
│   │
│   └── web/                  # Next.js Frontend uygulaması
│       ├── src/app/          # Next.js App Router (sayfalar ve bileşenler)
│       ├── tests/            # Playwright ve Vitest test senaryoları
│       └── public/           # Statik medya dosyaları
│
├── package.json              # Monorepo kök bağımlılıkları ve Turborepo betikleri
├── pnpm-workspace.yaml       # PNPM monorepo workspace tanımları
└── turbo.json                # Turborepo görev yapılandırması
```

---

## 🧪 Test Yapılandırması

* **Backend (`apps/api`):**
  ```bash
  pnpm --filter api test       # Unit testler
  pnpm --filter api test:e2e   # E2E testler
  ```

* **Frontend (`apps/web`):**
  ```bash
  pnpm --filter web test       # Vitest unit/component testleri
  ```
