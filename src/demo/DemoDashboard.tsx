
export const DemoDashboard = () => (
  <div>
    <h2 className="text-3xl font-bold mb-4">Bienvenido a la Demo</h2>
    <p>
      Aquí puedes explorar la plataforma sin conexión a la base de datos y probar todas las funcionalidades.
    </p>
    <ul className="mt-4 space-y-1 list-disc pl-4 text-primary">
      <li>Gestión de usuarios demo</li>
      <li>Gestión de delegaciones demo</li>
      <li>Dashboard, formularios y navegación igual al real</li>
      <li>Todos los datos quedan en tu navegador (se borran al limpiar storage)</li>
    </ul>
  </div>
);
