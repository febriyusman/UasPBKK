"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react"; // Import ikon

// --- INTERFACES BARU (konsisten dengan OrderList.tsx) ---
interface Order {
  id?: string;
  customer_id: string;
  order_date: string;
  total_amount: number;
  status: string;
}

interface Customer {
  id: string;
  name: string;
}

interface Produk {
  id: string;
  name: string;
  price: number;
  stock: number;
}

// Interface baru untuk item di form (belum tentu OrderItem lengkap)
interface FormOrderItem {
  product_id: string;
  quantity: number;
  product_name?: string; // Untuk tampilan di form
  product_stock?: number; // Untuk tampilan dan validasi di form
  product_price?: number; // Untuk tampilan di form
}

interface Props {
  order?: Order; // Objek order untuk mode edit
  trigger: React.ReactNode;
  // Perbaiki tipe onSubmit:
  // Jika membuat, data hanya customer_id dan items.
  // Jika mengedit, data adalah Order lengkap.
  onSubmit: (
    data:
      | { customer_id: string; items: { product_id: string; quantity: number }[] }
      | Order
  ) => void;
  customers: Customer[];
  products: Produk[]; // Teruskan daftar produk
  isCreating: boolean; // Flag untuk membedakan mode 'create' dan 'edit'
}

export default function OrderFormModal({
  customers,
  products,
  order,
  trigger,
  onSubmit,
  isCreating, // Terima prop isCreating
}: Props) {
  const [open, setOpen] = useState(false);
  // State untuk data order utama (customer_id, status untuk edit)
  const [orderForm, setOrderForm] = useState<{
    customer_id: string;
    status: string;
  }>({
    customer_id: order?.customer_id || "",
    status: order?.status || "pending", // Default status untuk create
  });

  // State untuk daftar item yang akan dipesan (hanya relevan untuk CREATE)
  const [formOrderItems, setFormOrderItems] = useState<FormOrderItem[]>([]);

  // Efek untuk mereset form saat modal dibuka atau `order`/`isCreating` berubah
  useEffect(() => {
    if (open) {
      setOrderForm({
        customer_id: order?.customer_id || "",
        status: order?.status || "pending",
      });

      // Untuk mode CREATE, inisialisasi items kosong
      if (isCreating) {
        setFormOrderItems([]);
      } else {
        // Untuk mode EDIT, jika perlu menampilkan order items yang ada (misal: untuk mengedit kuantitas)
        // Saat ini, backend belum mengirimkan order_items langsung dengan order GET /order/:id
        // Jadi, untuk edit, kita hanya fokus pada customer_id dan status
        // Jika Anda ingin mengedit order_items dari sini, Anda perlu fetch detail order item secara terpisah
        setFormOrderItems([]); // Kosongkan saja untuk edit jika tidak mengelola order_items dari sini
      }
    }
  }, [open, order, isCreating]);

  const handleOrderFormChange = (name: keyof typeof orderForm, value: string) => {
    setOrderForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // --- Logic untuk mengelola daftar produk di dalam pesanan (hanya untuk CREATE) ---
  const handleAddItem = () => {
    setFormOrderItems((prevItems) => [
      ...prevItems,
      { product_id: "", quantity: 1 },
    ]);
  };

  const handleOrderItemChange = (
    index: number,
    field: keyof FormOrderItem,
    value: string | number
  ) => {
    setFormOrderItems((prevItems) => {
      const newItems = [...prevItems];
      const itemToUpdate = newItems[index];

      // Jika mengubah product_id, update nama, stok, dan harga produk
      if (field === "product_id" && typeof value === "string") {
        const selectedProduct = products.find((p) => p.id === value);
        if (selectedProduct) {
          itemToUpdate.product_id = value;
          itemToUpdate.product_name = selectedProduct.name;
          itemToUpdate.product_stock = selectedProduct.stock;
          itemToUpdate.product_price = selectedProduct.price;
        } else {
          // Reset jika produk tidak ditemukan
          itemToUpdate.product_id = "";
          itemToUpdate.product_name = undefined;
          itemToUpdate.product_stock = undefined;
          itemToUpdate.product_price = undefined;
        }
      } else if (field === "quantity" && typeof value === "number") {
        itemToUpdate.quantity = value;
      }
      return newItems;
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormOrderItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };
  // --- Akhir Logic untuk mengelola daftar produk di dalam pesanan ---

  const handleSubmit = () => {
    if (isCreating) {
      // Logic untuk membuat pesanan baru (checkout)
      // Validasi item sebelum submit
      const hasInvalidItems = formOrderItems.some(
        (item) =>
          !item.product_id ||
          item.quantity <= 0 ||
          item.quantity > (item.product_stock ?? 0)
      );

      if (formOrderItems.length === 0) {
        alert("Harap tambahkan setidaknya satu produk ke pesanan.");
        return;
      }

      if (hasInvalidItems) {
        alert("Harap periksa kembali produk dan kuantitas pesanan Anda (stok tidak cukup atau data tidak valid).");
        return;
      }

      const dataToSubmit = {
        customer_id: orderForm.customer_id,
        items: formOrderItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };
      onSubmit(dataToSubmit); // Kirim data sesuai format backend untuk create
    } else {
      // Logic untuk mengedit pesanan yang sudah ada (OrderController@update)
      // Mengirim data order lengkap (id, customer_id, total_amount, status)
      // total_amount dan order_date tidak diubah langsung dari frontend, hanya customer_id dan status yang bisa diupdate admin
      const dataToSubmit: Order = {
        id: order?.id, // Pastikan ID ada untuk update
        customer_id: orderForm.customer_id,
        order_date: order?.order_date || "", // Ambil dari order yang ada
        total_amount: order?.total_amount || 0, // Ambil dari order yang ada
        status: orderForm.status,
      };
      onSubmit(dataToSubmit); // Kirim data sesuai format backend untuk update
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[500px] md:max-w-[700px] lg:max-w-[900px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isCreating ? "Buat Pesanan Baru" : "Edit Pesanan"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Select untuk Customer (selalu ada) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pelanggan</label>
            <Select
              name="customer_id"
              value={orderForm.customer_id}
              onValueChange={(value) => handleOrderFormChange("customer_id", value)}
              disabled={!isCreating} // Disable jika sedang mengedit (customer tidak bisa diubah)
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Pelanggan" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((cust) => (
                  <SelectItem key={cust.id} value={cust.id}>
                    {cust.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isCreating ? (
            // --- Bagian untuk MEMBUAT PESANAN (Checkout) ---
            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2">Produk Pesanan</h3>
              {formOrderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 mb-3 p-2 border rounded-md"
                >
                  {/* Select Produk */}
                  <Select
                    value={item.product_id}
                    onValueChange={(value) =>
                      handleOrderItemChange(index, "product_id", value)
                    }
                    className="flex-1"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Produk" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((prod) => (
                        <SelectItem key={prod.id} value={prod.id}>
                          {prod.name} (Stok: {prod.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Input Kuantitas */}
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleOrderItemChange(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-20"
                    placeholder="Qty"
                    // Batasi input kuantitas berdasarkan stok produk yang dipilih
                    max={item.product_stock || 1}
                  />

                  {/* Tampilkan harga dan stok (info saja) */}
                  <div className="text-sm text-gray-500 w-32 text-right">
                    {item.product_price ? `Rp ${item.product_price.toLocaleString('id-ID')}` : 'Pilih Produk'}
                    {item.product_stock !== undefined && item.product_stock !== null && (
                      <span className="block">Stok: {item.product_stock}</span>
                    )}
                  </div>


                  {/* Tombol Hapus Item */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={handleAddItem}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk
              </Button>
            </div>
          ) : (
            // --- Bagian untuk MENGEDIT PESANAN (untuk admin) ---
            // Di sini Anda bisa menampilkan order_date, total_amount, dan status
            // order_date dan total_amount tidak bisa diubah langsung, status bisa
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pesanan</label>
                <Input
                  name="order_date"
                  type="text" // Type text karena tidak dimaksudkan untuk diubah dari sini
                  value={order?.order_date || ""}
                  disabled // Disabled karena diatur backend
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Total</label>
                <Input
                  name="total_amount"
                  type="text" // Type text karena tidak dimaksudkan untuk diubah dari sini
                  value={order?.total_amount?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) || "Rp 0"}
                  disabled // Disabled karena dihitung backend
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select
                  name="status"
                  value={orderForm.status}
                  onValueChange={(value) => handleOrderFormChange("status", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem> {/* Tambah refunded */}
                  </SelectContent>
                </Select>
              </div>
              {/* Jika ingin admin bisa mengedit order_items, Anda perlu fetch order_items
                  terpisah saat modal dibuka dan menampilkan list di sini */}
            </>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {isCreating ? "Buat Pesanan" : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}