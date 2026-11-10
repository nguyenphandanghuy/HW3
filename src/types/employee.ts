export interface Employee {
  id: number;
  name: string;
  department: string;
  role: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}