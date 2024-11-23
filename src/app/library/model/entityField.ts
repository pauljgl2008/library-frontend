export interface EntityField {
  field: string;
  label: string;
  type: 'text' | 'date' | 'select';
  required?: boolean;
  pattern?: string;
  options?: { id: number; name: string; }[];
}
