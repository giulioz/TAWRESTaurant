import { Component, OnInit, Input } from "@angular/core";
import { User } from "src/app/models/User";

@Component({
  selector: "app-navs-cashier",
  templateUrl: "./navs-cashier.component.html",
  styleUrls: ["./navs-cashier.component.css"]
})
export class NavsCashierComponent implements OnInit {
  @Input() auth: User;

  constructor() {}

  ngOnInit() {}
}
