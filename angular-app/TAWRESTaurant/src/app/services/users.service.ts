import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { UserRole } from "src/app/models/User";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  async getUsers(filter: { username?: string; role?: UserRole }) {
    return this.http
      .get(environment.apiUrl + "/users", {
        headers: new HttpHeaders({
          Authorization: "Bearer " + this.authService.getToken()
        }),
        params: filter,
        responseType: "json"
      })
      .toPromise();
  }

  async getUser(id: string) {
    return this.http
      .get(environment.apiUrl + "/users/" + id, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + this.authService.getToken()
        }),
        responseType: "json"
      })
      .toPromise();
  }

  async postUser(form: {
    username: string;
    name: string;
    surname: string;
    role: UserRole;
    password: string;
  }) {
    return this.http
      .post(environment.apiUrl + "/users", form, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + this.authService.getToken()
        }),
        responseType: "json"
      })
      .toPromise();
  }

  async changePassword(id: string, newPassword: string) {
    return this.http
      .put(
        environment.apiUrl + "/users/" + id + "/password",
        { password: newPassword },
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + this.authService.getToken()
          }),
          responseType: "json"
        }
      )
      .toPromise();
  }

  async deleteUser(id: string) {
    return this.http
      .delete(environment.apiUrl + "/users/" + id, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + this.authService.getToken()
        }),
        responseType: "json"
      })
      .toPromise();
  }
}
