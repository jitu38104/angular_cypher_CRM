import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LeadModel } from 'src/app/models/leadModel';
import { ApiService } from 'src/app/services/api.service';
import { EventsService } from 'src/app/services/events.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-leads-list',
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.scss']
})
export class LeadsListComponent implements OnInit, OnDestroy{
  constructor(
    private datePipe: DatePipe,
    private eventService: EventsService,
    private apiService: ApiService,
    private utility: UtilitiesService
  ) {}

  todayDate:Date = new Date();
  choosenStatus:string = "";
  // apiBody = { userId: "", from: this.datePipe.transform(this.todayDate, "yyyy-MM-dd"), to: this.datePipe.transform(this.todayDate, "yyyy-MM-dd") };
  assigneeList:any[] = [];
  searchedData:any[] = [];
  copyLeadList:any[] = [];
  isApiInProcess:boolean = false;
  // tableHeads = new LeadModel().getCurrentKeys("open");
  statusType:any[] = [
    {label: "Today Followup", value: "open"},
    {label: "Next Followup", value: "followup"},
    {label: "Reject", value: "reject"},
    {label: "Close", value: "close"},
    // {label: "Status", value: "status"},
  ];
  // getCurrentStatus = (val:string):string => val!=""?this.statusType.filter(item => item.value == val)[0]["label"]:"";

  eventSubscription1:Subscription = new Subscription();
  apiSubscription1:Subscription = new Subscription();

  ngOnInit(): void {
    this.getAllUser();
    this.OnSearchUserLeads();
  }

  ngOnDestroy(): void {
    this.eventSubscription1.unsubscribe();
    this.apiSubscription1.unsubscribe();
  }

  getAllUser() {
    this.eventSubscription1 = this.eventService.allUserDataEmit.subscribe({
      next: (res:any) => this.assigneeList = res,
      error: (err:any) => console.log(err)
    });
  }

  onChangeSelect(e:any) {
    const value = e.target.value;
    this.onFilterByAdmin(value, value=="");
  }

  OnSearchUserLeads() {
    this.isApiInProcess = true;
    
    this.apiSubscription1 = this.apiService.getUserAllLeadsAPI().subscribe({
      next: (res:any) => {
        if(!res.error) {
          this.searchedData = res?.result;
          this.eventService.passDataToHome.next({
            status: "admin",
            listData: this.searchedData
          });
          this.isApiInProcess = false;
        }
      }, error: (err:any) => {
        console.log(err);
        this.isApiInProcess = false;
      }
    })
  }

  async onFilterByAdmin(userId:number, isAll:boolean=false) {
    this.isApiInProcess = true;
    if(!isAll) {this.copyLeadList = await this.searchedData.filter(item => item["user_id"]==userId);}
    else {this.copyLeadList = JSON.parse(JSON.stringify(this.searchedData));}
    this.eventService.passDataToHome.next({ status: "admin", listData: this.copyLeadList });
    this.isApiInProcess = false;
  }
}
