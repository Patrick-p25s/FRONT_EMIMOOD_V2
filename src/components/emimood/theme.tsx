import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
export type Theme = 'light' | 'dark' | 'system';
export function resolveTheme(theme: Theme, systemDark: boolean) { return theme === 'system' ? (systemDark ? 'dark' : 'light') : theme; }
const ThemeContext = createContext<{theme: Theme; setTheme: (theme: Theme) => void}>({theme:'system',setTheme:()=>{}});
export function ThemeProvider({children}:{children:ReactNode}) {
 const [theme,setTheme] = useState<Theme>('system');
 useEffect(()=> { const saved=localStorage.getItem('emimood-theme'); if(saved==='light'||saved==='dark'||saved==='system') setTheme(saved); },[]);
 useEffect(()=> { const media=window.matchMedia('(prefers-color-scheme: dark)'); const apply=()=>document.documentElement.classList.toggle('dark',resolveTheme(theme,media.matches)==='dark'); apply(); media.addEventListener('change',apply); return ()=>media.removeEventListener('change',apply); },[theme]);
 const change=(value:Theme)=> {setTheme(value);localStorage.setItem('emimood-theme',value)};
 return <ThemeContext.Provider value={{theme,setTheme:change}}>{children}</ThemeContext.Provider>;
}
export const useTheme = ()=>useContext(ThemeContext);
