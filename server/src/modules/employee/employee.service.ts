import mongoose, { HydratedDocument } from "mongoose";
import { Employee } from "./employee.model";
import type { IEmployee } from "./employee.types";
import type {
  CreateEmployeeInput,
  EmployeeResponse,
  GetAllEmployeesQuery,
  PaginatedEmployeesResponse,
  AuditFields,
  UpdateEmployeeInput,
} from "./employee.types";

export class BadRequestError extends Error {
  statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends Error {
  statusCode = 404;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  statusCode = 409;

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}



const toEmployeeResponse = (
  employee: HydratedDocument<IEmployee>
): EmployeeResponse => {
  const plain = employee.toObject();

  return {
    id: plain._id.toString(),
    fullName: plain.fullName,
    email: plain.email,
    phone: plain.phone,
    jobTitle: plain.jobTitle,
    department: plain.department,
    salary: plain.salary,
    employmentStatus: plain.employmentStatus,
    dateOfJoining: plain.dateOfJoining,
    address: plain.address,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

export const createEmployee = async (
  payload: CreateEmployeeInput,
  audit?: AuditFields
): Promise<EmployeeResponse> => {
  const normalizedEmail = payload.email.trim().toLowerCase();

  const existingEmployee = await Employee.findOne({ email: normalizedEmail });
  if (existingEmployee) {
    throw new ConflictError("Employee with this email already exists");
  }

  try {
    const createdEmployee = await Employee.create({
      ...payload,
      email: normalizedEmail,
      createdBy: audit?.createdBy,
      updatedBy: audit?.updatedBy,
    });

    return toEmployeeResponse(createdEmployee);
  } catch (error: any) {
    if (error?.code === 11000) {
      throw new ConflictError("Employee with this email already exists");
    }
    throw error;
  }
};

export const getAllEmployees = async (
  query: GetAllEmployeesQuery
): Promise<PaginatedEmployeesResponse> => {
  const page = Math.max(parseInt(query.page || "1", 10), 1);
  const limit = Math.max(parseInt(query.limit || "10", 10), 1);
  const skip = (page - 1) * limit;

  const search = query.search?.trim();
  const department = query.department?.trim();
  const status = query.status?.trim();

  const filter: Record<string, any> = {};

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (department) {
    filter.department = department;
  }

  if (status) {
    filter.employmentStatus = status;
  }

  const [employees, total] = await Promise.all([
    Employee.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Employee.countDocuments(filter),
  ]);

  return {
    data: employees.map(toEmployeeResponse),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getEmployeeById = async (
  employeeId: string
): Promise<EmployeeResponse> => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new BadRequestError("Invalid employee id");
  }

  const employee = await Employee.findById(employeeId);

  if (!employee) {
    throw new NotFoundError("Employee not found");
  }

  return toEmployeeResponse(employee);
};

export const updateEmployee = async (
  employeeId: string,
  payload: UpdateEmployeeInput,
  audit?: AuditFields
): Promise<EmployeeResponse> => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new BadRequestError("Invalid employee id");
  }

  const existingEmployee = await Employee.findById(employeeId);
  if (!existingEmployee) {
    throw new NotFoundError("Employee not found");
  }

  const updateData: Record<string, unknown> = { ...payload };

  if (payload.email) {
    const normalizedEmail = payload.email.trim().toLowerCase();

    const emailExists = await Employee.findOne({
      email: normalizedEmail,
      _id: { $ne: employeeId },
    });

    if (emailExists) {
      throw new ConflictError("Employee with this email already exists");
    }

    updateData.email = normalizedEmail;
  }

  if (audit?.updatedBy) {
    updateData.updatedBy = audit.updatedBy;
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEmployee) {
      throw new NotFoundError("Employee not found");
    }

    return toEmployeeResponse(updatedEmployee);
  } catch (error: any) {
    if (error?.code === 11000) {
      throw new ConflictError("Employee with this email already exists");
    }
    throw error;
  }
};

export const deleteEmployee = async (
  employeeId: string
): Promise<EmployeeResponse> => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new BadRequestError("Invalid employee id");
  }

  const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

  if (!deletedEmployee) {
    throw new NotFoundError("Employee not found");
  }

  return toEmployeeResponse(deletedEmployee);
};