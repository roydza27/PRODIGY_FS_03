import mongoose from "mongoose";

export type EmploymentStatus =
  | "active"
  | "inactive"
  | "on_leave"
  | "resigned"
  | "terminated";

export interface IEmployee {
  fullName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  department: string;
  salary?: number;
  employmentStatus: EmploymentStatus;
  dateOfJoining: Date;
  address?: string;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;

  // timestamps
  createdAt: Date;
  updatedAt: Date;
}

export type CreateEmployeeInput = {
  fullName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  department: string;
  salary?: number;
  employmentStatus?: IEmployee["employmentStatus"];
  dateOfJoining: Date;
  address?: string;
};

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

export type EmployeeResponse = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  department: string;
  salary?: number;
  employmentStatus: IEmployee["employmentStatus"];
  dateOfJoining: Date;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GetAllEmployeesQuery = {
  page?: string;
  limit?: string;
  search?: string;
  department?: string;
  status?: string;
};

export type PaginatedEmployeesResponse = {
  data: EmployeeResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AuditFields = {
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
};