import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiMsgRes, NewCompanyDetails, UpdateCompanyRequestType } from 'src/app/common/dataType.types';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent {
  constructor(
    private datepipe: DatePipe,
    private utility: UtilitiesService,
    private apiService: ApiService,
  ) {}

  currentRequestId:number = 0;
  isPopupInUpdated:boolean = false;
  isApiInProcess:boolean = false;
  visibleDialogue5:boolean = false;
  isFormSubmitting:boolean = false;
  allRequestedCompanyArr:any[] = [];
  companyDetails:NewCompanyDetails = new NewCompanyDetails();
  apiSubscription1:Subscription = new Subscription();
  apiSubscription2:Subscription = new Subscription();
  apiSubscription3:Subscription = new Subscription();
  apiSubscription4:Subscription = new Subscription();

  ngOnInit(): void {
    this.getAllRequestedCompanies();
  }

  ngOnDestroy(): void {
    this.apiSubscription1.unsubscribe();
    this.apiSubscription2.unsubscribe();
    this.apiSubscription3.unsubscribe();
    this.apiSubscription4.unsubscribe();
  }


  getAllRequestedCompanies() {
    this.isApiInProcess = true;
    this.allRequestedCompanyArr = [];
    this.apiSubscription1 = this.apiService.getAllRequestedCompanies().subscribe({
      next: (res:ApiMsgRes) => {
        if(!res.error) {
          this.allRequestedCompanyArr = res.result;
          this.isApiInProcess = false;
        }
      }, error: (err:ApiMsgRes) => console.log(err)
    })
  }

  getPopUp(requestItem:any) {
    this.isPopupInUpdated = false;
    this.visibleDialogue5 = true;
    this.currentRequestId = requestItem?.status ? requestItem?.company_id : requestItem?.id;
    this.companyDetails = new NewCompanyDetails();
    
    if(requestItem?.status) {
      this.fetchCompanyById();
      this.isPopupInUpdated = true;
    }
  }

  updateRequest(res:ApiMsgRes) {
    const dateTime = new Date();
    const apiBody:UpdateCompanyRequestType = {
      id: this.currentRequestId, 
      datetime: this.datepipe.transform(dateTime, "MM/dd/yyyy, hh:mm a"),
      crmUserId: this.utility.fetchUserSingleDetail("id"),
      companyId: res.result[0]["id"]
    };

    this.apiSubscription2 = this.apiService.updateRequestedCompany(apiBody).subscribe({
      next: (res:ApiMsgRes) => {
        this.isFormSubmitting = false;
        if(!res.error) {
          this.utility.showToastMsg("success", "SUCCESS", "Company has been added successfully!");
          this.visibleDialogue5 = false;
          this.getAllRequestedCompanies();
        } else {
          this.utility.showToastMsg("error", "ERROR", res.msg);
        }
      }, error: (err:ApiMsgRes) => console.log(err)
    });
  }

  onSubmitRequestedCompany() {
    this.isFormSubmitting = true;
    this.apiSubscription3 = this.apiService.addNewCompany(this.companyDetails).subscribe({
      next: (res:ApiMsgRes) => {
        if(!res.error) { this.updateRequest(res); }
      }, error: (err:ApiMsgRes) => console.log(err)
    });
  }

  updateCompanyDetails() {
    this.isFormSubmitting = true;
    this.companyDetails.id = this.currentRequestId;
    this.apiSubscription4 = this.apiService.updateCompanyDetails(this.companyDetails).subscribe({
      next: (res:ApiMsgRes) => {
        this.utility.showToastMsg("success", "SUCCESS", "Company has been updated successfully!");
        this.visibleDialogue5 = false;
        this.getAllRequestedCompanies();
      }, error: (err:ApiMsgRes) => console.log(err)
    });
  }

  fetchCompanyById() {
    this.isFormSubmitting = true;
    this.apiService.getSingleCompanyDetail(this.currentRequestId).subscribe({
      next: (res:ApiMsgRes) => {
        this.companyDetails = res.result[0];
        this.isFormSubmitting = false;
      }, error: (err:ApiMsgRes) => console.log(err)
    });
  }
}
