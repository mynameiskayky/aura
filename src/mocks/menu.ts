import type { MenuItem } from '../core/types';

export const MOCK_MENU: MenuItem[] = [
  { id: 'menu-01', icon: 'CalendarRange', label: 'Previsão de diário', route: '/daily-forecast' },
  { id: 'menu-02', icon: 'Tags', label: 'Categorias', route: '/categories' },
  { id: 'menu-03', icon: 'Download', label: 'Exportar dados', route: '/export' },
  { id: 'menu-04', icon: 'Bell', label: 'Notificações', route: '/notifications' },
  { id: 'menu-05', icon: 'Palette', label: 'Aparência', route: '/appearance' },
  { id: 'menu-06', icon: 'Info', label: 'Sobre', route: '/about' },
  { id: 'menu-07', icon: 'LogOut', label: 'Sair', route: '/logout' },
];
