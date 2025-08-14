import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
 return(
    <label className="swap swap-rotate">
    <input type="checkbox" className="theme-controller" value="light" />
    <Sun className="swap-off h-6 w-6 text-primary" />
    <Moon className="swap-on h-6 w-6 text-primary" />
</label>
);
}
