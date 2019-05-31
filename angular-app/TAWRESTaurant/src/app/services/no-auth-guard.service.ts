import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class NoAuthGuardService {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate() {
    if (await this.authService.isLoggedIn()) {
      this.router.navigate(["/home"]);
      return false;
    }

    return true;
  }
}
