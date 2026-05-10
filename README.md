# XRay AI — Frontend Dokumentasi

> **Dokumen ini diperbarui otomatis setiap kali ada perubahan pada proyek.**

---

## Deskripsi Proyek

Website **Next.js 16** (App Router + TypeScript + Tailwind CSS v4) untuk sistem klasifikasi X-ray dada multi-label yang terintegrasi dengan backend FastAPI di `http://localhost:8000`.

Sistem ini mampu mendeteksi **8 label penyakit paru-paru** sekaligus, dilengkapi dengan visualisasi GradCAM dan laporan medis otomatis dalam Bahasa Indonesia.

---

## Teknologi yang Digunakan

| Teknologi | Versi | Keterangan |
|---|---|---|
| Next.js | 16.2.4 | App Router, TypeScript |
| React | 19.2.4 | Server & Client Components |
| Tailwind CSS | ^4 | Styling murni tanpa library UI |
| TypeScript | ^5 | Type safety penuh |
| ESLint | ^9 | Linting |

---

## Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Salin file environment (sudah tersedia)
# .env.local sudah dikonfigurasi: NEXT_PUBLIC_API_URL=http://localhost:8000

# 3. Jalankan development server
npm run dev

# 4. Buka browser di http://localhost:3000
```

> **Prasyarat:** Pastikan backend FastAPI berjalan di `http://localhost:8000` sebelum menggunakan fitur analisis.

---

## Struktur File

```
src/
├── app/
│   ├── layout.tsx              # Root layout: Navbar + Footer
│   ├── page.tsx                # Halaman Upload (/)
│   ├── globals.css             # Global styles + CSS tokens
│   ├── results/
│   │   └── page.tsx            # Halaman Results (/results)
│   └── api/
│       └── analyze/
│           └── route.ts        # Proxy API ke FastAPI (menghindari CORS)
├── components/
│   ├── UploadZone.tsx          # Drag-and-drop upload area
│   ├── ProgressOverlay.tsx     # Full-screen overlay animasi pipeline
│   ├── ImageViewer.tsx         # Tab viewer Original/ROI + coverage %
│   ├── GradCAMViewer.tsx       # Heatmap GradCAM per label
│   ├── DiseaseSummaryCard.tsx  # Kartu ringkasan TB & Pneumonia
│   ├── ClassificationTable.tsx # Tabel 8 label + probability bar
│   ├── ReportPanel.tsx         # Panel laporan AI (Bahasa Indonesia)
│   └── ProcessingInfo.tsx      # Accordion waktu pemrosesan pipeline
└── lib/
    ├── types.ts                # TypeScript interfaces API
    ├── disease-groups.ts       # Label groups TB/Pneumonia + helpers
    └── api.ts                  # Fetch wrapper ke /api/analyze
```

---

## Halaman & Fitur

### Halaman 1: Upload (`/`)

- **Hero section** dengan deskripsi sistem, badge fitur, dan dekorasi gradien
- **UploadZone**: drag-and-drop + click to browse, validasi PNG/JPEG/DICOM maks 10MB, preview gambar (DICOM menggunakan icon placeholder)
- **ProgressOverlay**: full-screen overlay dengan 6 tahapan animasi:
  `Preprocessing → Segmentasi → Ekstraksi Fitur → Klasifikasi → GradCAM → Pembuatan Laporan`
- **Toast notification** saat terjadi error analisis

### Halaman 2: Results (`/results`)

Layout dua kolom (desktop) / satu kolom (mobile):

**Kolom Kiri:**
1. **ImageViewer** — Tab switcher "Original" | "ROI (Segmented)" + lung coverage %
2. **GradCAMViewer** — Heatmap per label terdeteksi + legenda warna (hanya jika ada)

