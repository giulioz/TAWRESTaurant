import mongoose = require("mongoose");
import crypto = require("crypto");
import { enumHasValue } from "../utils";

export enum UserRole {
  Waiter = "Waiter",
  Cook = "Cook",
  Barman = "Barman",
  Cashier = "Cashier"
}

export function isUserRole(arg: any): arg is UserRole {
  return arg && typeof arg === "string" && enumHasValue(UserRole, arg);
}

export type User = mongoose.Document & {
  readonly _id: mongoose.Schema.Types.ObjectId;
  username: string;
  name: string;
  surname: string;
  role: UserRole;
  salt: string;
  digest: string;
  setPassword: (password: string) => void;
  validatePassword: (password: string) => boolean;
};

export type Waiter = User & {
  role: UserRole.Waiter;
  totalServedCustomers: number;
};

export type Cook = User & {
  role: UserRole.Cook;
  totalPreparedDishes: number;
};

export type Barman = User & {
  role: UserRole.Barman;
  totalPreparedBeverages: number;
};

export type Cashier = User & {
  role: UserRole.Cashier;
};

export const userSchema = new mongoose.Schema<User>(
  {
    username: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true
    },
    name: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    surname: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    salt: {
      type: mongoose.Schema.Types.String,
      required: true,
      select: false
    },
    digest: {
      type: mongoose.Schema.Types.String,
      required: true,
      select: false
    }
  },
  { discriminatorKey: "role" }
);

userSchema.methods.setPassword = function(password: string) {
  this.salt = crypto.randomBytes(16).toString("hex");
  var hmac = crypto.createHmac("sha512", this.salt);
  hmac.update(password);
  this.digest = hmac.digest("hex");
};

userSchema.methods.validatePassword = function(password: string): boolean {
  var hmac = crypto.createHmac("sha512", this.salt);
  hmac.update(password);
  var digest = hmac.digest("hex");
  return this.digest === digest;
};

export const waiterSchema: mongoose.Schema<Waiter> = new mongoose.Schema({
  totalServedCustomers: {
    type: mongoose.Schema.Types.Number,
    required: false,
    default: 0
  }
});

export const cookSchema: mongoose.Schema<Cook> = new mongoose.Schema({
  totalPreparedDishes: {
    type: mongoose.Schema.Types.Number,
    required: false,
    default: 0
  }
});

export const barmanSchema: mongoose.Schema<Barman> = new mongoose.Schema({
  totalPreparedBeverages: {
    type: mongoose.Schema.Types.Number,
    required: false,
    default: 0
  }
});

export const cashierSchema: mongoose.Schema<Cashier> = new mongoose.Schema({});
