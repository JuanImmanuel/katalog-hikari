import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createSessionClient } from "@/lib/supabase/session";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  let daftarProduk = [];

  try {
    const supabase = await createSessionClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (!error && data) {
      daftarProduk = data;
    } else {
      const { createServerClient } = await import("@/lib/supabase/server");
      const serverSupabase = createServerClient();
      const { data: serverData } = await serverSupabase
        .from("produk")
        .select("*")
        .order("id", { ascending: true });
      if (serverData) daftarProduk = serverData;
    }
  } catch {
    const { createServerClient } = await import("@/lib/supabase/server");
    const serverSupabase = createServerClient();
    const { data: serverData } = await serverSupabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });
    if (serverData) daftarProduk = serverData;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      <TabelProduk daftarProduk={daftarProduk} />
    </div>
  );
}
