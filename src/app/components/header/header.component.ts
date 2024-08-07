import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { EventsService } from 'src/app/services/events.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utility: UtilitiesService,
    private eventService: EventsService,
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {}

  isLoginPage:boolean = false;
  isLogoutClicked:boolean = false;
  currentUserData:any = {};
  eventSubscription2:Subscription = new Subscription();
  apiSubscription:Subscription = new Subscription();

  ngOnInit(): void {
    this.router.events.subscribe((res:any) => {
      if(this.route.snapshot.routeConfig?.path == "login") this.isLoginPage = true;
      else {
        this.currentUserData = this.utility.fetchUserDetails();
        this.isLoginPage = false;
      }
    });

    //to alert about login
    this.eventSubscription2 = this.eventService.userLoginEvent.subscribe({
      next: (res:any) => {
        this.utility.showToastMsg("success", "SUCCESS", "Login Successfully😄!");
      }
    });
  }

  onClickLogout() {
    const today = new Date();
    const {email, loginId:id} = this.utility.fetchUserDetails();
    const time = this.datePipe.transform(today, "HH:mm");
    this.isLogoutClicked = true;
    
    if(["",undefined,null].includes(id)) {
      localStorage.setItem("crm_user", "{}");
      location.reload();
      this.isLogoutClicked = false;
    } else {
      this.apiService.logoutAPI({email, id, time}).subscribe({
        next: (res:any) => {
          if(!res.error && res.msg=="Logout Successfully") {
            localStorage.setItem("crm_user", "{}");
            location.reload();
            this.isLogoutClicked = false;
          }
        }, error: (err:any) => {
          console.log(err);
          this.isLogoutClicked = false;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.eventSubscription2.unsubscribe();
  }
}
