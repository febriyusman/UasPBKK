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
import { useEffect, useState } from "react"
// Hapus import yang tidak digunakan (ka dari date-fns/locale, Select dari react-day-picker)
// Import yang benar untuk Select shadcn/ui
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Kategori {
  id?: number
  product_id: string
  name: string
  description: string
}

interface Produk {
  id: number
  name: string
}

interface Props {
  kategori?: Kategori
  trigger: React.ReactNode
  onSubmit: (data: Omit<Kategori, 'id'> | Kategori) => void
  produk: Produk[]
}

export default function KategoriFormModal({ produk, kategori, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Kategori>({
    product_id: kategori?.product_id || "",
    name: kategori?.name || "",
    description: kategori?.description || "",
    id: kategori?.id,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleProductIdChange = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, product_id: value }))
  }

  const handleSubmit = () => {
    if (kategori) {
      onSubmit(form)
    } else {
      const { id, ...dataToSubmit } = form
      onSubmit(dataToSubmit)
    }
    setOpen(false)
  }

  // Efek untuk mereset form setiap kali modal dibuka atau prop kategori berubah
  useEffect(() => {
    if (open) { // Hanya reset saat modal dibuka
      setForm({
        id: kategori?.id,
        product_id: kategori?.product_id || "",
        name: kategori?.name || "",
        description: kategori?.description || "",
      })
    }
  }, [open, kategori]) // Dependensi pada 'open' dan 'kategori'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{kategori ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Komponen Select untuk memilih Produk */}
          <Select
            name="product_id"
            value={form.product_id}
            onValueChange={handleProductIdChange} // Gunakan handler spesifik
          >
            <SelectTrigger className="w-full"> {/* Tambah className untuk lebar penuh */}
              <SelectValue placeholder="Pilih Produk" />
            </SelectTrigger>
            <SelectContent>
              {produk.map((prod) => (
                <SelectItem key={prod.id} value={String(prod.id)}>
                  {prod.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Input untuk Nama Kategori */}
          <Input
            name="name"
            placeholder="Nama Kategori" // Placeholder lebih deskriptif
            value={form.name}
            onChange={handleInputChange} // Gunakan handler umum
          />
          {/* Input untuk Deskripsi Kategori */}
          <Input
            name="description"
            placeholder="Deskripsi Kategori" // Placeholder lebih deskriptif
            value={form.description}
            onChange={handleInputChange} // Gunakan handler umum
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {kategori ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}