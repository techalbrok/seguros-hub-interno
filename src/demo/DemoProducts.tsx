
import { useState, useEffect } from "react";

interface DemoProduct {
  id: string;
  name: string;
}
const DEMO_PRODUCTS_KEY = "demo_products_list";
const demoDefaultProducts: DemoProduct[] = [
  { id: "1", name: "Producto Demo X" },
  { id: "2", name: "Producto Demo Y" },
];

export const DemoProducts = () => {
  const [products, setProducts] = useState<DemoProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(DEMO_PRODUCTS_KEY);
    setProducts(stored ? JSON.parse(stored) : demoDefaultProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = () => {
    const name = prompt("Nombre del producto:");
    if (name) {
      setProducts(p => [...p, { id: Math.random().toString(36).slice(2), name }]);
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(p => p.filter(pr => pr.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Productos Demo</h2>
      <button className="mb-4 px-3 py-1 rounded bg-primary text-white" onClick={addProduct}>
        Añadir Producto
      </button>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2">Nombre</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td className="p-2">{p.name}</td>
              <td className="p-2">
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => deleteProduct(p.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center p-4">
                No hay productos demo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
