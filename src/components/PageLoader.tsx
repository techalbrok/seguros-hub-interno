
import { Loader2 } from 'lucide-react';

export const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);
