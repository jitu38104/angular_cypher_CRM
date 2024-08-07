import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CSVModel } from 'src/app/models/excelModel';
import { ApiService } from 'src/app/services/api.service';
import { EventsService } from 'src/app/services/events.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-lead-add',
  templateUrl: './lead-add.component.html',
  styleUrls: ['./lead-add.component.scss']
})
export class LeadAddComponent implements OnInit, OnDestroy {
  constructor(
    private activeModal: NgbActiveModal,
    private apiService: ApiService,
    private utility: UtilitiesService,
    private eventService: EventsService,
    private datePipe: DatePipe
  ) {}
 
  sourceList:string[] = ["database", "linkedin", "exhibition", "reference", "website", "online lead"];
  addLeadValues:CSVModel = new CSVModel();
  apiSubscription:Subscription = new Subscription();
  eventSubscription:Subscription = new Subscription();
  existingEmails:string[] = [];
  isBtnClicked:boolean = false;

  validationCounter:number = 0;

  ngOnInit(): void {
    this.eventSubscription = this.eventService.passExistingEmails.subscribe({
      next: (res:any) => { this.existingEmails = res.filter((item:string) => item!=""); }, 
      error: (err:any) => { console.log(err); }
    });
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
    this.apiSubscription.unsubscribe();
  }

  onDismissModal = () => this.activeModal.dismiss('Cross click');

  onSubmit() {
    if(this.onValidateFields()) {
      this.isBtnClicked = true;

      // const emailExcludeParams = ["na", "NA", "N/A", "n/a", ""];

      // if(!emailExcludeParams.includes(this.addLeadValues.email) && this.existingEmails.includes(this.addLeadValues.email)) {
      //   this.isBtnClicked = false;
      //   this.utility.showToastMsg("error", "Email Exist", "Email is already exist!");
      //   return;
      // }

      this.addLeadValues.email = this.addLeadValues.email.toLowerCase();
      this.getEmailExistanceChecked(this.addLeadValues.email, (emailFlag:string) => {
        if(emailFlag == "NOT EXIST") this.onAddingFreshLead();
        else {
          this.isBtnClicked = false;
          this.utility.showToastMsg("error", "Email Exist", "Email is already exist!");
          return;
        }
      });      
    }
  }

  getEmailExistanceChecked(email:string, callback:Function) {
    const emailExcludeParams = ["na", "NA", "N/A", "n/a", ""];

    if(emailExcludeParams.includes(email)) callback("NOT EXIST");
    else {
      this.apiService.getEmailExistanceAPI(email).subscribe({
        next: (res:any) => {
          if(!res?.error) callback(res?.flag);
        }, error: (err:any) => console.log(err)
      });
    }
  }

  onAddingFreshLead() {
    const currentDate = new Date();
    this.addLeadValues.currentStage = "open";
    this.addLeadValues.userId = this.utility.fetchUserSingleDetail("id");
    this.addLeadValues.transTime = this.utility.createTimeFormat();
    this.addLeadValues.lastFollow = `${this.datePipe.transform(currentDate, "yyyy-MM-dd HH:mm:ss")}`;

    this.apiSubscription = this.apiService.addSingleOpenLeadAPI(this.addLeadValues).subscribe({
      next: (res:any) => {
        if(!res?.err) {
          console.log(res?.msg);
          this.isBtnClicked = false;
          this.onDismissModal();
          this.eventService.onCompleteInsertion.next("Inserted");
          this.utility.showToastMsg("success", "SUCCESS", "Leads are inserted successfully!");
        }
      },
      error: (err:any) => {console.log(err)}
    });
  }

  onValidateFields():boolean {
    const objKeys = ["username", "company", "email", "contact", "remark", "source"];  
    this.removeAllErrors(objKeys);

    for(let i=0; i<objKeys.length; i++) {
      // if(objKeys[i] == "username" && this.addLeadValues.username=="") this.addClassName("username");
      if(objKeys[i] == "company" && this.addLeadValues.company=="") this.addClassName("company");
      // else if(objKeys[i] == "remark" && this.addLeadValues.remark=="") this.addClassName("remark");
      else if(objKeys[i] == "source") {
        if(this.addLeadValues.source=="") this.addClassName("source");
        else if(this.addLeadValues.source=="reference") {
          if(this.addLeadValues.reference.company=="") this.addClassName("referCompany");
          if(this.addLeadValues.reference.name=="") this.addClassName("referClient");
        }     
      }
      /*else if(objKeys[i] == "email") {
        if(this.addLeadValues.email=="") this.addClassName("email");
        else if(!this.addLeadValues.email.includes("@") || !this.addLeadValues.email.includes("@")) this.addClassName("email");
      } else if(objKeys[i] == "contact") {
        if(this.addLeadValues.contact=="") this.addClassName("contact");
        else if(this.addLeadValues.contact.length<10) this.addClassName("contact");
      } */
    }

    return this.validationCounter==0;
  }

  removeAllErrors(objKeys:string[]) {
    this.validationCounter = 0;
    objKeys.forEach((val:string) => this.addClassName(val, true));
    
    if(this.addLeadValues.source=="reference") {
      ["referCompany", "referClient"].forEach((val:string) => this.addClassName(val, true));
    }
  }

  addClassName(tagId:string, shouldRemove:boolean=false) {
    const elemTag = document.getElementById(tagId) as HTMLDivElement;
    if(!shouldRemove) {
      elemTag.classList.add("error-show");
      this.validationCounter++;
    }
    else elemTag.classList.remove("error-show");
  }
}
