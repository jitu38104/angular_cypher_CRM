import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements AfterViewInit {
  constructor(
    private utility: UtilitiesService,
    private cdr: ChangeDetectorRef
  ) {}

  isRouterActivate:boolean = false;
  adminOptions:any[] = [];

  ngAfterViewInit(): void {
    this.adminOptions = [
      {
        lable: "Users Attendance",
        path: "attendance",
        icon: "fa-users",
        title: "To see all users attendance as per daily basis",
        isDisable: !this.utility.fetchUserSingleDetail("attendance")
      },
      {
        lable: "Add New User",
        path: "add/user",
        icon: "fa-user-plus",
        title: "To add new user for the CRM",
        isDisable: !this.utility.fetchUserSingleDetail("add_new_user")
      },
      {
        lable: "Leads",
        path: "lead-list",
        icon: "fa-list-ul",
        title: "To fetch/update on list of saved leads",
        isDisable: !this.utility.fetchUserSingleDetail("see_leads")
      },
      {
        lable: "Website Leads",
        path: "web-lead-list",
        icon: "fa-earth-americas",
        title: "To fetch/assign website leads",
        isDisable: !this.utility.fetchUserSingleDetail("see_web_leads")
      },
      {
        lable: "Add New Company",
        path: "company-info",
        icon: "fa-building",
        title: "To add new company to cypher portal",
        isDisable: !this.utility.fetchUserSingleDetail("see_web_leads")
      },
    ];
    this.cdr.detectChanges();
  }

  onActivateRouter(e:any) {
    if(!(e instanceof AdminComponent)) {
      this.isRouterActivate = true;
    }
  }

  onDeactivateRouter() {
    this.isRouterActivate = false;
  }
}
