
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Terminology } from "@/hooks/useBrokerageConfig";

interface TerminologySettingsTabProps {
  terminology: Terminology;
  onTerminologyChange: (newTerminology: Terminology) => void;
}

const termKeys: (keyof Terminology)[] = ["user", "delegation", "company", "product", "department", "news"];
const termDisplayNames: Record<keyof Terminology, string> = {
  user: "Usuarios",
  delegation: "Delegaciones",
  company: "Compañías",
  product: "Productos",
  department: "Departamentos",
  news: "Noticias",
  dashboard: "Dashboard",
  settings: "Configuración"
};

export const TerminologySettingsTab = ({ terminology, onTerminologyChange }: TerminologySettingsTabProps) => {

  const handleInputChange = (term: keyof Terminology, type: 'singular' | 'plural', value: string) => {
    const newTerminology = {
      ...terminology,
      [term]: {
        ...terminology[term],
        [type]: value,
      },
    };
    onTerminologyChange(newTerminology);
  };

  if (!terminology) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Terminología de la Plataforma</CardTitle>
        <CardDescription>
          Personaliza los nombres de las entidades principales de la aplicación para que se ajusten a tu negocio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {termKeys.map(term => (
            <div key={term} className="space-y-4 p-4 border rounded-lg bg-background">
              <h3 className="font-medium text-sidebar-primary dark:text-white">{termDisplayNames[term]}</h3>
              <div className="space-y-2">
                <Label htmlFor={`${term}-singular`}>Término en Singular</Label>
                <Input
                  id={`${term}-singular`}
                  value={terminology[term]?.singular || ''}
                  onChange={(e) => handleInputChange(term, 'singular', e.target.value)}
                  placeholder="Ej: Usuario"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${term}-plural`}>Término en Plural</Label>
                <Input
                  id={`${term}-plural`}
                  value={terminology[term]?.plural || ''}
                  onChange={(e) => handleInputChange(term, 'plural', e.target.value)}
                  placeholder="Ej: Usuarios"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
