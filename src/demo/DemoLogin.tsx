
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDemoAuth } from "./DemoAuthContext";

export const DemoLogin = () => {
  const { login } = useDemoAuth();
  const [email, setEmail] = useState("demo@correo.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/demo/dashboard");
    } else {
      setError("Email o contraseña incorrectos (usa demo@correo.com / demo123)");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="p-6 bg-white dark:bg-gray-800 shadow rounded max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4">Demo Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" className="w-full py-2 rounded bg-primary text-white font-semibold">Entrar</button>
        </form>
      </div>
    </div>
  );
};
