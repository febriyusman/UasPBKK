import axios from "axios";

// Ganti dengan URL backend Laravel kamu
const BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem("token"); // atau dari cookies

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

export const logout = async (token: string | null) => {
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await axios.post(
    `${BASE_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

//api produk awal
export async function fetchProduk() {
  const res = await fetch(`${BASE_URL}/product`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
export async function createProduk(data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}) {
  const res = await fetch(`${BASE_URL}/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function updateProduk(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/product/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gagal update:", errText);
    throw new Error("Update gagal: " + errText);
  }

  return res.json();
}
export async function deleteProduk(id: number) {
  const res = await fetch(`${BASE_URL}/product/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
//api produk akhir

//api pelanggan awal
export async function fetchPelanggan() {
  const res = await fetch(`${BASE_URL}/customer`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
export async function createPelanggan(data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}) {
  const res = await fetch(`${BASE_URL}/customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function updatePelanggan(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/customer/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gagal update:", errText);
    throw new Error("Update gagal: " + errText);
  }

  return res.json();
}
export async function deletePelanggan(id: number) {
  const res = await fetch(`${BASE_URL}/customer/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
//api pelanggan akhir

//api Kategori awal
export async function fetchKategori() {
  const res = await fetch(`${BASE_URL}/category`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
export async function createKategori(data: {
  product_id: string;
  name: string;
  description: string;
}) 
{
  const res = await fetch(`${BASE_URL}/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function updateKategori(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/category/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gagal update:", errText);
    throw new Error("Update gagal: " + errText);
  }

  return res.json();
}
export async function deleteKategori(id: number) {
  const res = await fetch(`${BASE_URL}/category/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
}
//api kategori akhir

// --- API Order Awal (dengan penyesuaian) ---

export async function fetchOrder() {
  const res = await fetch(`${BASE_URL}/order`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error("Gagal fetch order:", errText);
    throw new Error("Fetch order gagal: " + errText);
  }
  return res.json();
}

// PERBAIKAN: Sesuaikan tipe data untuk `createOrder`
// Sekarang, `data` harus menyertakan `customer_id` dan `items` (array produk)
export async function createOrder(data: {
  customer_id: string;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}) {
  const res = await fetch(`${BASE_URL}/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json(); // Laravel validation errors often come as JSON
    console.error("Gagal membuat order:", errorBody);
    throw new Error("Membuat order gagal: " + (errorBody.message || JSON.stringify(errorBody)));
  }
  return res.json();
}

export async function updateOrder(id: string, data: any) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/order/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    console.error("Gagal update:", errorBody);
    throw new Error("Update gagal: " + (errorBody.message || JSON.stringify(errorBody)));
  }

  return res.json();
}

// PERBAIKAN: `id` harus bertipe string (ULID)
export async function deleteOrder(id: string) {
  const res = await fetch(`${BASE_URL}/order/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json();
    console.error("Gagal menghapus:", errorBody);
    throw new Error("Hapus gagal: " + (errorBody.message || JSON.stringify(errorBody)));
  }
  return res.json();
}
// --- API Order Akhir ---

// --- Tambahan: API untuk Order Item (Jika diperlukan untuk admin) ---
// Ingat, ini untuk manipulasi order item individual, bukan checkout
export async function fetchOrderItem() {
  const res = await fetch(`${BASE_URL}/order_item`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error("Gagal fetch order items:", errText);
    throw new Error("Fetch order items gagal: " + errText);
  }
  return res.json();
}

export async function createOrderItem(data: {
  order_id: string;
  product_id: string;
  quantity: number;
}) {
  const res = await fetch(`${BASE_URL}/order_item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    console.error("Gagal membuat order item:", errorBody);
    throw new Error("Membuat order item gagal: " + (errorBody.message || JSON.stringify(errorBody)));
  }
  return res.json();
}

export async function updateOrderItem(id: string, data: { quantity?: number }) {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/order_item/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    console.error("Gagal update order item:", errorBody);
    throw new Error("Update order item gagal: " + (errorBody.message || JSON.stringify(errorBody)));
  }

  return res.json();
}

export async function deleteOrderItem(id: string) {
  const res = await fetch(`${BASE_URL}/order_item/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json();
    console.error("Gagal menghapus order item:", errorBody);
    throw new Error("Hapus order item gagal: " + (errorBody.message || JSON.stringify(errorBody)));
  }
  return res.json();
}