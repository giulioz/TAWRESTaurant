import { isUserRole } from "../user";

export type CreateUserForm = {
  username: String;
  name: String;
  surname: String;
  role: String;
  password: String;
};

export function isCreateUserForm(arg: any): arg is CreateUserForm {
  return (
    arg &&
    arg.username &&
    typeof arg.username === "string" &&
    arg.name &&
    typeof arg.name === "string" &&
    arg.surname &&
    typeof arg.surname === "string" &&
    arg.role &&
    isUserRole(arg.role) &&
    arg.password &&
    typeof arg.password === "string"
  );
}

export type ChangePasswordForm = {
  password: string;
};

export function isChangePasswordForm(arg: any): arg is ChangePasswordForm {
  return arg && arg.password && arg.password === "string";
}
