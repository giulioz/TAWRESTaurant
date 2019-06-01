import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Subscription } from "rxjs";
import {
  TablesService,
  GetTablesFilter
} from "src/app/services/tables.service";
import { EventsService } from "src/app/services/events.service";
import { Table } from "src/app/models/Table";

@Component({
  selector: "app-tables-list",
  templateUrl: "./tables-list.component.html",
  styleUrls: ["./tables-list.component.css"]
})
export class TablesListComponent implements OnInit, OnDestroy {
  constructor(
    private tablesService: TablesService,
    private eventsService: EventsService
  ) {}

  @Input() filter: GetTablesFilter;

  tables: Table[];

  tablesEventsSubscription: Subscription;

  ngOnInit() {
    this.tablesService.getTables({}).then((tables: Table[]) => {
      this.tables = tables;
      this.tablesEventsSubscription = this.eventsService
        .getTablesEvents()
        .subscribe((table: Table) => {
          const tableInList = this.tables.find(
            table1 => table._id === table1._id
          );

          if (tableInList) {
            const tableInListIdx = this.tables.indexOf(tableInList);
            if (!this.tableMatchesFilter(tableInList)) {
              this.tables.splice(tableInListIdx);
              // this.tables.sort();
            } else {
              this.tables[tableInListIdx] = table;
              // this.tables.sort();
            }
          } else {
            if (this.tableMatchesFilter(table)) {
              this.tables.push(table);
            }
          }
        });
    });
  }

  ngOnDestroy() {
    if (this.tablesEventsSubscription) {
      this.tablesEventsSubscription.unsubscribe();
    }
  }

  occupyTable(table) {
    this.tablesService.occupyTable(table).then(() => {
      console.log(`Table ${table.number} has been occupied`);
    });
  }

  private tableMatchesFilter(table: Table) {
    return (
      table.seats >= this.filter.seats &&
      table.status === this.filter.status &&
      table.servedBy._id === this.filter.servedBy._id &&
      table.foodOrdersStatus === this.filter.foodOrdersStatus &&
      table.beverageOrdersStatus === this.filter.beverageOrdersStatus
    );
  }
}
