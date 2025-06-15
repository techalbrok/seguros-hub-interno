
import { useState, useEffect } from "react";

interface DemoDepartment {
  id: string;
  name: string;
}
const DEMO_DEPARTMENTS_KEY = "demo_departments_list";
const demoDefaultDepartments: DemoDepartment[] = [
  { id: "1", name: "Departamento Comercial Demo" },
  { id: "2", name: "Departamento Siniestros Demo" },
];

export const DemoDepartments = () => {
  const [departments, setDepartments] = useState<DemoDepartment[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(DEMO_DEPARTMENTS_KEY);
    setDepartments(stored ? JSON.parse(stored) : demoDefaultDepartments);
  }, []);

  useEffect(() => {
    localStorage.setItem(DEMO_DEPARTMENTS_KEY, JSON.stringify(departments));
  }, [departments]);

  const addDepartment = () => {
    const name = prompt("Nombre del departamento:");
    if (name) {
      setDepartments(d => [...d, { id: Math.random().toString(36).slice(2), name }]);
    }
  };

  const deleteDepartment = (id: string) => {
    setDepartments(d => d.filter(dp => dp.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Departamentos Demo</h2>
      <button className="mb-4 px-3 py-1 rounded bg-primary text-white" onClick={addDepartment}>
        Añadir Departamento
      </button>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2">Nombre</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {departments.map(d => (
            <tr key={d.id}>
              <td className="p-2">{d.name}</td>
              <td className="p-2">
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => deleteDepartment(d.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {departments.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center p-4">
                No hay departamentos demo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
