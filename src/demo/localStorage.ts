
import { demoData, DemoData } from './data';

const getStorage = () => {
    try {
        return window.localStorage;
    } catch (e) {
        console.warn('localStorage is not available. Demo mode changes will not be saved.');
        return null;
    }
};

const storage = getStorage();
const DEMO_STORAGE_KEY = 'hubcore-demo-data';

export const initDemoData = () => {
    if (!storage) return;
    if (!storage.getItem(DEMO_STORAGE_KEY)) {
        console.log('Initializing demo data in localStorage...');
        storage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoData));
    }
};

export const getDemoData = (): DemoData => {
    if (!storage) return demoData; // Return initial data if storage is not available
    try {
        const data = storage.getItem(DEMO_STORAGE_KEY);
        return data ? JSON.parse(data) : demoData;
    } catch (error) {
        console.error('Error reading demo data from localStorage:', error);
        return demoData;
    }
};

export const setDemoData = (data: DemoData) => {
    if (!storage) return;
    try {
        storage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
        // Dispatch a storage event to sync across tabs
        window.dispatchEvent(new StorageEvent('storage', { key: DEMO_STORAGE_KEY }));
    } catch (error) {
        console.error('Error writing demo data to localStorage:', error);
    }
};

// Initialize on load
initDemoData();
