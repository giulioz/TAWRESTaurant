import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { UserRole, User } from "src/app/models/User";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getUrlFromUserRole(role: UserRole) {
    switch (role) {
      case UserRole.Waiter:
        return "/users/waiters";
      case UserRole.Cook:
        return "/users/cooks";
      case UserRole.Barman:
        return "/users/barmans";
      case UserRole.Cashier:
        return "/users/cashiers";
    }
  }

  async getUsers(filter: {
    username?: string;
    role?: UserRole;
  }): Promise<User[]> {
    return this.http
      .get(environment.apiUrl + "/users", {
        headers: new HttpHeaders({
          Authorization: "Bearer " + (await this.authService.getToken())
        }),
        params: filter,
        responseType: "json"
      })
      .toPromise() as Promise<User[]>;
  }

  async getUserById(id: string): Promise<User> {
    return this.http
      .get(environment.apiUrl + "/users/byId/" + id, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + (await this.authService.getToken())
        }),
        responseType: "json"
      })
      .toPromise() as Promise<User>;
  }

  async createUser(form: {
    username: string;
    name: string;
    surname: string;
    password: string;
    role: UserRole;
  }): Promise<User> {
    return this.http
      .post(environment.apiUrl + this.getUrlFromUserRole(form.role), form, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + (await this.authService.getToken())
        }),
        responseType: "json"
      })
      .toPromise() as Promise<User>;
  }

  async changePassword(user: User, form: { password: string }): Promise<User> {
    return this.http
      .put(environment.apiUrl + "/users/byId/" + user._id + "/password", form, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + (await this.authService.getToken())
        }),
        responseType: "json"
      })
      .toPromise() as Promise<User>;
  }

  async deleteUser(user: User): Promise<undefined> {
    return this.http
      .delete(environment.apiUrl + "/users/byId/" + user._id, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + (await this.authService.getToken())
        }),
        responseType: "json"
      })
      .toPromise() as Promise<undefined>;
  }
}
