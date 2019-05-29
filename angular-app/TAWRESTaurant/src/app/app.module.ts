import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";

import { AuthService } from "src/app/services/auth.service";
import { LoginService } from "src/app/services/login.service";
import { UsersService } from "src/app/services/users.service";

@NgModule({
  declarations: [AppComponent, ToolbarComponent, LoginComponent, HomeComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [AuthService, LoginService, UsersService],
  bootstrap: [AppComponent]
})
export class AppModule {}
