import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { EventsService } from 'src/app/services/events.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-web-leads',
  templateUrl: './web-leads.component.html',
  styleUrls: ['./web-leads.component.scss']
})
export class WebLeadsComponent implements OnInit, OnDestroy{
  constructor(
    private datepipe: DatePipe,
    private utility: UtilitiesService,
    private apiService: ApiService,
    private eventService: EventsService
  ) {}

  scheduleDemoArr:any[] = [];
  selectedLeads:any[] = [];
  allUsersList:any[] = [];
  assignedUserId:string = "";
  choosenUser:any = {};
  isSelectAll:boolean = false;
  showAssignee:boolean = false;
  isApiInProcess:boolean = false;
  isAssignToActive:boolean = false;
  visibleDialogue5:boolean = false;
  isSelectionModeOn:boolean = false;
  apiSubscription:Subscription = new Subscription();
  eventSubscription:Subscription = new Subscription();

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllScheduleDemoLeads();
  }

  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();
    this.eventSubscription.unsubscribe();
  }

  getPopUp(userData:any={}, isCalledBySelection:boolean) {
    if(this.selectedLeads.length==0) {
      this.showAssignee = false;
      this.assignedUserId = "";
      this.utility.showToastMsg("error", "ERROR", "Please seleact atleast one lead before assign");
      return;
    }

    if(isCalledBySelection) {
      this.visibleDialogue5 = true;      
      this.choosenUser = userData;
    } else {
      this.visibleDialogue5 = false;
      this.onAssignItem();
    }
  }

  getAllUsers() {
    this.eventSubscription = this.eventService.allUserDataEmit.subscribe({
      next: (res:any) => {
        this.allUsersList = res;
      }, error: (err:any) => console.log(err)
    });
  }

  getAllScheduleDemoLeads() {
    this.isApiInProcess = true;
    this.scheduleDemoArr = [];
    this.apiSubscription = this.apiService.getAllScheduleDemoLeads().subscribe({
      next: (res:any) => {
        if(!res.error) {
          this.scheduleDemoArr = res.result;
          this.isApiInProcess = false;
        }
      }, error: (err:any) => console.log(err)
    })
  }

  toggleSelectAll(event:any) {
    this.selectedLeads = [];
    this.isSelectAll = event.target.checked;
    
    if(this.isSelectAll) {
      this.scheduleDemoArr.forEach((item:any) => {
        if(!item.is_assigned) { this.selectedLeads.push(item.id); }
      });
    }
  }

  onSingleSelect(item:any) {
    if(!this.selectedLeads.includes(item.id)) { this.selectedLeads.push(item.id); }
    else { this.selectedLeads.splice(this.selectedLeads.indexOf(item.id), 1); }
  }

  onClickAssign() {
    this.isAssignToActive = !this.isAssignToActive;
    this.showAssignee = false;
  }

  onAssignItem() {
    const date = new Date();
    this.assignedUserId = this.choosenUser.id;
    
    const apiBody = {
      existingUser: this.utility.fetchUserSingleDetail("id"),
      assignedUser: this.assignedUserId,
      selectedLeads: this.selectedLeads,
      assignedLeadData: {
        name: this.utility.fetchUserSingleDetail("name"),
        date: this.datepipe.transform(date, 'yyyy-MM-dd, hh:mm:ss')
      }
    };

    this.apiService.addScheduledDemoLead(apiBody).subscribe({
      next: (res:any) => {
        if(!res?.error) {
          this.apiService.updateScheduleDemoStatus({selectedLeads: this.selectedLeads}).subscribe({
            next: (res2:any) => {
              if(!res2.error) {
                this.assignedUserId = "";
                this.selectedLeads = [];
                this.isSelectAll = false;
                this.isAssignToActive = false;
                this.showAssignee = false;
                this.getAllScheduleDemoLeads();
                this.utility.showToastMsg("success", "SUCCESS", `Selected Leads have been moved to ${(this.choosenUser?.name).toUpperCase()} account`);   
              }
            }, error: (err2:any) => console.log(err2)
          });
        }
      }, error: (err:any) => console.log(err)
    });
  }
}
