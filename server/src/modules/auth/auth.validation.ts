export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export function validateRegisterInput(data: RegisterInput) {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    return "All fields are required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
}