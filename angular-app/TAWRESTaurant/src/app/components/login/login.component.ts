import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  username: string = "";

  password: string = "";

  private loading: boolean = false;

  private alert: { type: string; message: string } = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loginService: LoginService
  ) {}

  ngOnInit() {}

  async onSubmit() {
    if (!this.username || !this.password) return;

    this.loading = true;
    this.alert = null;

    this.loginService
      .login(this.username, this.password)
      .then(res => {
        this.authService.setToken(res.token);
        this.router.navigate(["home"]);
      })
      .catch(err => {
        this.loading = false;
        this.alert = {
          type: "warning",
          message: err.error.message || err.error
        };
      });
  }
}
