
import { useState, useEffect } from "react";

interface DemoUserType {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}
const DEMO_USERS_KEY = "demo_users_list";
const demoDefaultUsers: DemoUserType[] = [
  { id: "1", name: "Ana Demo", email: "ana@demo.com", role: "admin" },
  { id: "2", name: "Luis Demo", email: "luis@demo.com", role: "user" },
];

export const DemoUsers = () => {
  const [users, setUsers] = useState<DemoUserType[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(DEMO_USERS_KEY);
    setUsers(stored ? JSON.parse(stored) : demoDefaultUsers);
  }, []);

  useEffect(() => {
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
  }, [users]);

  const addUser = () => {
    const name = prompt("Nombre:");
    const email = prompt("Email:");
    if (name && email) {
      setUsers(u => [...u, { id: Math.random().toString(36).slice(2), name, email, role: "user" }]);
    }
  };
  const deleteUser = (id: string) => {
    setUsers(u => u.filter(user => user.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Usuarios Demo</h2>
      <button className="mb-4 px-3 py-1 rounded bg-primary text-white" onClick={addUser}>
        Añadir Usuario
      </button>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2">Nombre</th>
            <th className="p-2">Email</th>
            <th className="p-2">Rol</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => deleteUser(user.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No hay usuarios demo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
