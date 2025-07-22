"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useCallback } from "react";
// Sesuaikan import API: pastikan nama fungsi yang diimport sesuai
import {
  fetchOrder,
  createOrder, // Fungsi createOrder yang sudah diupdate
  deleteOrder,
  updateOrder,
  fetchPelanggan, // Mengganti fetchPelanggan agar konsisten
  fetchProduk,
} from "@/lib/api"; // Sesuaikan path jika perlu
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
import OrderFormModal from "./OrderFormModal"; // Path sudah benar

// --- INTERFACES BARU UNTUK ORDER, CUSTOMER, DAN PRODUCT ---
interface Order {
  id: string; // ULID di Laravel
  customer_id: string; // ULID
  order_date: string; // Tanggal dalam format string (misal: "2023-10-27")
  total_amount: number;
  status: string;
  // Jika Anda ingin menampilkan order_items di tabel utama, tambahkan ini:
  order_items?: OrderItem[];
  customer?: Customer; // Menambahkan relasi customer untuk ditampilkan langsung
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Produk; // Untuk mengakses nama produk dari OrderItem
}

interface Customer {
  id: string; // ULID
  name: string;
}

interface Produk {
  id: string; // ULID
  name: string;
  price: number; // Penting untuk logika di modal
  stock: number; // Penting untuk logika di modal
}
// --- AKHIR INTERFACES ---

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Produk[]>([]); // Digunakan untuk OrderFormModal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // getToken() sudah ada di dalam fungsi fetch di api.ts, jadi tidak perlu diteruskan di sini
      const [orderData, customerData, productData] = await Promise.all([
        fetchOrder(), // fetchOrder tidak memerlukan token sebagai argumen lagi jika sudah di header
        fetchPelanggan(), // Gunakan fetchCustomers agar konsisten dengan api.ts
        fetchProduk(), // fetchProduk tidak memerlukan token sebagai argumen jika sudah di header
      ]);

      setOrders(orderData);
      setCustomers(customerData);
      setProducts(productData); // Set data produk
    } catch (err) {
      toast.error("Gagal memuat data pesanan dari server.");
      console.error(err);
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.success("Pesanan berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus data pesanan");
      console.error(err);
    }
  };

  // Tipe data untuk `data` pada `updateOrder` harus sesuai dengan interface Order
  const handleUpdate = async (data: Order) => {
    try {
      // Ketika update, kita mengirim data Order secara keseluruhan (atau sebagian)
      await updateOrder(data.id, data);
      await loadData();
      toast.success("Pesanan berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate pesanan");
      console.error(err);
    }
  };

  // PERBAIKAN: Tipe data input untuk `handleCreate` harus sesuai dengan yang diharapkan backend
  const handleCreate = async (data: {
    customer_id: string;
    items: { product_id: string; quantity: number }[];
  }) => {
    try {
      await createOrder(data); // Panggil createOrder dengan struktur data yang benar
      await loadData();
      toast.success("Pesanan berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan pesanan");
      console.error(err);
    }
  };

  // Helper untuk mendapatkan nama customer dari customer_id
  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "N/A";
  };

  if (loading) {
    return <div className="p-4">Memuat data pesanan, pelanggan, dan produk...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Pesanan</h2>
        <OrderFormModal
          onSubmit={handleCreate} // Ini memicu proses CREATE/CHECKOUT
          customers={customers}
          products={products} // Teruskan data products ke modal untuk pemilihan item
          trigger={<Button>+ Tambah Pesanan</Button>}
          isCreating={true} // Indikator bahwa ini untuk membuat pesanan baru
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead>Pelanggan</TableHead>
            <TableHead>Tanggal Pesanan</TableHead>
            <TableHead>Jumlah Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Tidak ada data pesanan.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((orderItem, index) => (
              <TableRow key={orderItem.id}>
                <TableCell>{index + 1}</TableCell>
                {/* Asumsi `orderItem.customer` ada karena eager loaded */}
                <TableCell>{orderItem.customer?.name || "N/A"}</TableCell>
                <TableCell>{orderItem.order_date}</TableCell>
                <TableCell>
                  {orderItem.total_amount.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </TableCell>
                <TableCell>{orderItem.status}</TableCell>
                <TableCell className="text-right space-x-2">
                  <OrderFormModal
                    order={orderItem} // Ini memicu proses UPDATE
                    onSubmit={handleUpdate}
                    customers={customers}
                    products={products} // Teruskan data products ke modal
                    trigger={
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    }
                    isCreating={false} // Indikator bahwa ini untuk mengedit pesanan
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
                          Yakin ingin menghapus pesanan ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini tidak bisa dibatalkan. Stok produk akan
                          dikembalikan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(orderItem.id)}
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