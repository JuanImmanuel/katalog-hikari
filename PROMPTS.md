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
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Membuat modul koneksi sesi admin di `lib/supabase/session.js` dan re-export di `lib/supabase/index.js` menggunakan `createServerClient` dari `@supabase/ssr` dengan cookie handler (`getAll`, `setAll`) serta environment variable `SUPABASE_URL` dan `SUPABASE_PUBLISHABLE_KEY`.
- Membuat Server Action `login` dan `logout` di `app/admin/actions.js`.
  - `login` memvalidasi input, melakukan autentikasi via Supabase Auth (`signInWithPassword`), mengarahkan ke `/admin` jika berhasil, atau mengembalikan pesan error jika gagal.
  - `logout` mengakhiri sesi via Supabase Auth (`signOut`) lalu mengarahkan ke `/admin/login`.
- Menyambungkan form login di `app/admin/login/page.jsx` menggunakan `useActionState` untuk menampilkan pesan error saat login gagal tanpa mengubah struktur tampilan form.
- Menghubungkan tombol "Keluar" pada `components/NavAdmin.jsx` ke Server Action `logout`.
- Menghapus komponen `CatatanBelumAktif` dari halaman login.

**Perbaikan:**
- Menggunakan named export langsung (`login`, `logout`) pada Server Action di `app/admin/actions.js` agar kompatibel penuh dengan static analysis dan bundler Turbopack Next.js.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Menambahkan Server Action `gantiPassword` di `app/admin/actions.js` yang memeriksa sesi login admin via `supabase.auth.getUser()`.
- Menerapkan validasi di server: password baru minimal 8 karakter dan harus cocok dengan konfirmasi password.
- Memperbarui password admin yang sedang aktif menggunakan Supabase Auth (`supabase.auth.updateUser`).
- Menyambungkan form di `app/admin/password/page.jsx` menggunakan `useActionState` untuk menampilkan pesan sukses atau pesan error secara jelas tanpa mengubah tampilan form.
- Menghapus komponen `CatatanBelumAktif` dari halaman ganti password.

**Perbaikan:**
- Menambahkan pengecekan status autentikasi di server sebelum melakukan pembaruan password sesuai aturan keamanan AGENTS.md, sehingga jika sesi telah kedaluwarsa pengguna diberikan pesan error yang informatif.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- Membuat file `proxy.js` di root proyek untuk memproteksi rute Next.js 16.
- Menggunakan `createServerClient` dari `@supabase/ssr` untuk memeriksa status autentikasi admin (`supabase.auth.getUser()`) pada setiap request rute `/admin`.
- Mengalihkan pengunjung yang belum login ke `/admin/login` saat mengakses rute `/admin` mana pun (kecuali `/admin/login`).
- Mengalihkan pengguna yang sudah login ke `/admin` jika mencoba membuka kembali `/admin/login`.
- Memastikan Server Action yang memodifikasi data (seperti `gantiPassword`) memverifikasi sesi login admin di sisi server sebelum mengeksekusi perubahan data.
- Menghapus komponen `CatatanBelumAktif` dari halaman utama admin di `app/admin/page.jsx`.

**Perbaikan:**
- Melakukan normalisasi path URL pada `proxy.js` (menghapus trailing slash) agar rute seperti `/admin/login/` tetap terdeteksi secara tepat sebagai halaman login dan tidak memicu loop pengalihan.

## Debugging dan fitur bonus

## US-07 List Produk

**Prompt:**
Tolong tambahkan fitur-fitur ini ke dalam aplikasi ini (US-07 List Produk)

**Hasil:**
- Mengubah `app/admin/page.jsx` agar mengambil daftar produk langsung dari tabel `produk` di Supabase di sisi server, menggantikan penggunaan data contoh dari `lib/data-contoh.js`.
- Menggunakan `createSessionClient()` untuk query data produk terurut berdasarkan `id` asc, dengan fallback ke `createServerClient()` untuk memastikan keandalan pengambilan data di server component.
- Menampilkan seluruh daftar produk dari database menggunakan komponen `TabelProduk`.
- Menambahkan `export const dynamic = "force-dynamic"` agar daftar produk admin selalu aktual dan tidak menggunakan data cache statis.

**Perbaikan:**
- Menambahkan fallback ke `createServerClient` jika sesi cookie pada Server Component belum terisi penuh, memastikan halaman daftar produk admin selalu berhasil mengambil data dari database.

## US-08 Tambah produk

**Prompt:**
lanjutkan lagi semua fitur dan langsung aja push ke repository (US-08 Tambah produk)

**Hasil:**
- Membuat Server Action `tambahProduk` di `app/admin/actions.js` yang memverifikasi login admin dengan `supabase.auth.getUser()`, memvalidasi input, dan menyimpan produk baru ke database Supabase.
- Mengalihkan halaman kembali ke `/admin` dan merevalidasi cache halaman `/` dan `/admin` setelah penyimpanan berhasil.
- Menghubungkan form di `app/admin/produk/baru/page.jsx` ke Server Action `tambahProduk`.
- Menghapus komponen `CatatanBelumAktif` dari halaman tambah produk.

