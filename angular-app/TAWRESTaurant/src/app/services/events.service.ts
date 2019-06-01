import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class EventsService {
  private socket;

  private observersCount: number = 0;

  constructor(private authService: AuthService) {}

  private observeFor(eventName: string) {
    return new Observable(observer => {
      if (this.observersCount++ < 1) {
        this.socket = io.connect("http://localhost:3000/", {
          path: "/api/v1/events",
          query: `auth_token=${this.authService.getToken()}`
        });
      }
      this.socket.on(eventName, data => {
        observer.next(data);
      });
      this.socket.on("connect", () => {
        console.log("Connected to socket.io");
      });
      return () => {
        if (--this.observersCount < 1) {
          console.log("Disconnected from socket.io");
          this.socket.disconnect();
        }
      };
    });
  }

  getTablesEvents() {
    return this.observeFor("table status changed");
  }

  getOrdersEvents() {
    return this.observeFor("order status changed");
  }
}
