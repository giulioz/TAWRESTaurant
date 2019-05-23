import mongoose = require("mongoose");
import crypto = require("crypto");

type BaseUser = mongoose.Document & {
  readonly _id: mongoose.Schema.Types.ObjectId;
  username: string;
  name: string;
  surname: string;
  salt: string;
  digest: string;
  setPassword: (password: string) => void;
  validatePassword: (password: string) => boolean;
};

export type Waiter = BaseUser & {
  role: "Waiter";
  totalServedCustomers: number;
};

export type Cook = BaseUser & {
  role: "Cook";
  totalPreparedDishes: number;
};

export type Barman = BaseUser & {
  role: "Barman";
  totalPreparedBeverages: number;
};

export type Casher = BaseUser & {
  role: "Casher";
};

export type User = Waiter | Cook | Barman | Casher;

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

export const casherSchema: mongoose.Schema<Casher> = new mongoose.Schema({});
