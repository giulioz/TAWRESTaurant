import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserRole } from "./models/User";
import { NoAuthGuardService } from "./services/no-auth-guard.service";
import { AuthGuardService } from "./services/auth-guard.service";

import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { UsersPageComponent } from "./components/users-page/users-page.component";
import { TablesPageComponent } from "./components/tables-page/tables-page.component";

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [NoAuthGuardService]
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [UserRole.Waiter, UserRole.Cook, UserRole.Barman, UserRole.Cashier]
    }
  },
  {
    path: "users",
    component: UsersPageComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [UserRole.Cashier]
    }
  },
  {
    path: "tables",
    component: TablesPageComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [UserRole.Cashier]
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
