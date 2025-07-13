import { useState, useEffect, useCallback, useMemo } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './styles/Admin.css';

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
};

function Admin() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [tab, setTab] = useState<'users' | 'cabins' | 'reservations' | 'products'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [cabins, setCabins] = useState<Cabin[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const [userForm, setUserForm] = useState<User>({ name: '', email: '', dni: '', password: '', role: { id: 2 } });
    const [editingUserId, setEditingUserId] = useState<number | null>(null);

    const [cabinForm, setCabinForm] = useState<Cabin>({ name: '', description: '', capacity: 1, available: true, imageUrl: '' });
    const [editingCabinId, setEditingCabinId] = useState<number | null>(null);

    const [resForm, setResForm] = useState<Reservation>({ user: null, cabin: null, startDate: '', endDate: '', guests: 1, status: 'PENDING' });
    const [editingResId, setEditingResId] = useState<number | null>(null);

    const [productForm, setProductForm] = useState<Product>({ title: '', description: '', price: 0, imageUrl: '', category: '' });
    const [editingProductId, setEditingProductId] = useState<number | null>(null);

    const headers = useMemo(() => {
        const h: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) h.Authorization = `Bearer ${token}`;
        return h;
    }, [token]);

    const fetchUsers = useCallback(async () => {
        const res = await fetch('https://ymucpmxkp3.us-east-1.awsapprunner.com/users', { headers });
        if (res.ok) setUsers(await res.json());
    }, [headers]);

    const fetchCabins = useCallback(async () => {
        const res = await fetch('https://ymucpmxkp3.us-east-1.awsapprunner.com/cabins', { headers });
        if (res.ok) setCabins(await res.json());
    }, [headers]);

    const fetchReservations = useCallback(async () => {
        const res = await fetch('https://ymucpmxkp3.us-east-1.awsapprunner.com/reservations', { headers });
        if (res.ok) setReservations(await res.json());
    }, [headers]);

    const fetchProducts = useCallback(async () => {
        const res = await fetch('https://ymucpmxkp3.us-east-1.awsapprunner.com/products', { headers });
        if (res.ok) setProducts(await res.json());
    }, [headers]);

    useEffect(() => {
        if (tab === 'users') fetchUsers();
        if (tab === 'cabins') fetchCabins();
        if (tab === 'reservations') {
            fetchReservations();
            fetchUsers();
            fetchCabins();
        }
        if (tab === 'products') fetchProducts();
    }, [tab, fetchUsers, fetchCabins, fetchReservations, fetchProducts]);

    const handleLogout = async () => {
        if (auth.currentUser) await signOut(auth);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    const handleHome = () => {
        navigate('/');
    };

    const handleUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingUserId ? 'PUT' : 'POST';
        const url = editingUserId ? `https://ymucpmxkp3.us-east-1.awsapprunner.com/users/${editingUserId}` : 'https://ymucpmxkp3.us-east-1.awsapprunner.com/users';
        await fetch(url, { method, headers, body: JSON.stringify(userForm) });
        setUserForm({ name: '', email: '', dni: '', password: '', role: { id: 2 } });
        setEditingUserId(null);
        fetchUsers();
    };

    const handleCabinSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingCabinId ? 'PUT' : 'POST';
        const url = editingCabinId ? `https://ymucpmxkp3.us-east-1.awsapprunner.com/cabins/${editingCabinId}` : 'https://ymucpmxkp3.us-east-1.awsapprunner.com/cabins';
        await fetch(url, { method, headers, body: JSON.stringify(cabinForm) });
        setCabinForm({ name: '', description: '', capacity: 1, available: true, imageUrl: '' });
        setEditingCabinId(null);
        fetchCabins();
    };

    const handleResSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingResId ? 'PUT' : 'POST';
        const url = editingResId
            ? `https://ymucpmxkp3.us-east-1.awsapprunner.com/reservations/${editingResId}`
            : 'https://ymucpmxkp3.us-east-1.awsapprunner.com/reservations';

        const body = editingResId
            ? {
                  startDate: resForm.startDate,
                  endDate: resForm.endDate,
                  status: resForm.status,
              }
            : {
                  user: { id: Number(resForm.user?.id) },
                  cabin: { id: Number(resForm.cabin?.id) },
                  startDate: resForm.startDate,
                  endDate: resForm.endDate,
                  guests: Number(resForm.guests),
                  status: resForm.status,
              };

        await fetch(url, { method, headers, body: JSON.stringify(body) });
        setResForm({ user: null, cabin: null, startDate: '', endDate: '', guests: 1, status: 'PENDING' });
        setEditingResId(null);
        fetchReservations();
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingProductId ? 'PUT' : 'POST';
        const url = editingProductId
            ? `https://ymucpmxkp3.us-east-1.awsapprunner.com/products/${editingProductId}`
            : 'https://ymucpmxkp3.us-east-1.awsapprunner.com/products';

        await fetch(url, { method, headers, body: JSON.stringify(productForm) });
        setProductForm({ title: '', description: '', price: 0, imageUrl: '', category: '' });
        setEditingProductId(null);
        fetchProducts();
    };

    const handleDelete = async (entity: string, id: number) => {
        await fetch(`https://ymucpmxkp3.us-east-1.awsapprunner.com/${entity}/${id}`, { method: 'DELETE', headers });
        if (entity === 'users') fetchUsers();
        if (entity === 'cabins') fetchCabins();
        if (entity === 'reservations') fetchReservations();
        if (entity === 'products') fetchProducts();
    };

    return (
        <div className="admin-container">
            <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>
            <div className="admin-nav mb-6 flex justify-center gap-4">
                <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Usuarios</button>
                <button className={tab === 'cabins' ? 'active' : ''} onClick={() => setTab('cabins')}>Cabañas</button>
                <button className={tab === 'reservations' ? 'active' : ''} onClick={() => setTab('reservations')}>Reservas</button>
                <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Productos</button>
                <button onClick={handleHome} className="home">Inicio</button>
                <button onClick={handleLogout} className="logout">Logout</button>
            </div>

            {tab === 'users' && (
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
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.dni}</td>
                                    <td>{u.role?.id === 1 ? 'ADMIN' : 'CLIENT'}</td>
                                    <td className="actions">
                                        <button onClick={() => { setUserForm({ ...u, password: '' }); setEditingUserId(u.id || null); }}>Editar</button>
                                        <button onClick={() => handleDelete('users', u.id!)}>Borrar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <form onSubmit={handleUserSubmit} className="admin-form">
                        <input placeholder="Nombre" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required />
                        <input placeholder="Email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required />
                        <input placeholder="DNI" value={userForm.dni} onChange={e => setUserForm({ ...userForm, dni: e.target.value })} required />
                        <input placeholder="Contraseña" type="password" value={userForm.password || ''} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required={!editingUserId} />
                        <select value={userForm.role?.id} onChange={e => setUserForm({ ...userForm, role: { id: Number(e.target.value) } })}>
                            <option value={1}>ADMIN</option>
                            <option value={2}>CLIENT</option>
                        </select>
                        <button type="submit">{editingUserId ? 'Actualizar' : 'Crear'}</button>
                    </form>
                </div>
            )}

            {tab === 'cabins' && (
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
                            {cabins.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.name}</td>
                                    <td>{c.description}</td>
                                    <td>{c.capacity}</td>
                                    <td>{c.available ? 'Sí' : 'No'}</td>
                                    <td>{c.imageUrl}</td>
                                    <td className="actions">
                                        <button onClick={() => { setCabinForm({ ...c }); setEditingCabinId(c.id || null); }}>Editar</button>
                                        <button onClick={() => handleDelete('cabins', c.id!)}>Borrar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <form onSubmit={handleCabinSubmit} className="admin-form">
                        <input placeholder="Nombre" value={cabinForm.name} onChange={e => setCabinForm({ ...cabinForm, name: e.target.value })} required />
                        <input placeholder="Descripción" value={cabinForm.description} onChange={e => setCabinForm({ ...cabinForm, description: e.target.value })} required />
                        <input type="number" placeholder="Capacidad" value={cabinForm.capacity} onChange={e => setCabinForm({ ...cabinForm, capacity: Number(e.target.value) })} required />
                        <input placeholder="Imagen URL" value={cabinForm.imageUrl || ''} onChange={e => setCabinForm({ ...cabinForm, imageUrl: e.target.value })} />
                        <select value={cabinForm.available ? '1' : '0'} onChange={e => setCabinForm({ ...cabinForm, available: e.target.value === '1' })}>
                            <option value="1">Disponible</option>
                            <option value="0">No disponible</option>
                        </select>
                        <button type="submit">{editingCabinId ? 'Actualizar' : 'Crear'}</button>
                    </form>
                </div>
            )}

            {tab === 'reservations' && (
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
                            {reservations.map((r) => (
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
                                        <button onClick={() => handleDelete('reservations', r.id!)}>Borrar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <form onSubmit={handleResSubmit} className="admin-form">
                        <select
                            value={resForm.user?.id ?? ''}
                            onChange={e => setResForm({ ...resForm, user: { id: Number(e.target.value) } })}
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
                            value={resForm.cabin?.id ?? ''}
                            onChange={e => setResForm({ ...resForm, cabin: { id: Number(e.target.value) } })}
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
                        <input type="date" value={resForm.startDate} onChange={e => setResForm({ ...resForm, startDate: e.target.value })} required />
                        <input type="date" value={resForm.endDate} onChange={e => setResForm({ ...resForm, endDate: e.target.value })} required />
                        <input type="number" value={resForm.guests} onChange={e => setResForm({ ...resForm, guests: Number(e.target.value) })} disabled={!!editingResId} required />
                        <select value={resForm.status} onChange={e => setResForm({ ...resForm, status: e.target.value })}>
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    <button type="submit">{editingResId ? 'Actualizar' : 'Crear'}</button>
                </form>
            </div>
        )}

            {tab === 'products' && (
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
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.title}</td>
                                    <td>{p.description}</td>
                                    <td>{p.price}</td>
                                    <td>{p.imageUrl}</td>
                                    <td>{p.category}</td>
                                    <td className="actions">
                                        <button onClick={() => { setProductForm({ ...p }); setEditingProductId(p.id || null); }}>Editar</button>
                                        <button onClick={() => handleDelete('products', p.id!)}>Borrar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <form onSubmit={handleProductSubmit} className="admin-form">
                        <input placeholder="Título" value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} required />
                        <input placeholder="Descripción" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} required />
                        <input type="number" placeholder="Precio" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })} required />
                        <input placeholder="Imagen URL" value={productForm.imageUrl} onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })} required />
                        <input placeholder="Categoría" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} required />
                        <button type="submit">{editingProductId ? 'Actualizar' : 'Crear'}</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Admin;
