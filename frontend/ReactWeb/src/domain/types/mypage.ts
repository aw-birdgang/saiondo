export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  onClick: () => void;
} 