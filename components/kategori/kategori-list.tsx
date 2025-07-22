// components/KategoriList.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useCallback } from "react"; // Import useCallback
import { createKategori, deleteKategori, fetchKategori, fetchProduk, updateKategori } from "@/lib/api"; // Hapus import createProduk, deleteProduk, updateProduk jika tidak digunakan di sini
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import KategoriFormModal from "./KategoriFormModal";

interface Kategori {
  id: number;
  product_id: string;
  name: string;
  description: string;
}

interface Produk {
  id: number;
  name: string;
}

export default function KategoriList() {
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [produk, setProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true); // Tambah state loading
  const [error, setError] = useState<string | null>(null); // Tambah state error

  // Menggunakan useCallback untuk fungsi loadData agar tidak dibuat ulang setiap render
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      // Ambil semua data secara paralel untuk efisiensi
      const [kategoriData, produkData] = await Promise.all([
        fetchKategori(token),
        fetchProduk(token),
      ]);
      setKategori(kategoriData);
      setProduk(produkData);
    } catch (err) {
      toast.error("Gagal memuat data dari server.");
      console.error(err);
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []); // Dependensi kosong karena tidak ada nilai dari luar yang digunakan

  // Panggil loadData saat komponen di-mount
  useEffect(() => {
    loadData();
  }, [loadData]); // Tambahkan loadData sebagai dependensi karena itu adalah fungsi

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteKategori(id, token);
      setKategori((prev) => prev.filter((u) => u.id !== id));
      toast.success("Kategori berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus data kategori");
      console.error(err);
    }
  };

  const handleUpdate = async (data: Kategori) => { // Perbaiki tipe data input
    const token = localStorage.getItem("token");
    try {
      await updateKategori(data.id as number, data, token); // Pastikan ID ada dan bertipe number
      await loadData(); // Muat ulang semua data setelah update
      toast.success("Kategori berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate Kategori");
      console.error(err);
    }
  };

  const handleCreate = async (data: Omit<Kategori, 'id'>) => { // Perbaiki tipe data input
    const token = localStorage.getItem("token");
    try {
      await createKategori(data, token);
      await loadData(); // Muat ulang semua data setelah create
      toast.success("Kategori berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan Kategori");
      console.error(err);
    }
  };

  // Helper untuk mendapatkan nama produk dari product_id
  const getProductName = (productId: string) => {
    const product = produk.find(p => String(p.id) === productId);
    return product ? product.name : "N/A"; // Return nama produk atau "N/A" jika tidak ditemukan
  };


  if (loading) {
    return <div className="p-4">Memuat data kategori dan produk...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        {/* Judul tabel lebih sesuai dengan konten */}
        <h2 className="text-xl font-semibold">Daftar Kategori Produk</h2> 
        <KategoriFormModal
          onSubmit={handleCreate}
          produk={produk} // Ini sudah benar
          trigger={<Button>+ Tambah Kategori</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead>Produk</TableHead> {/* Label header disesuaikan */}
            <TableHead>Nama Kategori</TableHead> {/* Label header disesuaikan */}
            <TableHead>Deskripsi Kategori</TableHead> {/* Label header disesuaikan */}
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kategori.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Tidak ada data kategori.
              </TableCell>
            </TableRow>
          ) : (
            kategori.map((kat, index) => ( // Ganti 'kategori' di map menjadi 'kat' untuk menghindari shadowing
              <TableRow key={kat.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{getProductName(kat.product_id)}</TableCell> {/* Tampilkan nama produk */}
                <TableCell>{kat.name}</TableCell>
                <TableCell>{kat.description}</TableCell>
                <TableCell className="text-right space-x-2">
                  <KategoriFormModal
                    kategori={kat} // Menggunakan 'kat' yang benar
                    onSubmit={handleUpdate}
                    produk={produk} // Ini sudah benar
                    trigger={
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Hapus
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Yakin ingin menghapus kategori ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini tidak bisa dibatalkan. Data akan hilang
                          permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(kat.id)} // Menggunakan 'kat.id' yang benar
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Ya, Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}