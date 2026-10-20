import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import Tombol from "@/components/Tombol";
import { createServerClient } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const sp = await searchParams;
  const q = (sp?.q || "").trim();
  const kategori = (sp?.kategori || "").trim();
  const urutan = sp?.urutan || "terbaru";
  const halaman = Math.max(1, parseInt(sp?.halaman, 10) || 1);
  const limit = 12;
  const from = (halaman - 1) * limit;
  const to = from + limit - 1;

  let daftarProduk = [];
  let totalProduk = 0;
  let daftarKategori = [];
  let pesanError = null;

  try {
    const supabase = createServerClient();

    // Ambil daftar kategori unik dari tabel produk
    const { data: katData } = await supabase.from("produk").select("kategori");
    if (katData) {
      daftarKategori = [
        ...new Set(katData.map((p) => p.kategori).filter(Boolean)),
      ].sort();
    }

    // Bangun query produk dengan filter, search, sort, dan pagination (US-11, US-15, US-16)
    let query = supabase.from("produk").select("*", { count: "exact" });

    if (kategori) {
      query = query.eq("kategori", kategori);
    }

    if (q) {
      query = query.ilike("nama", `%${q}%`);
    }

    if (urutan === "termurah") {
      query = query
        .order("harga", { ascending: true })
        .order("id", { ascending: true });
    } else if (urutan === "termahal") {
      query = query
        .order("harga", { ascending: false })
        .order("id", { ascending: false });
    } else {
      // default: terbaru
      query = query
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });
    }

    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
      totalProduk = count || 0;
    }
  } catch (err) {
    pesanError = err.message || "Gagal menghubungkan ke database.";
  }

  const totalPages = Math.max(1, Math.ceil(totalProduk / limit));

  // Helper untuk membuat link navigasi mempertahankan parameter
  function createPageUrl(
    targetPage,
    targetKat = kategori,
    targetSort = urutan,
    targetQ = q
  ) {
    const params = new URLSearchParams();
    if (targetQ) params.set("q", targetQ);
    if (targetKat) params.set("kategori", targetKat);
    if (targetSort && targetSort !== "terbaru") params.set("urutan", targetSort);
    if (targetPage > 1) params.set("halaman", String(targetPage));
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>
          {totalProduk > 0 && (
            <p className="text-sm text-teks-lembut">
              Menampilkan {from + 1}–{Math.min(to + 1, totalProduk)} dari{" "}
              {totalProduk} produk
            </p>
          )}
        </div>

        {/* Form Filter, Pencarian (US-11), dan Urutan (US-15) */}
        <div className="flex flex-col gap-3 rounded-2xl border border-garis bg-permukaan p-4">
          <form
            method="GET"
            action="/"
            className="grid gap-3 sm:grid-cols-2 md:grid-cols-4"
          >
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Cari nama produk..."
              className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
            />
            <select
              name="kategori"
              defaultValue={kategori}
              className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
            >
              <option value="">Semua kategori</option>
              {daftarKategori.map((kat) => (
                <option key={kat} value={kat}>
                  {kat}
                </option>
              ))}
            </select>
            <select
              name="urutan"
              defaultValue={urutan}
              className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
            >
              <option value="terbaru">Terbaru</option>
              <option value="termurah">Harga: termurah</option>
              <option value="termahal">Harga: termahal</option>
            </select>
            <div className="flex gap-2">
              <Tombol type="submit" className="flex-1 py-2">
                Cari
              </Tombol>
              {(q ||
                kategori ||
                (urutan && urutan !== "terbaru") ||
                halaman > 1) && (
                <Tombol href="/" varian="garis" className="py-2">
                  Reset
                </Tombol>
              )}
            </div>
          </form>

          {/* Quick pills filter kategori */}
          {daftarKategori.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="font-semibold text-teks-lembut">Kategori:</span>
              <Link
                href={createPageUrl(1, "", urutan, q)}
                className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
                  !kategori
                    ? "bg-utama text-white"
                    : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
                }`}
              >
                Semua
              </Link>
              {daftarKategori.map((kat) => (
                <Link
                  key={kat}
                  href={createPageUrl(1, kat, urutan, q)}
                  className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
                    kategori === kat
                      ? "bg-utama text-white"
                      : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
                  }`}
                >
                  {kat}
                </Link>
              ))}
            </div>
          )}
        </div>

        {pesanError ? (
          <div className="rounded-xl border border-garis bg-permukaan p-4 text-bahaya">
            <p className="font-semibold">Gagal memuat produk: {pesanError}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <p className="py-8 text-center text-teks-lembut">Belum ada produk</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}

        {/* Paginasi (US-16) */}
        {totalPages > 1 && (
          <nav
            aria-label="Navigasi halaman produk"
            className="mt-4 flex items-center justify-center gap-2"
          >
            {halaman > 1 ? (
              <Tombol
                href={createPageUrl(halaman - 1)}
                varian="garis"
                className="px-3 py-1.5 text-xs"
              >
                Sebelumnya
              </Tombol>
            ) : (
              <span className="cursor-not-allowed rounded-lg border border-garis bg-permukaan px-3 py-1.5 text-xs text-teks-lembut opacity-50">
                Sebelumnya
              </span>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isActive = p === halaman;
                return (
                  <Link
                    key={p}
                    href={createPageUrl(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-utama text-white"
                        : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>

            {halaman < totalPages ? (
              <Tombol
                href={createPageUrl(halaman + 1)}
                varian="garis"
                className="px-3 py-1.5 text-xs"
              >
                Berikutnya
              </Tombol>
            ) : (
              <span className="cursor-not-allowed rounded-lg border border-garis bg-permukaan px-3 py-1.5 text-xs text-teks-lembut opacity-50">
                Berikutnya
              </span>
            )}
          </nav>
        )}
      </section>
    </>
  );
}
