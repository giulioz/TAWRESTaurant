import { enumHasValue } from "../../utils";
import { MenuItemKind } from "../menuItem";

export type CreateMenuItemForm = {
  name: string;
  price: number;
  preparationTime: number;
  kind: MenuItemKind;
};

export function isCreateMenuItemForm(arg: any): arg is CreateMenuItemForm {
  return (
    arg &&
    arg.name &&
    typeof arg.name === "string" &&
    arg.price &&
    typeof arg.price === "number" &&
    arg.price > 0 &&
    arg.preparationTime &&
    typeof arg.preparationTime === "number" &&
    arg.preparationTime > 0 &&
    arg.kind &&
    typeof arg.kind === "string" &&
    enumHasValue(MenuItemKind, arg.kind)
  );
}

export type ChangeMenuItemForm = {
  name?: string;
  price?: number;
  preparationTime?: number;
  kind?: MenuItemKind;
};

export function isChangeMenuItemForm(arg: any): arg is ChangeMenuItemForm {
  return (
    arg &&
    (!arg.name || typeof arg.name === "string") &&
    (!arg.price ||
      (typeof arg.price === "number" &&
        arg.price > 0 &&
        (!arg.preparationTime ||
          (typeof arg.preparationTime === "number" &&
            arg.preparationTime > 0))))
  );
}
