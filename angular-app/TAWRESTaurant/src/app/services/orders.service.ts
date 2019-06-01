import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";
import { Cook, Barman } from "../models/User";
import { Order, OrderKind, OrderStatus } from "../models/Order";
import { Table } from "../models/Table";
import { Food, Beverage } from "../models/MenuItem";

export type GetOrdersFilter =
  | {
      table: Table;
      kind?: OrderKind;
      status?: OrderStatus;
      cook?: undefined;
      barman?: undefined;
    }
  | {
      table?: undefined;
      kind?: OrderKind.FoodOrder;
      status?: OrderStatus.Preparing | OrderStatus.Ready;
      cook: Cook;
      barman?: undefined;
    }
  | {
      table?: undefined;
      kind?: OrderKind.BeverageOrder;
      status?: OrderStatus.Preparing | OrderStatus.Ready;
      cook?: undefined;
      barman: Barman;
    };

@Injectable({
  providedIn: "root"
})
export class OrdersService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getGetOrdersPathByFilter(filter: GetOrdersFilter) {
    if (filter.cook) {
      return `/users/cooks/byId/${filter.cook._id}/orders`;
    } else if (filter.barman) {
      return `/users/barmans/byId/${filter.barman._id}/orders`;
    } else {
      let path = `/tables/byId/${filter.table._id}/orders`;
      if (filter.status) {
        if (filter.kind === OrderKind.FoodOrder) {
          path += "/foodOrders";
        } else if (filter.kind === OrderKind.BeverageOrder) {
          path += "/beverageOrders";
        }
      }
      return path;
    }
  }

  async getOrders(filter: GetOrdersFilter): Promise<Order[]> {
    return this.http
      .get(environment.apiUrl + this.getGetOrdersPathByFilter(filter), {
        headers: new HttpHeaders({
          Authorization: "Bearer " + (await this.authService.getToken())
        }),
        params: {
          status: filter.status
        },
        responseType: "json"
      })
      .toPromise() as Promise<Order[]>;
  }

  async getOrderById(table: Table, id: string): Promise<Order> {
    return this.http
      .get(environment.apiUrl + `/tables/byId/${table._id}/orders/byId/${id}`, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + (await this.authService.getToken())
        }),
        responseType: "json"
      })
      .toPromise() as Promise<Order>;
  }

  async addOrder(
    table: Table,
    form:
      | { food: Food; beverage?: undefined }
      | { food?: undefined; beverage: Beverage }
  ) {
    return this.http
      .post(
        environment.apiUrl +
          `/tables/byId/${table._id}/orders${
            form.food ? "/foodOrders" : "/beverageOrders"
          }`,
        {
          food: form.food && form.food._id,
          beverage: form.beverage && form.beverage._id
        },
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<Order>;
  }

  async commitOrders(table: Table): Promise<undefined> {
    return this.http
      .put(
        environment.apiUrl + `/tables/byId/${table._id}/orders`,
        { action: "commit" },
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<undefined>;
  }

  async notifyServedOrders(table: Table, kind: OrderKind): Promise<undefined> {
    return this.http
      .put(
        environment.apiUrl +
          `/tables/byId/${table._id}/orders${
            kind === OrderKind.FoodOrder ? "/foodOrders" : "/beverageOrders"
          }`,
        { action: "notify-served" },
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<undefined>;
  }

  async assignOrder(table: Table, order: Order): Promise<undefined> {
    return this.http
      .put(
        environment.apiUrl +
          `/tables/byId/${table._id}/orders${
            order.kind === OrderKind.FoodOrder
              ? "/foodOrders"
              : "/beverageOrders"
          }/byId/${order._id}`,
        { action: "assign" },
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<undefined>;
  }

  async notifyReadyOrder(table: Table, order: Order): Promise<undefined> {
    return this.http
      .put(
        environment.apiUrl +
          `/tables/byId/${table._id}/orders${
            order.kind === OrderKind.FoodOrder
              ? "/foodOrders"
              : "/beverageOrders"
          }/byId/${order._id}`,
        { action: "notify-ready" },
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<undefined>;
  }

  async deleteOrder(table: Table, order: Order): Promise<undefined> {
    return this.http
      .delete(
        environment.apiUrl +
          `/tables/byId/${table._id}/orders/byId/${order._id}`,
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<undefined>;
  }
}
