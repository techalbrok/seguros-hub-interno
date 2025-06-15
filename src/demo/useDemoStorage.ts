
import { useState, useEffect, useCallback } from 'react';
import { getDemoData, setDemoData } from './localStorage';
import type { DemoData } from './data';

export const useDemoStorage = () => {
    const [data, setData] = useState<DemoData>(getDemoData());

    const updateData = useCallback((newData: DemoData) => {
        setDemoData(newData);
        setData(newData);
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            setData(getDemoData());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return [data, updateData] as const;
};
