# 🌐 InsuraHub Web (Frontend)

InsuraHub kurumsal sigorta ve acente yönetim sisteminin **Next.js 16 (App Router)** tabanlı kullanıcı arayüzü uygulamasıdır.

---

## 🛠️ Teknoloji Yığını

- **Framework:** Next.js 16.3.0 (React 19.2.8)
- **Stil:** Tailwind CSS v4, PostCSS, Shadcn UI, Radix UI
- **Veri Tabloları:** AG Grid (`ag-grid-react` v36.1)
- **Grafikler:** amCharts 5 (`@amcharts/amcharts5` v5.20)
- **State Yönetimi:** TanStack React Query v5 (Server State) & Zustand v5 (Client State)
- **Form & Doğrulama:** React Hook Form & Zod
- **Gerçek Zamanlı:** Socket.io Client v4.8
- **Test:** Vitest (Unit) & Playwright (E2E)

---

## 📂 Dizin Yapısı

```text
apps/web/
├── src/
│   ├── app/                      # Next.js App Router sayfaları
│   │   ├── (auth)/login/         # Giriş sayfası & Demo hesap listesi
│   │   └── (dashboard)/          # Dashboard ve alt modül sayfaları
│   │       ├── audit-logs/       # Denetim günlükleri
│   │       ├── commissions/      # Komisyon takibi & kuralları
│   │       ├── customers/        # Müşteri portföyü
│   │       ├── dashboard/        # KPI özetleri & grafikler
│   │       ├── organizations/    # Şirket, Acente ve Şube yönetimi
│   │       ├── policies/         # Poliçe oluşturma & yönetim tablosu
│   │       ├── tickets/          # Destek masası & mesajlaşma
│   │       └── users/            # Kullanıcı yönetimi
│   ├── components/               # Ortak UI & Layout bileşenleri
│   ├── features/                 # Domain bazlı özellik modülleri (hooks, services, types)
│   ├── hooks/                    # Genel yardımcı React hook'ları
│   ├── lib/                      # Axios API istemcisi & WebSocket bağlantıları
│   ├── middleware.ts             # Oturum & rota güvenlik katmanı
│   ├── stores/                   # Zustand state mağazaları
│   └── types/                    # Tip tanımları
├── tests/                        # E2E testleri (Playwright)
└── Dockerfile                    # Container derleme dosyası
```

---

## 🚀 Geliştirme ve Test Komutları

```bash
# Bağımlılıkları yükleyin (Kök dizinden)
pnpm install

# Geliştirme sunucusunu başlatın (Port: 3000)
pnpm --filter web dev

# Projeyi derleyin
pnpm --filter web build

# Birim testlerini çalıştırın (Vitest)
pnpm --filter web test

# E2E testlerini çalıştırın (Playwright)
pnpm --filter web exec playwright test
```
