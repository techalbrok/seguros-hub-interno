
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '@/types';
import { useBrokerageConfig } from '@/hooks/useBrokerageConfig';

interface ThemeContextType {
  theme: ThemeMode['mode'];
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const hexToHsl = (hex: string): string | null => {
  if (!hex || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
    return null;
  }
  let hexValue = hex.substring(1);
  if (hexValue.length === 3) {
    hexValue = hexValue.split('').map(char => char + char).join('');
  }

  const r_val = parseInt(hexValue.substring(0, 2), 16);
  const g_val = parseInt(hexValue.substring(2, 4), 16);
  const b_val = parseInt(hexValue.substring(4, 6), 16);
  
  let r_norm = r_val / 255;
  let g_norm = g_val / 255;
  let b_norm = b_val / 255;

  const max = Math.max(r_norm, g_norm, b_norm);
  const min = Math.min(r_norm, g_norm, b_norm);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r_norm: h = (g_norm - b_norm) / d + (g_norm < b_norm ? 6 : 0); break;
      case g_norm: h = (b_norm - r_norm) / d + 2; break;
      case b_norm: h = (r_norm - g_norm) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode['mode']>('light');
  const { config } = useBrokerageConfig();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode['mode'] | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
    
    if (config) {
      const applyColor = (variable: string, hexColor: string | undefined) => {
        const style = root.style;
        if (hexColor) {
          const hslColor = hexToHsl(hexColor);
          if (hslColor) {
            style.setProperty(variable, hslColor);
          } else {
            style.removeProperty(variable);
          }
        } else {
          style.removeProperty(variable);
        }
      };

      const rootStyle = root.style;
      
      if (theme === 'light') {
        applyColor('--primary', config.accent_color_light);
        applyColor('--ring', config.accent_color_light);
        applyColor('--sidebar-primary', config.primary_color_light);
        
        rootStyle.removeProperty('--header-color-dark');
      } else { // dark theme
        applyColor('--primary', config.accent_color_dark);
        applyColor('--ring', config.accent_color_dark);
        applyColor('--sidebar-primary', config.accent_color_dark);
        applyColor('--header-color-dark', config.primary_color_dark);
      }
    }
  }, [theme, config]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
