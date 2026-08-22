# ⚙️ InsuraHub API (Backend)

InsuraHub kurumsal sigorta ve acente yönetim sisteminin **NestJS 11** tabanlı REST & WebSocket backend servisidir.

---

## 🛠️ Teknoloji Yığını

- **Framework:** NestJS 11.0.1 (Express platformu)
- **Veritabanı & ORM:** MongoDB & Prisma Client 6.4.1
- **Kimlik Doğrulama:** Passport JWT, Bcrypt, HTTP-Only Cookie & Bearer auth
- **Gerçek Zamanlı:** Socket.io Server v4.8 (`/policies` & `/notifications`)
- **Doğrulama & Dönüştürme:** Class Validator & Class Transformer
- **Test:** Jest & Supertest (36 Test Suite, 79 Test)

---

## 📂 Dizin Yapısı

```text
apps/api/
├── prisma/                       # schema.prisma şeması
├── src/
│   ├── auth/                     # JWT stratejileri, Guards, Roles, Auth Controller
│   ├── common/                   # Global filters, pipes, interceptors
│   ├── domains/                  # Modüler domain servisleri & kontrolleri
│   │   ├── agencies/             # Acente yönetimi
│   │   ├── audit-logs/           # Denetim günlüğü kayıt & listeleme
│   │   ├── branches/             # Şube yönetimi
│   │   ├── commissions/          # Komisyon hesaplama & kuralları
│   │   ├── companies/            # Sigorta şirketi yönetimi
│   │   ├── customers/            # Müşteri portföyü
│   │   ├── dashboard/            # Analitik KPI metrikleri
│   │   ├── notifications/        # WebSocket Gateway & anlık bildirimler
│   │   ├── policies/             # Poliçe State Machine, atamalar, WebSocket
│   │   ├── tickets/              # Operasyonel destek talepleri & mesajlaşma
│   │   └── users/                # Kullanıcı yönetimi & roller
│   ├── finance/                  # Finansal operasyonlar & raporlama
│   ├── prisma/                   # Prisma bağlantı servisi
│   ├── main.ts                   # Uygulama başlangıç noktası & CORS ayarları
│   └── seed.ts                   # Başlangıç veritabanı tohumlama betiği
└── Dockerfile                    # Container derleme dosyası
```

---

## 🚀 Geliştirme ve Test Komutları

```bash
# Bağımlılıkları yükleyin (Kök dizinden)
pnpm install

# Prisma istemcisini üretin
pnpm --filter api exec prisma generate

# Geliştirme sunucusunu başlatın (Port: 3001)
pnpm --filter api dev

# Testleri çalıştırın (36 Suite / 79 Test)
pnpm --filter api test

# Projeyi derleyin (Production build)
pnpm --filter api build
```
