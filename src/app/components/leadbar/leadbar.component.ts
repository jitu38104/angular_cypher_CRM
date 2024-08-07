import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, filter } from 'rxjs';
import { LeadAddComponent } from 'src/app/modals/lead-add/lead-add.component';
import { LeadFileComponent } from 'src/app/modals/lead-file/lead-file.component';
import { ApiService } from 'src/app/services/api.service';
import { CsvParserService } from 'src/app/services/csv-parser.service';
import { EventsService } from 'src/app/services/events.service';
import { UtilitiesService } from 'src/app/services/utilities.service';


@Component({
  selector: 'app-leadbar',
  templateUrl: './leadbar.component.html',
  styleUrls: ['./leadbar.component.scss']
})
export class LeadbarComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private csvparser: CsvParserService,
    private apiService: ApiService,
    private eventService: EventsService,
    private utility: UtilitiesService
  ) {}

  @Input() stage:string = "";
  @Input() leadList:any[] = [];
  @Output() callBack:EventEmitter<any[]> = new EventEmitter<any[]>();

  apiSubscription1:Subscription = new Subscription();
  eventSubscription1:Subscription = new Subscription();
 
  searchPlaceholder:string = "Search email, company, contact etc";
  acceptExcelFormats:string = ".csv";//, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
  stages:any[] = [
    {id: "open", optionName: "Today Followup", isDisable: false},
    {id: "follow-up", optionName: "Next Followup", isDisable: false},
    {id: "reject", optionName: "reject", isDisable: false},
    {id: "close", optionName: "close", isDisable: false},
    {id: "status", optionName: "lead status", isDisable: false}
  ];
  existingEmails:string[] = [];
  searchInp:string = "";
  conditionalStages:string[] = ['price','demo','invoice','tax'];

  apiBody = {from: "", to: ""};

  ngOnInit(): void {
    this.eventSubscription1 = this.eventService.passExistingEmails.subscribe({
      next: (res:any) => { this.existingEmails = res; }, 
      error: (err:any) => { console.log(err); }
    });
  }

  ngOnDestroy(): void {
    this.eventSubscription1.unsubscribe();
    this.apiSubscription1.unsubscribe();
  }

  sendInvoiceDatesEvent() {this.eventService.passDatesToInoviceLeads.next(this.apiBody);}

  openFileBrowser(elem:HTMLInputElement) { elem.click(); }

  onChangeStage(){
    this.router.navigate(["lead", this.stage]);
  }

  openAddLeadModal() {
    const modalRef = this.modalService.open(LeadAddComponent, { windowClass: 'leadAddModalCss' });
  }

  openExcelFileInp() {
    const modalRef = this.modalService.open(LeadFileComponent, { backdrop: "static", keyboard: false, windowClass: 'leadAddModalCss2' });
  }

  onSelectFile(event:any) {
    const fileInp = event.target;
    this.csvparser.convertIntoJson(fileInp, (err:any, csvRecords:any) => {
      if(!err) {
        const filteredCsvRecords = csvRecords.filter((item:any) => !this.existingEmails.includes(item["email"]));
        
        if(filteredCsvRecords.length==0) {
          fileInp.value = "";
          this.utility.showToastMsg("error", "Exist Email", "All emails are already exist!");
          return;
        }

        const apiBody = { excelJson: JSON.stringify(csvRecords) };
        this.apiSubscription1 = this.apiService.addMultiOpenLeadAPI(apiBody).subscribe({
          next: (res:any) => {
            fileInp.value = "";
            this.eventService.onCompleteInsertion.next("Inserted");
            this.utility.showToastMsg("success", "SUCCESS", "Leads are inserted successfully!");
          }, error: (err:any) => { console.log(err); }
        });
      } else console.log(err);
    });
  }

  onFilterLeads() {
    const toLower = (item:any):string => typeof item=="string" ? item.toLowerCase() : item+"";
    const filteredList = this.leadList.filter((item:any) => (Object.values(item).filter((item2:any) => toLower(item2).includes(this.searchInp.trim().toLowerCase()))).length>0);
    this.callBack.emit(filteredList);
  }
}
