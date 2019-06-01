import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";
import { Waiter } from "../models/User";
import { Table, TableStatus, TableOrdersStatus } from "../models/Table";

export type GetTablesFilter = {
  seats?: number;
  status?: TableStatus;
  servedBy?: Waiter;
  foodOrdersStatus?: TableOrdersStatus;
  beverageOrdersStatus?: TableOrdersStatus;
};

@Injectable({
  providedIn: "root"
})
export class TablesService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  async getTables(filter: GetTablesFilter): Promise<Table[]> {
    return this.http
      .get(environment.apiUrl + "/tables", {
        headers: new HttpHeaders({
          Authorization: "Bearer " + (await this.authService.getToken())
        }),
        params: {
          seats: filter.seats && "" + filter.seats,
          status: filter.status,
          servedById: filter.servedBy && filter.servedBy._id,
          foodOrdersStatus: filter.foodOrdersStatus,
          beverageOrdersStatus: filter.beverageOrdersStatus
        },
        responseType: "json"
      })
      .toPromise() as Promise<Table[]>;
  }

  async getTableById(id: string): Promise<Table> {
    return this.http
      .get(environment.apiUrl + `/tables/byId/${id}`, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + (await this.authService.getToken())
        }),
        responseType: "json"
      })
      .toPromise() as Promise<Table>;
  }

  async occupyTable(table: Table): Promise<undefined> {
    return this.http
      .put(
        environment.apiUrl + `/tables/byId/${table._id}`,
        { action: "occupy" },
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<undefined>;
  }

  async freeTable(table: Table): Promise<undefined> {
    return this.http
      .put(
        environment.apiUrl + `/tables/byId/${table._id}`,
        { action: "free" },
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
