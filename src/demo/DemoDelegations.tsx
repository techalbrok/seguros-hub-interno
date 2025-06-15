
import { useState, useEffect } from "react";

interface DemoDelegation {
  id: string;
  name: string;
}
const DEMO_DELEGATIONS_KEY = "demo_delegations_list";
const demoDefaultDelegations: DemoDelegation[] = [
  { id: "1", name: "Central Demo" },
  { id: "2", name: "Sucursal Norte Demo" },
];

export const DemoDelegations = () => {
  const [delegations, setDelegations] = useState<DemoDelegation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(DEMO_DELEGATIONS_KEY);
    setDelegations(stored ? JSON.parse(stored) : demoDefaultDelegations);
  }, []);

  useEffect(() => {
    localStorage.setItem(DEMO_DELEGATIONS_KEY, JSON.stringify(delegations));
  }, [delegations]);

  const addDelegation = () => {
    const name = prompt("Nombre de la delegación:");
    if (name) {
      setDelegations(d => [...d, { id: Math.random().toString(36).slice(2), name }]);
    }
  };

  const deleteDelegation = (id: string) => {
    setDelegations(d => d.filter(dl => dl.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Delegaciones Demo</h2>
      <button className="mb-4 px-3 py-1 rounded bg-primary text-white" onClick={addDelegation}>
        Añadir Delegación
      </button>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2">Nombre</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {delegations.map(d => (
            <tr key={d.id}>
              <td className="p-2">{d.name}</td>
              <td className="p-2">
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => deleteDelegation(d.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {delegations.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center p-4">
                No hay delegaciones demo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
