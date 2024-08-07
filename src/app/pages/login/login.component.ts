import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CSVModel } from 'src/app/models/excelModel';
import { ApiService } from '../../services/api.service';
import { UtilitiesService } from '../../services/utilities.service';
import { EventsService } from '../../services/events.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SocketIoService } from 'src/app/services/socket-io.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  constructor(
    private router: Router,
    private apiService: ApiService,
    private utility: UtilitiesService,
    private eventService: EventsService,
    private datePipe: DatePipe,
    private socketService: SocketIoService
  ) {}

  loginBody = {username: "", password: ""};

  shouldPasswordVisible:boolean = false;

  apiSubscription1:Subscription = new Subscription();
  apiSubscription2:Subscription = new Subscription();

  otpVal:number = 0;
  otpBtn:string = "get otp";
  hasUsernameTyped:boolean = false;
  isBtnClicked:boolean = false;

  leadDataBody:CSVModel = new CSVModel();

  ngOnInit(): void {}

  onLoginSubmit() {
    this.isBtnClicked = true;
    const today = new Date();
    const date = this.datePipe.transform(today, 'MM-dd-yyyy');
    const time = this.datePipe.transform(today, 'HH:mm');
    const bodyObj = {date, time, ...this.loginBody};

    this.apiService.loginApi(bodyObj).subscribe({
      next: (res:any) => {
        if(!res.error) {
          this.isBtnClicked = false;
          this.router.navigate(["/home"]);
          const jsonObj = {loginDate: today, ...(res.result[0])};
          localStorage.setItem("crm_user", JSON.stringify(jsonObj));
          this.followupLeadsDeadLineCheckup(); //checks if followup leads are for today
          setTimeout(() => this.eventService.userLoginEvent.next(true), 100);
          
        } else alert(res.msg);
      },
      error: (err:any) => {
        this.isBtnClicked = false;
        alert(err["error"]["msg"]);
      }
    })
  }

  onLoginOtp() {
    const {username, password} = this.loginBody;
    if(password=="" && username != "") {
      this.otpVal = Math.floor(Math.random()*1000000);
      this.apiSubscription1 = this.apiService.otpWiseLoginAPI(this.otpVal).subscribe({
        next: (res:any) => {
          if(!res?.error) {
            console.log(res.result);
            this.hasUsernameTyped = true;
            this.otpBtn = "submit";
          }
        }, error: (err:any) => console.log(err)
      });
    } else {
      if(Number(password) == this.otpVal) alert("Yes you can log in");
      else alert("OTP is wrong");
    }
  }

  followupLeadsDeadLineCheckup() {
    const userId = this.utility.fetchUserSingleDetail("id");
    this.apiService.getAllFollowupLeadsAPI(userId).subscribe({
      next: async(res:any) => {
        if(!res.error) {
          const followupLeads = <any[]>res?.result;
          if(followupLeads.length > 0) {
            for(let i=0; i<followupLeads.length; i++) {
              const leadDate = followupLeads[i]["next_followup"];
              const dates:Date[] = [new Date(), new Date(leadDate)];
              
              if((dates[0].toLocaleDateString() == dates[1].toLocaleDateString()) || (dates[1].valueOf() < dates[0].valueOf())) {
                this.leadDataBody = await this.utility.setValuesForOpenLead(this.leadDataBody, followupLeads[i], "login");
              
                await this.insertFollowupToOpenLead(this.leadDataBody);
                await this.deleteFollowupLead({
                  id: followupLeads[i]["id"],
                  leadId: followupLeads[i]["leadid"],
                  userId: followupLeads[i]["user_id"]
                });
              }
            }
          }
        }
      },
      error: (err:any) => {console.log(err);}
    });
  }

  async insertFollowupToOpenLead(apiBody:any) {
    this.apiService.revertToOpenLeadAPI(apiBody).subscribe({
      next: (res:any) => {
        if(!res?.error) console.log("Inserted Followup to Open Lead!");
      },
      error: (err:any) => {}
    });
  }

  async deleteFollowupLead(bodyObj:any) {
     this.apiService.deleteFollowupLeadAPI(bodyObj).subscribe({
      next: (res:any) => {
        if(!res?.error) console.log("Deleted successfully!");
      },
      error: (err:any) => {console.log(err);}
    })
  }

  onPressEnter(e:any) {
    if(e.key == "Enter") this.onLoginSubmit();
  }
}
