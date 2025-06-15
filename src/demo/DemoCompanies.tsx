
import { useState, useEffect } from "react";

interface DemoCompany {
  id: string;
  name: string;
}
const DEMO_COMPANIES_KEY = "demo_companies_list";
const demoDefaultCompanies: DemoCompany[] = [
  { id: "1", name: "Compañía Demo A" },
  { id: "2", name: "Compañía Demo B" },
];

export const DemoCompanies = () => {
  const [companies, setCompanies] = useState<DemoCompany[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(DEMO_COMPANIES_KEY);
    setCompanies(stored ? JSON.parse(stored) : demoDefaultCompanies);
  }, []);

  useEffect(() => {
    localStorage.setItem(DEMO_COMPANIES_KEY, JSON.stringify(companies));
  }, [companies]);

  const addCompany = () => {
    const name = prompt("Nombre de la compañía:");
    if (name) {
      setCompanies(c => [...c, { id: Math.random().toString(36).slice(2), name }]);
    }
  };

  const deleteCompany = (id: string) => {
    setCompanies(c => c.filter(co => co.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Compañías Demo</h2>
      <button className="mb-4 px-3 py-1 rounded bg-primary text-white" onClick={addCompany}>
        Añadir Compañía
      </button>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2">Nombre</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => (
            <tr key={c.id}>
              <td className="p-2">{c.name}</td>
              <td className="p-2">
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => deleteCompany(c.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {companies.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center p-4">
                No hay compañías demo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