**Kolom Kanan:**
3. **DiseaseSummaryCard** — 2 kartu: TB dan Pneumonia dengan badge POSSIBLE/NOT DETECTED
4. **ClassificationTable** — 8 label + probability bar (orange=detected, gray=normal)
5. **ReportPanel** — Laporan AI dalam Bahasa Indonesia + disclaimer
6. **ProcessingInfo** — Accordion total waktu + breakdown per tahap pipeline

---

## Logika Pengelompokan Penyakit (Frontend)

Dihitung di sisi client dari respons backend:

```typescript
PNEUMONIA_LABELS = ["Infiltration", "Consolidation", "Nodule"]
TB_LABELS = ["Infiltration", "Fibrosis", "Effusion", "Atelectasis",
             "Consolidation", "Nodule", "Mass"]

// Terdeteksi jika minimal satu label dari kelompok = true
isDiseaseDetected = (predictions, group) => group.some(label => predictions[label])
```

---

## API Routes

| Method | Endpoint | Keterangan |
|---|---|---|
| `POST` | `/api/analyze` | Proxy ke FastAPI, forward FormData file |
| `GET` | `http://localhost:8000/api/health` | Cek status backend |
| `GET` | `http://localhost:8000/api/labels` | Ambil daftar label |

---

## Catatan Penting

- Semua gambar base64 dari backend sudah lengkap sebagai data URI — langsung digunakan di `<img src>`
- GradCAM hanya ada untuk label yang terdeteksi — ditangani secara graceful
- Laporan teks dalam **Bahasa Indonesia** — tidak diterjemahkan
- State hasil analisis disimpan di `sessionStorage` dan dapat dipulihkan saat refresh
- Backend berjalan di CPU, membutuhkan 8–15 detik — progress overlay menggunakan animasi timed

---

## Riwayat Perubahan

### [2026-04-27] — Inisialisasi Proyek

**Setup & Konfigurasi:**
- Inisialisasi proyek Next.js 16.2.4 dengan TypeScript, Tailwind CSS v4, ESLint, App Router
- Konfigurasi `.env.local` dengan `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Update `globals.css` dengan design tokens, animasi, dan Google Font Inter

**File Baru yang Dibuat:**
- `src/lib/types.ts` — TypeScript interfaces: `AnalyzeResponse`, `PipelineSteps`, `LabelKey`, dll.
- `src/lib/disease-groups.ts` — Konstanta `PNEUMONIA_LABELS`, `TB_LABELS`, fungsi helper deteksi
- `src/lib/api.ts` — Fetch wrapper: `analyzeImage()`, `checkHealth()`, `fetchLabels()`
- `src/app/api/analyze/route.ts` — Next.js API route proxy ke FastAPI (menghindari CORS)
- `src/app/layout.tsx` — Root layout dengan Navbar sticky + Footer disclaimer
- `src/app/page.tsx` — Halaman upload dengan hero section dan feature pills
- `src/app/results/page.tsx` — Halaman hasil analisis layout dua kolom
- `src/components/UploadZone.tsx` — Drag-and-drop upload dengan preview dan validasi
- `src/components/ProgressOverlay.tsx` — Full-screen overlay animasi 6 tahapan pipeline
- `src/components/ImageViewer.tsx` — Tab switcher Original/ROI + lung coverage bar
- `src/components/GradCAMViewer.tsx` — GradCAM heatmap viewer per label + legenda
- `src/components/DiseaseSummaryCard.tsx` — Kartu status TB/Pneumonia dengan badge
- `src/components/ClassificationTable.tsx` — Tabel 8 label dengan probability bar
- `src/components/ReportPanel.tsx` — Panel laporan AI + disclaimer
- `src/components/ProcessingInfo.tsx` — Accordion breakdown waktu pipeline

**Design Decisions:**
- Menggunakan Tailwind CSS v4 murni tanpa library UI eksternal (sesuai instruksi README)
- Medical aesthetic: white background, sky-500/blue-600 accent, slate palette
- Animasi: fade-in, pulse-soft, spin-slow untuk UX yang responsif
- Data flow: sessionStorage untuk persistensi hasil antara halaman upload dan results
