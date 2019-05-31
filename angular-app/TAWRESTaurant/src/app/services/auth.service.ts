import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "src/app/models/User";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token: string;

  private authSubject: Subject<User> = new Subject();

  constructor() {}

  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem("jwt");
    }
    return this.token;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): User {
    return this.isLoggedIn()
      ? (JSON.parse(atob(this.getToken().split(".")[1])) as User)
      : null;
  }

  getAuthSubject() {
    return this.authSubject;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem("jwt", token);
    this.authSubject.next(this.getUser());
  }

  clearToken(): void {
    this.token = undefined;
    localStorage.removeItem("jwt");
    this.authSubject.next(null);
  }
}
