
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/demo/dashboard", label: "Dashboard" },
  { to: "/demo/users", label: "Usuarios" },
  { to: "/demo/delegations", label: "Delegaciones" },
  // Puedes seguir agregando secciones demo aquí
];

export const DemoSidebar = () => (
  <aside className="w-48 bg-gray-50 dark:bg-gray-900 border-r">
    <div className="p-4 font-bold text-lg">Demo</div>
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map(i => (
        <NavLink
          key={i.to}
          to={i.to}
          className={({ isActive }) =>
            `rounded px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 ${isActive ? "bg-primary text-white" : ""}`
          }
        >
          {i.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
