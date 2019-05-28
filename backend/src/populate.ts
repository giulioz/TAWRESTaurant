require("./config");
import mongoose = require("mongoose");
import {
  WaiterModel,
  CookModel,
  BarmanModel,
  CashierModel,
  FoodModel,
  BeverageModel,
  TableModel
} from "./models";
import { UserRole } from "./models/user";

type PopulateInfo = {
  info: object;
  model: mongoose.Model<any>;
  logMessage: String;
  calls?: [{ method: string; args: any[] }];
};

const populateInfo: PopulateInfo[] = [
  {
    info: {
      username: "inquestoluogo",
      name: "Qui",
      surname: "Non c'è",
      role: UserRole.Waiter
    },
    logMessage: "Waiter: Qui",
    model: WaiterModel,
    calls: [{ method: "setPassword", args: ["inquestoluogo"] }]
  },
  {
    info: {
      username: "quovado",
      name: "Quo",
      surname: "Status",
      role: UserRole.Waiter
    },
    logMessage: "Waiter: Quo",
    model: WaiterModel,
    calls: [{ method: "setPassword", args: ["quovado"] }]
  },
  {
    info: {
      username: "daquestaparte",
      name: "Qua",
      surname: "Neppure",
      role: UserRole.Waiter
    },
    logMessage: "Waiter: Qua",
    model: WaiterModel,
    calls: [{ method: "setPassword", args: ["daquestaparte"] }]
  },
  {
    info: {
      username: "sfortunato",
      name: "Paolino",
      surname: "Paperino",
      role: UserRole.Cook
    },
    logMessage: "Cook: Paperino",
    model: CookModel,
    calls: [{ method: "setPassword", args: ["sfortunato"] }]
  },
  {
    info: {
      username: "tortadimele",
      name: "Nonna ",
      surname: "Papera",
      role: UserRole.Cook
    },
    logMessage: "Cook: Nonna Papera",
    model: CookModel,
    calls: [{ method: "setPassword", args: ["tortadimele"] }]
  },
  {
    info: {
      username: "fortunato",
      name: "Gastone",
      surname: "Paperone",
      role: UserRole.Barman
    },
    logMessage: "Barman: Gastone",
    model: BarmanModel,
    calls: [{ method: "setPassword", args: ["fortunato"] }]
  },
  {
    info: {
      username: "decino",
      name: "Paperon",
      surname: "De' Paperoni",
      role: UserRole.Cashier
    },
    logMessage: "Cashier: Paperone",
    model: CashierModel,
    calls: [{ method: "setPassword", args: ["decino"] }]
  },
  {
    info: {
      name: "Tacchino",
      price: 20,
      preparationTime: 10
    },
    logMessage: "Food: Tacchino",
    model: FoodModel
  },
  {
    info: {
      name: "Mohito",
      price: 3,
      preparationTime: 5
    },
    logMessage: "Beverage: Mohito",
    model: BeverageModel
  },
  {
    info: {
      number: 1,
      seats: 4
    },
    logMessage: "Table: 1",
    model: TableModel
  },
  {
    info: {
      number: 2,
      seats: 6
    },
    logMessage: "Table: 2",
    model: TableModel
  }
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
  });
  console.log("Connected to MongoDB");

  await populate(populateInfo);

  await mongoose.disconnect();
})();

async function populate(info: PopulateInfo[]) {
  await Promise.all(
    info.map(
      data =>
        new Promise((resolve, reject) => {
          const doc = new data.model(data.info);
          data.calls &&
            data.calls.forEach(call => {
              doc[call.method].apply(doc, call.args);
            });
          doc.save(err => {
            console.log(
              `${data.logMessage} ${!err ? "SUCCESS" : `FAIL (${err.message}`}`
            );
            resolve();
          });
        })
    )
  );
}
