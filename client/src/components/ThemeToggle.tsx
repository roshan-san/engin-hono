import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const toggleTheme = () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-6 w-6 text-primary block dark:hidden" />
      <Moon className="h-6 w-6 text-primary hidden dark:block" />
    </button>
  );
}