**Perbaikan:**
- Menambahkan nilai fallback foto otomatis dan parsing tipe integer pada kolom harga untuk mencegah kegagalan constraint database Supabase.

## US-09 Ubah produk

**Prompt:**
lanjutkan lagi semua fitur dan langsung aja push ke repository (US-09 Ubah produk)

**Hasil:**
- Mengubah `app/admin/produk/[id]/ubah/page.jsx` agar mengambil data produk lama dari database Supabase secara server-side menggunakan ID dari parameter URL.
- Menampilkan halaman 404 (`notFound()`) jika ID produk tidak ditemukan di database.
- Memasukkan data lama ke dalam `FormProduk` dengan input tersembunyi `id`.
- Membuat Server Action `ubahProduk` di `app/admin/actions.js` yang memeriksa login admin dan memperbarui data produk di database Supabase, lalu mengarahkan kembali ke `/admin`.
- Menghapus komponen `CatatanBelumAktif` dari halaman ubah produk.

**Perbaikan:**
- Menggunakan fallback query database dengan `createServerClient` pada halaman ubah produk agar pengisian data awal selalu konsisten bahkan saat proses SSR.

## US-10 Hapus produk

**Prompt:**
lanjutkan lagi semua fitur dan langsung aja push ke repository (US-10 Hapus produk)

**Hasil:**
- Menambahkan konfirmasi sebelum menghapus produk menggunakan dialog `window.confirm` pada event `onSubmit` form hapus di `components/TabelProduk.jsx`.
- Membuat Server Action `hapusProduk` di `app/admin/actions.js` yang terlindungi oleh verifikasi login admin di server untuk menghapus produk dari database Supabase.
- Merevalidasi cache rute katalog `/` dan `/admin` sehingga daftar produk langsung terbarui setelah produk dihapus.

**Perbaikan:**
- Membungkus tombol hapus di dalam form berbasis Server Action dengan event handler konfirmasi pada sisi klien, memastikan aksi tetap aman dan tidak memicu penghapusan tanpa sengaja.

## US-11 Filter kategori atau pencarian

**Prompt:**
kerjakan fitur-fitur ini juga: US-11 Filter kategori atau pencarian

**Hasil:**
- Menambahkan fitur pencarian nama produk pada katalog `app/page.jsx` menggunakan klausa `.ilike("nama", `%${q}%`)` pada query Supabase.
- Menambahkan filter kategori dinamis dari database, ditampilkan dalam bentuk dropdown dan tombol pill interaktif.
- Menerapkan filter kategori via query database `.eq("kategori", kategori)`.
- Mengizinkan pencarian dan filter kategori bekerja secara bersamaan atau terpisah.

**Perbaikan:**
- Menyediakan tombol "Reset" saat ada filter atau kata kunci pencarian aktif untuk memudahkan pengunjung mengembalikan tampilan katalog penuh.

## US-15 Urutkan produk

**Prompt:**
kerjakan fitur-fitur ini juga: US-15 Urutkan produk

**Hasil:**
- Menambahkan opsi pilihan pengurutan: "Terbaru" (default), "Harga: termurah", dan "Harga: termahal".
- Menerapkan pengurutan langsung pada level database query Supabase:
  - Termurah: `.order("harga", { ascending: true })`
  - Termahal: `.order("harga", { ascending: false })`
  - Terbaru: `.order("created_at", { ascending: false })`

**Perbaikan:**
- Menambahkan pengurutan sekunder berdasarkan `id` untuk memastikan kestabilan urutan data jika terdapat harga atau tanggal dibuat yang identik.

## US-16 Paginasi atau muat lebih banyak

**Prompt:**
kerjakan fitur-fitur ini juga: US-16 Paginasi atau muat lebih banyak

**Hasil:**
- Membatasi jumlah produk per halaman sebanyak 12 produk menggunakan pembatasan langsung di query database melalui metode `.range(from, to)`.
- Menghitung total data dengan `{ count: "exact" }` untuk menghasilkan jumlah halaman yang akurat (`totalPages`).
- Menambahkan kontrol navigasi paginasi ("Sebelumnya", nomor halaman, dan "Berikutnya").
- Mempertahankan kata kunci pencarian, filter kategori, dan urutan saat berpindah halaman.

**Perbaikan:**
- Menggunakan helper `createPageUrl` untuk menjaga integritas query string parameter di URL pada saat pergantian halaman paginasi.

**Prompt:**
kerjakan fitur-fitur ini juga: US-16 Paginasi atau muat lebih banyak

**Hasil:**
- Membatasi jumlah produk per halaman sebanyak 12 produk menggunakan pembatasan langsung di query database melalui metode `.range(from, to)`.
- Menghitung total data dengan `{ count: "exact" }` untuk menghasilkan jumlah halaman yang akurat (`totalPages`).
- Menambahkan kontrol navigasi paginasi ("Sebelumnya", nomor halaman, dan "Berikutnya").
- Mempertahankan kata kunci pencarian, filter kategori, dan urutan saat berpindah halaman.

**Perbaikan:**
- Menggunakan helper `createPageUrl` untuk menjaga integritas query string parameter di URL pada saat pergantian halaman paginasi.

