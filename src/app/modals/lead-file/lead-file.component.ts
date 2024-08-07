import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, interval, take } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CsvParserService } from 'src/app/services/csv-parser.service';
import { EventsService } from 'src/app/services/events.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-lead-file',
  templateUrl: './lead-file.component.html',
  styleUrls: ['./lead-file.component.scss']
})
export class LeadFileComponent implements OnInit, OnDestroy{
  constructor(
    private csvparser: CsvParserService,
    private apiService: ApiService,
    private activeModal: NgbActiveModal,
    private eventService: EventsService,
    private utility: UtilitiesService
  ) {}

  apiSubscription1:Subscription = new Subscription();
  apiSubscription2:Subscription = new Subscription();
  eventSubscription1:Subscription = new Subscription();
  eventSubscription2:Subscription = new Subscription();

  acceptExcelFormats:string = ".csv";//, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
  existingEmails:string[] = [];
  isApiInProcess:boolean = false;
  fileInpVal:any;
  isSevenSecPassed:boolean = false;
  fileName:string = "Choose file";

  ngOnInit(): void {
    this.eventSubscription1 = this.eventService.passExistingEmails.subscribe({
      next: (res:any) => { this.existingEmails = res; }, 
      error: (err:any) => { console.log(err); }
    });
  }

  openExcelFileInp(fileElem:HTMLInputElement) {fileElem.click();}

  onDismissModal = () => this.activeModal.dismiss('Cross click');

  onSelectFile(event:any) {
    this.fileInpVal = event.target;
    this.fileName = this.fileInpVal.files[0].name;
  }

  onSubmit(btnElem:HTMLButtonElement) {
    this.startTimer();
    btnElem.children[0].innerHTML = "Submitting...";
    
    this.csvparser.convertIntoJson(this.fileInpVal, (err:any, csvRecords:any) => {
      if(!err) {
        this.isApiInProcess = true;
        this.checkEmailAvailability(csvRecords, (filteredCsvRecords:any[], alreadyExistLeads:any[]) => {
          if(filteredCsvRecords.length>0) {
            const apiBody = { excelJson: JSON.stringify(filteredCsvRecords) };
            this.apiSubscription1 = this.apiService.addMultiOpenLeadAPI(apiBody).subscribe({
              next: (res:any) => {
                this.onDismissModal();
                this.isApiInProcess = false;
                this.eventService.onCompleteInsertion.next("Inserted");
                this.utility.showToastMsg("success", "SUCCESS", "Leads are inserted successfully!");                
                this.eventSubscription2.unsubscribe();
              }, error: (err:any) => { console.log(err); }
            });
          } else {
            this.onDismissModal();
            this.utility.showToastMsg("error", "Exist Email", "All emails are already exist!");
          }
          setTimeout(() => {
            this.eventService.excelExistLeadEmit.next({
              hasEmails: alreadyExistLeads.length>0,
              existLeads: alreadyExistLeads
            });
          }, 500);
        });
      } else console.log(err);
    });
  }

  checkEmailAvailability(csvDataList:any[], callBack:Function) {
    const compareFunc = (mainVal:any, subVal:any) => ((mainVal["email"]).trim().toLowerCase()==(subVal["email"]).trim().toLowerCase()) || ((mainVal["company"]).trim().toLowerCase()==(subVal["company"]).trim().toLowerCase());
    
    this.apiSubscription2 = this.apiService.getAllEmailsListAPI().subscribe({
      next: async(res:any) => {
        if(!res?.error) {
          this.isApiInProcess = true;
          let emailList:any = [], companyList:any = [];
          const allExistEmails = res?.result["emails"];
          const allExistCompanies = res?.result["companies"];
          const arrLen1 = allExistEmails.length;
          const arrLen2 = allExistCompanies.length;

          for(let i=0; i<arrLen1; i++) { emailList.push(allExistEmails[i]["email"]); }
          for(let i=0; i<arrLen2; i++) { companyList.push(allExistCompanies[i]["company"]); }

          const splittedCombinedEmails = emailList.toString().split(",");
          const trimmedEmails = await splittedCombinedEmails.map((item:string) => item.trim());
          emailList = await trimmedEmails.filter((item:string) => !["", " "].includes(item));
          
          const filterLevelOne = await csvDataList.filter((item:any) => !emailList.includes((item["email"]).trim().toLowerCase()));
          const filterLevelTwo = await filterLevelOne.filter((item:any) => !companyList.includes((item["company"]).trim().toLowerCase()));
          const alreadyExistRecords = await csvDataList.filter((item1:any) => !filterLevelTwo.some((item2:any) => compareFunc(item1, item2)));
          
          callBack(filterLevelTwo, alreadyExistRecords);
        }
      }
    });
  }

  startTimer() {
    this.eventSubscription2 = interval(1000).pipe(take(20)).subscribe({
      next: (res:any) => {
        if(res+1 == 7) this.isSevenSecPassed = true;
        if(res+1 == 20) this.isSevenSecPassed = false;
      }, error: (err:any) => console.log(err)
    });
  }

  ngOnDestroy(): void {
    this.eventSubscription1.unsubscribe();
    if(this.eventSubscription2) this.eventSubscription2.unsubscribe();
    this.apiSubscription1.unsubscribe();
    this.apiSubscription2.unsubscribe();
  }
}

 
