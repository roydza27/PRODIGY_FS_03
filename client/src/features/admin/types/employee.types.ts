export interface Employee {
  id: string;
  fullName: string;
  email: string;
  department: string;
  jobTitle: string;
  employmentStatus: string;
}

export interface DataTableProps<TData, TValue = any> {
  columns?: any[];
  data: TData[];
}
