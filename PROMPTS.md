# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Membuat modul koneksi Supabase sisi server di `lib/supabase/server.js` dan `lib/supabase/index.js` menggunakan `@supabase/supabase-js` dengan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY` dari environment variable.
- Mengubah `app/page.jsx` menjadi Server Component asynchronous untuk mengambil data produk dari tabel `produk` Supabase diurutkan berdasarkan `id`.
- Menampilkan produk dengan komponen `KartuProduk` tanpa mengubah tampilannya.
- Menampilkan pesan error yang jelas jika query atau koneksi database mengalami kegagalan.
- Menampilkan teks "Belum ada produk" saat daftar produk kosong.
- Menghapus komponen `CatatanBelumAktif`.

**Perbaikan:**
- Menambahkan `export const dynamic = "force-dynamic"` pada `app/page.jsx` agar data katalog selalu diambil secara dinamis di sisi server pada setiap request (tidak tersimpan sebagai konten statis saat build).

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- Mengubah `app/produk/[id]/page.jsx` agar mengambil detail satu produk langsung dari tabel `produk` di Supabase berdasarkan parameter `id` di sisi server memakai `createServerClient` dari `lib/supabase/server`.
- Menjaga tampilan halaman tetap sama (foto, kategori, nama, harga rupiah, deskripsi, dan tombol WhatsApp).
- Memanggil `notFound()` dari `next/navigation` jika produk tidak ditemukan atau id tidak valid.
- Menghapus komponen dan pemanggilan `CatatanBelumAktif`.

**Perbaikan:**
- Memastikan pemanggilan fungsi `notFound()` ditempatkan di luar blok `try...catch` agar exception navigasi internal Next.js (`NEXT_NOT_FOUND`) tidak tertangkap sebagai error biasa.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- Mengubah elemen tombol pada `components/TombolWhatsApp.jsx` menjadi tautan `<a>` menuju `https://wa.me/<nomor>?text=<pesan>`.
- Mengambil nomor WhatsApp dari `lib/toko.js`.
- Pesan terisi otomatis berisi nama dan harga produk dalam format rupiah menggunakan `formatRupiah`, serta di-encode dengan `encodeURIComponent`.
- Menambahkan `target="_blank"` dan `rel="noopener noreferrer"` agar terbuka di tab baru.
- Mempertahankan gaya tampilan tombol yang sudah ada.
- Memastikan `CatatanBelumAktif` sudah dihapus dari halaman detail produk (`app/produk/[id]/page.jsx`).

**Perbaikan:**
- Menambahkan logika normalisasi nomor telepon agar karakter non-digit dibersihkan dan nomor yang diawali angka `0` otomatis diubah menjadi format internasional (`62`) sehingga tautan WhatsApp selalu valid.

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
