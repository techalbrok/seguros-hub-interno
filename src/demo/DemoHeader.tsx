
import { useDemoAuth } from "./DemoAuthContext";

export const DemoHeader = () => {
  const { user, logout } = useDemoAuth();
  return (
    <header className="h-16 border-b bg-background/95 px-4 flex items-center justify-between">
      <div className="text-xl font-medium">Plataforma Demo</div>
      {user && (
        <div className="flex items-center gap-4">
          <span>{user.name}</span>
          <button onClick={logout} className="text-primary underline">Salir</button>
        </div>
      )}
    </header>
  );
};
