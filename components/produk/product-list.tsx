"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { createProduk, deleteProduk, fetchProduk, updateProduk } from "@/lib/api";
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
import ProdukFormModal from "./ProdukFormModal";
import { toast } from "sonner";

interface Produk {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export default function ProdukList() {
  const [produk, setProduk] = useState<Produk[]>([]);

  useEffect(() => {
    fetchProduk().then(setProduk);
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteProduk(id, token);
      setProduk((prev) => prev.filter((u) => u.id !== id));
      toast.success("Produk berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus data produk");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await updateProduk(data.id, data, token);
      const updatedProduk = await fetchProduk();
      setProduk(updatedProduk);

      toast.success("Barang berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate barang");
    }
  };

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);

  const handleCreate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await createProduk(data, token);
      const updated = await fetchProduk();
      setProduk(updated);
      toast.success("Barang berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan barang");
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar User</h2>
        <ProdukFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead>Nama Produk</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Harga Produk</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produk.map((produk, index) => (
            <TableRow key={produk.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{produk.name}</TableCell>
              <TableCell>{produk.description}</TableCell>
               <TableCell>{formatRupiah(produk.price)}</TableCell>
               <TableCell>{produk.stock}</TableCell>
               <TableCell>{produk.category}</TableCell>
              <TableCell className="text-right space-x-2">
                <ProdukFormModal
                  produk={produk}
                  onSubmit={handleUpdate}
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
                        Yakin ingin menghapus user ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang
                        permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(produk.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}