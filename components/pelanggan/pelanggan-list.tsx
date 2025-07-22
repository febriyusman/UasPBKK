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
import { createPelanggan, createProduk, deletePelanggan, deleteProduk, fetchPelanggan, fetchProduk, updatePelanggan, updateProduk } from "@/lib/api";
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
import PelangganFormModal from "./PelangganFormModal";

interface Pelanggan {
  id: number;
  name: string;
  email: string;
  password: number;
  phone: number;
  address: string;
  
}

export default function PelangganList() {
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([]);

  useEffect(() => {
    fetchPelanggan().then(setPelanggan);
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deletePelanggan(id, token);
      setPelanggan((prev) => prev.filter((u) => u.id !== id));
      toast.success("Pelanggan berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus data pelanggan");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await updatePelanggan(data.id, data, token);
      const updatedPelanggan= await fetchPelanggan();
      setPelanggan(updatedPelanggan);

      toast.success("Pelanggan berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate pelanggan");
    }
  };

  const handleCreate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await createPelanggan(data, token);
      const updated = await fetchPelanggan();
      setPelanggan(updated);
      toast.success("Pelanggan berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan pelanggan");
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar User</h2>
        <PelangganFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead>Nama </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>No HP</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pelanggan.map((pelanggan, index) => (
            <TableRow key={pelanggan.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{pelanggan.name}</TableCell>
              <TableCell>{pelanggan.email}</TableCell>
               <TableCell>{pelanggan.phone}</TableCell>
               <TableCell>{pelanggan.address}</TableCell>
              <TableCell className="text-right space-x-2">
                <PelangganFormModal
                  pelanggan={pelanggan}
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
                        onClick={() => handleDelete(pelanggan.id)}
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