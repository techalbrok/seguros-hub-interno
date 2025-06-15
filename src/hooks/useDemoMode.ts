
import { useDemoStorage } from '@/demo/useDemoStorage';

export const useDemoMode = () => {
    const isDemo = window.location.pathname.startsWith('/demo');
    const [demoData, setDemoData] = useDemoStorage();

    return { isDemo, demoData, setDemoData };
}
