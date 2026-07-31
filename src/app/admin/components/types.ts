export interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "green" | "red" | "yellow" | "purple" | "indigo";
  unit?: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface Action {
  label: string;
  onClick: (id: string) => void;
  variant?: "primary" | "danger" | "success" | "warning";
  icon?: React.ReactNode;
}

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}
