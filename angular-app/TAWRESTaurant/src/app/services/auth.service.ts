import { Injectable } from "@angular/core";
import { User } from "src/app/models/User";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token: string;

  constructor() {}

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem("jwt", token);
  }

  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem("jwt");
    }
    return this.token;
  }

  clearToken(): void {
    this.token = undefined;
    localStorage.removeItem("jwt");
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): User {
    return this.isLoggedIn()
      ? (JSON.parse(atob(this.getToken().split(".")[1])) as User)
      : null;
  }
}
