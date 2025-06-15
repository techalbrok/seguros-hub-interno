
import { useState, useEffect } from "react";

interface DemoNews {
  id: string;
  title: string;
}
const DEMO_NEWS_KEY = "demo_news_list";
const demoDefaultNews: DemoNews[] = [
  { id: "1", title: "Novedad Importante Demo" },
  { id: "2", title: "Otra Noticia Demo" },
];

export const DemoNews = () => {
  const [news, setNews] = useState<DemoNews[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(DEMO_NEWS_KEY);
    setNews(stored ? JSON.parse(stored) : demoDefaultNews);
  }, []);

  useEffect(() => {
    localStorage.setItem(DEMO_NEWS_KEY, JSON.stringify(news));
  }, [news]);

  const addNews = () => {
    const title = prompt("Título de la noticia:");
    if (title) {
      setNews(n => [...n, { id: Math.random().toString(36).slice(2), title }]);
    }
  };

  const deleteNews = (id: string) => {
    setNews(n => n.filter(ni => ni.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Noticias Demo</h2>
      <button className="mb-4 px-3 py-1 rounded bg-primary text-white" onClick={addNews}>
        Añadir Noticia
      </button>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2">Título</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {news.map(n => (
            <tr key={n.id}>
              <td className="p-2">{n.title}</td>
              <td className="p-2">
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => deleteNews(n.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {news.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center p-4">
                No hay noticias demo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
