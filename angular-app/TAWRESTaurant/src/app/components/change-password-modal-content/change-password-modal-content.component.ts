import { Component, OnInit, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { User } from "src/app/models/User";

@Component({
  selector: "app-change-password-modal-content",
  templateUrl: "./change-password-modal-content.component.html",
  styleUrls: ["./change-password-modal-content.component.css"]
})
export class ChangePasswordModalContentComponent implements OnInit {
  @Input() user: User;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  onSubmit(form) {
    this.activeModal.close(form.form.value);
  }
}
