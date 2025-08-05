import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Admin.css";

const API_URL = import.meta.env.VITE_API_BASE_URL;


type User = {
  id?: number;
  name: string;
  email: string;
  dni: string;
  password?: string;
  role: { id: number } | null;
};

type Cabin = {
  id?: number;
  name: string;
  description: string;
  capacity: number;
  available: boolean;
  imageUrl?: string;
};

type Reservation = {
  id?: number;
  user: { id: number; name?: string } | null;
  cabin: { id: number; name?: string } | null;
  startDate: string;
  endDate: string;
  guests: number;
  status: string;
};

type Product = {
  id?: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
};

function Admin() {
  const navigate = useNavigate();
  const rawToken = localStorage.getItem("token");
  const token = rawToken?.startsWith("Bearer ") ? rawToken.slice(7) : rawToken;

  const [tab, setTab] = useState<
    "users" | "cabins" | "reservations" | "products"
  >("users");
  const [users, setUsers] = useState<User[]>([]);
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [userForm, setUserForm] = useState<User>({
    name: "",
    email: "",
    dni: "",
    password: "",
    role: { id: 2 }
  });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const [cabinForm, setCabinForm] = useState<Cabin>({
    name: "",
    description: "",
    capacity: 1,
    available: true,
    imageUrl: ""
  });
  const [cabinImgError, setCabinImgError] = useState<string | null>(null);
  const [editingCabinId, setEditingCabinId] = useState<number | null>(null);

  const [resForm, setResForm] = useState<Reservation>({
    user: null,
    cabin: null,
    startDate: "",
    endDate: "",
    guests: 1,
    status: "PENDING"
  });
  const [editingResId, setEditingResId] = useState<number | null>(null);

  const [productForm, setProductForm] = useState<Product>({
    title: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: "",
    stock: 0
  });
  const [productImgError, setProductImgError] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

const headers = useMemo(() => {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}, [token]);

async function validateImage(url: string) {
  if (!/\.(png|jpe?g)(\?.*)?$/i.test(url)) {
    return false;
  }
  return new Promise<boolean>(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

  const fetchUsers = useCallback(async () => {
    const res = await fetch(`${API_URL}/users`, { headers });
    if (res.ok) setUsers(await res.json());
  }, [headers]);

  const fetchCabins = useCallback(async () => {
    const res = await fetch(`${API_URL}/cabins`, { headers });
    if (res.ok) setCabins(await res.json());
  }, [headers]);

  const fetchReservations = useCallback(async () => {
    const res = await fetch(`${API_URL}/reservations`, { headers });
    if (res.ok) setReservations(await res.json());
  }, [headers]);

  const fetchProducts = useCallback(async () => {
    const res = await fetch(`${API_URL}/products`, { headers });
    if (res.ok) setProducts(await res.json());
  }, [headers]);

  useEffect(() => {
    if (tab === "users") fetchUsers();
    if (tab === "cabins") fetchCabins();
    if (tab === "reservations") {
      fetchReservations();
      fetchUsers();
      fetchCabins();
    }
    if (tab === "products") fetchProducts();
  }, [tab, fetchUsers, fetchCabins, fetchReservations, fetchProducts]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };


  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingUserId ? "PUT" : "POST";
    const url = editingUserId
      ? `${API_URL}/users/${editingUserId}`
      : `${API_URL}/users`;
    await fetch(url, { method, headers, body: JSON.stringify(userForm) });
    setUserForm({
      name: "",
      email: "",
      dni: "",
      password: "",
      role: { id: 2 }
    });
    setEditingUserId(null);
    fetchUsers();
  };

  const handleCabinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cabinForm.imageUrl) {
      const valid = await validateImage(cabinForm.imageUrl);
      if (!valid) {
        setCabinImgError(
          "La imagen debe ser un archivo JPG o PNG válido"
        );
        return;
      }
    }
    setCabinImgError(null);
    const method = editingCabinId ? "PUT" : "POST";
    const url = editingCabinId
      ? `${API_URL}/cabins/${editingCabinId}`
      : `${API_URL}/cabins`;
    await fetch(url, { method, headers, body: JSON.stringify(cabinForm) });
    setCabinForm({
      name: "",
      description: "",
      capacity: 1,
      available: true,
      imageUrl: ""
    });
    setEditingCabinId(null);
    fetchCabins();
  };

  const handleResSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingResId ? "PUT" : "POST";
    const url = editingResId
      ? `${API_URL}/reservations/${editingResId}`
      : `${API_URL}/reservations`;

    const body = editingResId
      ? {
          startDate: resForm.startDate,
          endDate: resForm.endDate,
          status: resForm.status
        }
      : {
          user: { id: Number(resForm.user?.id) },
          cabin: { id: Number(resForm.cabin?.id) },
          startDate: resForm.startDate,
          endDate: resForm.endDate,
          guests: Number(resForm.guests),
          status: resForm.status
        };

    await fetch(url, { method, headers, body: JSON.stringify(body) });
    setResForm({
      user: null,
      cabin: null,
      startDate: "",
      endDate: "",
      guests: 1,
      status: "PENDING"
    });
    setEditingResId(null);
    fetchReservations();
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productForm.imageUrl) {
      const valid = await validateImage(productForm.imageUrl);
      if (!valid) {
        setProductImgError(
          "La imagen debe ser un archivo JPG o PNG válido"
        );
        return;
      }
    }
    setProductImgError(null);
    const method = editingProductId ? "PUT" : "POST";
    const url = editingProductId
      ? `${API_URL}/products/${editingProductId}`
      : `${API_URL}/products`;

    await fetch(url, { method, headers, body: JSON.stringify(productForm) });
    setProductForm({
      title: "",
      description: "",
      price: 0,
      imageUrl: "",
      category: "",
      stock: 0
    });
    setEditingProductId(null);
    fetchProducts();
  };

  const handleDelete = async (entity: string, id: number) => {
    await fetch(`${API_URL}/${entity}/${id}`, { method: "DELETE", headers });
    if (entity === "users") fetchUsers();
    if (entity === "cabins") fetchCabins();
    if (entity === "reservations") fetchReservations();
    if (entity === "products") fetchProducts();
  };

  return (
    <div className="admin-container">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>
      <div className="admin-nav mb-6 flex justify-center gap-4">
        <button
          className={tab === "users" ? "active" : ""}
          onClick={() => setTab("users")}
        >
          Usuarios
        </button>
        <button
          className={tab === "cabins" ? "active" : ""}
          onClick={() => setTab("cabins")}
        >
          Cabañas
        </button>
        <button
          className={tab === "reservations" ? "active" : ""}
          onClick={() => setTab("reservations")}
        >
          Reservas
        </button>
        <button
          className={tab === "products" ? "active" : ""}
          onClick={() => setTab("products")}
        >
          Productos
        </button>
        <button onClick={handleLogout} className="logout">
          Logout
        </button>
      </div>

      {tab === "users" && (
        <div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>DNI</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.dni}</td>
                  <td>{u.role?.id === 1 ? "ADMIN" : "CLIENT"}</td>
                  <td className="actions">
                    <button
                      onClick={() => {
                        setUserForm({ ...u, password: "" });
                        setEditingUserId(u.id || null);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => handleDelete("users", u.id!)}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form onSubmit={handleUserSubmit} className="admin-form">
            <input
              placeholder="Nombre"
              value={userForm.name}
              onChange={e => setUserForm({ ...userForm, name: e.target.value })}
              required
            />
            <input
              placeholder="Email"
              value={userForm.email}
              onChange={e =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              required
            />
            <input
              placeholder="DNI"
              value={userForm.dni}
              onChange={e => setUserForm({ ...userForm, dni: e.target.value })}
              required
            />
            <input
              placeholder="Contraseña"
              type="password"
              value={userForm.password || ""}
              onChange={e =>
                setUserForm({ ...userForm, password: e.target.value })
              }
              required={!editingUserId}
            />
            <select
              value={userForm.role?.id}
              onChange={e =>
                setUserForm({
                  ...userForm,
                  role: { id: Number(e.target.value) }
                })
              }
            >
              <option value={1}>ADMIN</option>
              <option value={2}>CLIENT</option>
            </select>
            <button type="submit">
              {editingUserId ? "Actualizar" : "Crear"}
            </button>
          </form>
        </div>
      )}

      {tab === "cabins" && (
        <div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Capacidad</th>
                <th>Disponible</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cabins.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.description}</td>
                  <td>{c.capacity}</td>
                  <td>{c.available ? "Sí" : "No"}</td>
                  <td>
                    {c.imageUrl ? (
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => {
                        setCabinForm({ ...c });
                        setEditingCabinId(c.id || null);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => handleDelete("cabins", c.id!)}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form onSubmit={handleCabinSubmit} className="admin-form">
            <input
              placeholder="Nombre"
              value={cabinForm.name}
              onChange={e =>
                setCabinForm({ ...cabinForm, name: e.target.value })
              }
              required
            />
            <input
              placeholder="Descripción"
              value={cabinForm.description}
              onChange={e =>
                setCabinForm({ ...cabinForm, description: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Capacidad"
              value={cabinForm.capacity}
              onChange={e =>
                setCabinForm({ ...cabinForm, capacity: Number(e.target.value) })
              }
              required
            />
            <input
              placeholder="Imagen URL"
              value={cabinForm.imageUrl || ""}
              onChange={e =>
                setCabinForm({ ...cabinForm, imageUrl: e.target.value })
              }
            />
            {cabinImgError && <p className="error">{cabinImgError}</p>}
            <select
              value={cabinForm.available ? "1" : "0"}
              onChange={e =>
                setCabinForm({
                  ...cabinForm,
                  available: e.target.value === "1"
                })
              }
            >
              <option value="1">Disponible</option>
              <option value="0">No disponible</option>
            </select>
            <button type="submit">
              {editingCabinId ? "Actualizar" : "Crear"}
            </button>
          </form>
        </div>
      )}

      {tab === "reservations" && (
        <div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Cabaña</th>
                <th>Desde</th>
                <th>Hasta</th>
                <th>Huéspedes</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.user?.name}</td>
                  <td>{r.cabin?.name}</td>
                  <td>{r.startDate}</td>
                  <td>{r.endDate}</td>
                  <td>{r.guests}</td>
                  <td>{r.status}</td>
                  <td className="actions">
                    <button
                      onClick={() => {
                        setResForm({ ...r });
                        setEditingResId(r.id || null);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => handleDelete("reservations", r.id!)}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form onSubmit={handleResSubmit} className="admin-form">
            <select
              value={resForm.user?.id ?? ""}
              onChange={e =>
                setResForm({ ...resForm, user: { id: Number(e.target.value) } })
              }
              disabled={!!editingResId}
              required
            >
              <option value="" disabled>
                Seleccionar usuario
              </option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <select
              value={resForm.cabin?.id ?? ""}
              onChange={e =>
                setResForm({
                  ...resForm,
                  cabin: { id: Number(e.target.value) }
                })
              }
              disabled={!!editingResId}
              required
            >
              <option value="" disabled>
                Seleccionar cabaña
              </option>
              {cabins.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={resForm.startDate}
              onChange={e =>
                setResForm({ ...resForm, startDate: e.target.value })
              }
              required
            />
            <input
              type="date"
              value={resForm.endDate}
              onChange={e =>
                setResForm({ ...resForm, endDate: e.target.value })
              }
              required
            />
            <input
              type="number"
              value={resForm.guests}
              onChange={e =>
                setResForm({ ...resForm, guests: Number(e.target.value) })
              }
              disabled={!!editingResId}
              required
            />
            <select
              value={resForm.status}
              onChange={e => setResForm({ ...resForm, status: e.target.value })}
            >
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <button type="submit">
              {editingResId ? "Actualizar" : "Crear"}
            </button>
          </form>
        </div>
      )}

      {tab === "products" && (
        <div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Imagen</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>{p.description}</td>
                  <td>{p.price}</td>
                  <td>
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{p.category}</td>
                  <td>{p.stock}</td>
                  <td className="actions">
                    <button
                      onClick={() => {
                        setProductForm({ ...p });
                        setEditingProductId(p.id || null);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => handleDelete("products", p.id!)}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form onSubmit={handleProductSubmit} className="admin-form">
            <input
              placeholder="Título"
              value={productForm.title}
              onChange={e =>
                setProductForm({ ...productForm, title: e.target.value })
              }
              required
            />
            <input
              placeholder="Descripción"
              value={productForm.description}
              onChange={e =>
                setProductForm({ ...productForm, description: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Precio"
              value={productForm.price}
              onChange={e =>
                setProductForm({
                  ...productForm,
                  price: Number(e.target.value)
                })
              }
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={productForm.stock}
              onChange={e =>
                setProductForm({
                  ...productForm,
                  stock: Number(e.target.value)
                })
              }
              required
            />
            <input
              placeholder="Imagen URL"
              value={productForm.imageUrl}
              onChange={e =>
                setProductForm({ ...productForm, imageUrl: e.target.value })
              }
              required
            />
            {productImgError && <p className="error">{productImgError}</p>}
            <input
              placeholder="Categoría"
              value={productForm.category}
              onChange={e =>
                setProductForm({ ...productForm, category: e.target.value })
              }
              required
            />
            <button type="submit">
              {editingProductId ? "Actualizar" : "Crear"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Admin;
