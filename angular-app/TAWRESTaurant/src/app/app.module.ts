import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";

import { AuthService } from "src/app/services/auth.service";
import { NoAuthGuardService } from "./services/no-auth-guard.service";
import { AuthGuardService } from "./services/auth-guard.service";
import { LoginService } from "src/app/services/login.service";
import { UsersService } from "src/app/services/users.service";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { NavUserProfileComponent } from "./components/nav-user-profile/nav-user-profile.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { UsersPageComponent } from "./components/users-page/users-page.component";
import { CreateUserModalContentComponent } from "./components/create-user-modal-content/create-user-modal-content.component";
import { ChangePasswordModalContentComponent } from "./components/change-password-modal-content/change-password-modal-content.component";
import { NavsCashierComponent } from './components/navs-cashier/navs-cashier.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NavUserProfileComponent,
    LoginComponent,
    HomeComponent,
    UsersPageComponent,
    CreateUserModalContentComponent,
    ChangePasswordModalContentComponent,
    NavbarComponent,
    NavsCashierComponent
  ],
  entryComponents: [
    CreateUserModalContentComponent,
    ChangePasswordModalContentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    NoAuthGuardService,
    AuthGuardService,
    LoginService,
    UsersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
