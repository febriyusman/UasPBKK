"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Produk {
  id?: number
  name: string
  description: string
  price?: number
  stock?: number
  category: string
}

interface Props {
  produk?: Produk
  trigger: React.ReactNode
  onSubmit: (data: Produk) => void
}

export default function ProdukFormModal({ produk, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Produk>({
    name: produk?.name || "",
    description: produk?.description || "",
    price: produk?.price || "",
    stock: produk?.stock || "",
    category: produk?.category || "",
    id: produk?.id || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSubmit(form)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{produk ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">

          <Input
            name="name"
            placeholder="Nama"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            name="description"
            placeholder="Deskripsi"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            name="price"
            placeholder="Harga"
            value={form.price}
            onChange={handleChange}
          />
          <Input
            name="stock"
            placeholder="Stok"
            value={form.stock}
            onChange={handleChange}
          />
          <Input
            name="category"
            placeholder="Kategori"
            value={form.category}
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {produk ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}