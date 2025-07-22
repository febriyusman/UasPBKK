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

interface Pelanggan {
  id: number
  name: string
  email: string
  password: number
  phone: number
  address: string
}

interface Props {
  pelanggan?: Pelanggan
  trigger: React.ReactNode
  onSubmit: (data: Pelanggan) => void
}

export default function PelangganFormModal({ pelanggan, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Pelanggan>({
    name: pelanggan?.name || "",
    email: pelanggan?.email || "",
    password: "",
    phone: pelanggan?.phone || "",
    address: pelanggan?.address || "",
    id: pelanggan?.id || "",
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
          <DialogTitle>{pelanggan ? "Edit Produk" : "Tambah Pelanggan"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">

          <Input
            name="name"
            placeholder="Nama"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            name="email"
            placeholder="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <Input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
          <Input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {pelanggan ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}