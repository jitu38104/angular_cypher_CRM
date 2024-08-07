import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LeadEditComponent } from 'src/app/modals/lead-edit/lead-edit.component';
import { Subscription } from 'rxjs';
import { LeadModel, PageEvent, infoModalProformaKeyVal, infoModalStatusKeyVal, infoModalTaxKeyVal } from 'src/app/models/leadModel';
import { EllipsisPipe } from 'src/app/common/ellipsis.pipe';
import { CSVModel } from 'src/app/models/excelModel';
import { LeadInvoiceComponent } from 'src/app/modals/lead-invoice/lead-invoice.component';
import { UtilitiesService } from '../../services/utilities.service';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';
import { ExcelCreatorService } from 'src/app/services/excel-creator.service';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private utility: UtilitiesService,
    private apiService: ApiService,
    private datepipe: DatePipe,
    private titlecasepipe: TitleCasePipe,
    private ellipsespipe: EllipsisPipe,
    private eventService: EventsService,
    private excelFileService: ExcelCreatorService
  ) { this.urlDetectionEvent(); }

  apiSubscription1:Subscription = new Subscription();
  apiSubscription2:Subscription = new Subscription();
  apiSubscription3:Subscription = new Subscription();
  apiSubscription4:Subscription = new Subscription();
  apiSubscription5:Subscription = new Subscription();
  eventSubscription1:Subscription = new Subscription();
  eventSubscription2:Subscription = new Subscription();
  eventSubscription3:Subscription = new Subscription();
  eventSubscription4:Subscription = new Subscription();
  eventSubscription5:Subscription = new Subscription();
  eventSubscription6:Subscription = new Subscription();
  eventSubscription7:Subscription = new Subscription();
  eventSubscription:any;

  @Input() isHomePage:boolean = true;
  @Input() currentStage:string = "";
  @Input() isApiInProcess:boolean = false;
  
  leadData:any = {};
  tableHeads = new LeadModel().getCurrentKeys("open");
  excelModelVal:CSVModel = new CSVModel();
  // currentStage:string = this.isHomePage? "": this.choosenStatus;
  isButtonClicked:boolean = false;
  taxNum:string = "";
  piNum:string = "";
  tdModalType:string = "last_followup";
  tableHeadCheckBox:string[] = ["email", "company_name", "contact"];
  copyItems:any = {};

  isUserAllowedToAssign:boolean = this.utility.fetchUserSingleDetail("has_assignment");
  isAssignToActive:boolean = false;
  showAssignee:boolean = false;
  isSelectedAll:boolean = false;
  assignedLeadsArr:any[] = [];
  assignedUserId:any = "";
  
  leadList:any[] = [];
  copyLeadList:any[] = [];
  assigneeList:any[] = [];

  visibleDialogue:boolean = false;
  visibleDialogue2:boolean = false;
  visibleDialogue3:boolean = false;
  visibleDialogue4:boolean = false;
  alreadyExistCompanies:any[] = [];
  followUpHistory:any[] = [];

  singleItemData:any = {};
  itemObjKeys:string[] = [];

  conditionalStages:string[] = ["status","close"];
  titleCondition:string[] = ["tax", "invoice"];
  sourceList:string[] = ["database", "linkedin", "exhibition", "reference", "website", "online lead"];
  remarkList:string[] = ["sample", "demo", "ringing", "pricing", "fresh", "call back", "already taken", "not connect"];
  taxPaymentList:string[] = ["regular", "personal"];
  errorTypes:any[] = ["", "null", null, "undefined", undefined];
  popupTitles:any = {
    last_followup: "Last Follow-ups",
    contact: "Contact List",
    email: "Email List"
  };

  // first: number = 0;
  // rows: number = 15;

  // onPageChange(event: PageEvent) {
  //   this.first = event.first;
  //   this.rows = event.rows;
  //   this.paginateTableData(event);
  // }

  // paginateTableData(paginatorData:any={}) {
  //   const copyTempData = JSON.parse(JSON.stringify(this.leadList));
  //   if(Object.keys(paginatorData).length>0) {
  //     const {first, rows} = paginatorData;
  //     this.copyLeadList = copyTempData.splice(first, rows);
  //   } else {this.copyLeadList = copyTempData.splice(0, this.rows); this.first=0;}
  // }

  setSearchedData() {
    this.eventSubscription6 = this.eventService.passDataToHome.subscribe({
      next: (res:any) => {
        const {status, listData} = res; 
        this.tableHeads = new LeadModel().getCurrentKeys(status);
        this.leadList = listData;
        this.copyLeadList = JSON.parse(JSON.stringify(this.leadList));
        this.isApiInProcess = false;
      }, error: (err:any) => console.log(err)
    });
  };

  urlDetectionEvent(isFirstTime=false) {
    this.eventSubscription1 = this.router.events.subscribe((res:any) => {
      if(res instanceof NavigationEnd) { 
        this.currentStage = this.route.snapshot.paramMap.get("stage") || "";
        // this.currentStage = this.currentStage=="price"?"pricing":this.currentStage;

        this.tableHeads = new LeadModel().getCurrentKeys(this.currentStage);

        if(this.apiSubscription1) this.apiSubscription1.unsubscribe();
        // this.getAllOpenLeads(this.currentStage);
        this.refreshPage();
      }
    }); 

    this.currentStage = this.route.snapshot.paramMap.get("stage") || "";
    this.refreshPage();
  }

  ngOnInit(): void {
    this.getAllUser();
    this.getInvoiceLeadDatesByEvent(); //to set event to fetch invoice data datewise only for once
    this.showOnExcelExistLeads(); //for getting list of leads while after importing csv file
    const today = new Date();
    this.eventSubscription2 = this.eventService.onCompleteInsertion.subscribe({
      next: (res:any) => {
        if(res == "Inserted") this.refreshPage();
        this.tableHeads = new LeadModel().getCurrentKeys(this.currentStage);
      }
    });

    //once the date reaches 1st of April all tracking number are to reset
    if((today.getMonth()+1) == 4 && today.getDate() == 1) this.resetInvoiceNumber();
    // else this.fetchInvoiceNumber();
    
    if(!this.isHomePage) { this.setSearchedData(); }
  }

  ngOnDestroy(): void {
    this.eventSubscription1.unsubscribe();
    this.eventSubscription2.unsubscribe();
    this.eventSubscription3.unsubscribe();
    this.eventSubscription4.unsubscribe();
    this.eventSubscription5.unsubscribe();
    this.eventSubscription6.unsubscribe();
    this.eventSubscription7.unsubscribe();
    this.apiSubscription1.unsubscribe();
    this.apiSubscription2.unsubscribe();
    this.apiSubscription3.unsubscribe();
    this.apiSubscription4.unsubscribe();
    this.apiSubscription5.unsubscribe();
    window.matchMedia('print').removeEventListener("change", this.eventSubscription);
  }

  getAllUser() {
    this.eventSubscription5 = this.eventService.allUserDataEmit.subscribe({
      next: (res:any) => this.assigneeList = res,
      error: (err:any) => console.log(err)
    });
  }

  onClickPrint() {
    this.eventService.onPassPrintCommand.next(true);
    window.print();
  }

  resetInvoiceNumber(){
    this.apiSubscription4 = this.apiService.resetInvoiceNumAPI().subscribe({
      next: async(res:any) => {
        if(!res.error) { console.log("Numbers are updated!") }
      }, error: (err:any) => console.log(err)
    });
  }

  fetchInvoiceNumber(callBack:Function) {
    const getStrNum = (num:number):string => num<10 ? `0${num}`: num+"";
    if(this.apiSubscription1) {this.apiSubscription1.unsubscribe();}
    this.apiSubscription1 = this.apiService.getInvoiceNumAPI().subscribe({
      next: (res:any) => {
        if(!res?.error) {
          this.taxNum = getStrNum(Number(res?.result[0]?.PI_num));
          this.piNum = getStrNum(Number(res?.result[0]?.order_num));
          callBack(false)
        }
      }, error: (err:any) => {callBack(true);}
    });
  }

  getAllOpenLeads(stageType:string) {
    this.leadList = [];
    this.copyLeadList = [];
    this.isApiInProcess = true;
    this.isAssignToActive = false;
    const userId = this.utility.fetchUserSingleDetail("id");
    const leadTypeAPI:any = {
      "open": this.apiService.getAllOpenLeadsAPI(userId),
      "close": this.apiService.getAllCloseLeadsAPI(userId),
      "follow-up": this.apiService.getAllFollowupLeadsAPI(userId),
      "reject": this.apiService.getAllRejectLeadsAPI(userId),
      "demo": this.apiService.getAllDemoLeadsAPI(userId),
      "price": this.apiService.getAllPriceLeadsAPI(userId),
      "status": this.apiService.getAllStatusLeadsAPI(userId),
      "invoice": this.apiService.getAllInvoiceLeadsAPI(userId),
      "tax": this.apiService.getAllTaxInvoiceLeadsAPI(userId)
    };

    if(!leadTypeAPI.hasOwnProperty(stageType)) return;

    this.apiSubscription1 = (leadTypeAPI[stageType]).subscribe({
      next: (res:any) => {
        this.leadList = res?.result;
        this.copyLeadList = res?.result;
        // this.paginateTableData();
        this.isApiInProcess = false;
        
        if(stageType=="open") {
          // this.getAllUser();
          const emailList:any[] = [];
          this.leadList.forEach((item:any, index:number) => {
            emailList.push(item["email"]);
            if(index==this.leadList.length-1) this.eventService.passExistingEmails.next(emailList);
          });          
        } else if(stageType=="status") {
          this.loopOutJsonLeads(res?.result);
        }
        // else if(stageType=="tax") this.loopOutJsonLeads(res?.result, "tax");
      }, error: (err:any) => {console.log(err);}
    });
  }

  loopOutJsonLeads(dataList:any[]) {
    this.leadList = [];
    this.copyLeadList = [];

    for(let i=0; i<dataList.length; i++) {
      const leadData = dataList[i]["lead_data"];
      const parsedJSON = JSON.parse(leadData);
      if(this.assigneeList.length>0) {
        parsedJSON["owned_by"] = this.assigneeList.filter(item => parsedJSON["userId"]==item?.id)[0]["name"];
      }
      this.leadList.push({...dataList[i], ...parsedJSON});
    }
    this.copyLeadList = JSON.parse(JSON.stringify(this.leadList));
    
    // this.paginateTableData();
  }

  setTableValues(data:any, key:string) {
    const dateKeys = ["last_followup", "next_followup", "transaction_time", "demo_time", "invoice_date", "closingTime"];

    // if(this.errorTypes.includes(data[key])) return "N/A";
    if(dateKeys.includes(key)) {
      if(this.errorTypes.includes(data[key])) return "";
      else {
        const dateTime = (data[key]).replace(new RegExp("NaN", "g"), "00");
        return this.datepipe.transform(dateTime, key=="invoice_date"?"MMM d, y":"MMM d, y, h:mm:ss a");
      }
    }
    else if(this.errorTypes.includes(data[key])) return "N/A";
    else if(["email", "contact", "address"].includes(key)) {
      const modifiedStr = (<string>data[key]).replace(new RegExp(",", "g"), ", ");
      if(["email", "contact"].includes(key)) return this.toTitleCase(this.titlecasepipe.transform(modifiedStr.split(",")[0]));
      return this.titlecasepipe.transform(modifiedStr);
    } 
    else if(["remarks","updated_remark"].includes(key)) return this.ellipsespipe.transform(data[key], 35);
    else if(key == "assigned_from") return this.toTitleCase(this.utility.fetchUserSingleDetail("id")==data["assigned_from_id"] ? "self" : data[key]);
    else return data[key]=="N/A" ? data[key] : this.titlecasepipe.transform(`${data[key]}`);
  }

  refreshPage() {
    const selectTag = document.getElementById("sourceId") as HTMLSelectElement;
    const selectTag2 = document.getElementById("sourceId2") as HTMLSelectElement;
    if(selectTag) selectTag.value = "";
    if(selectTag2) selectTag2.value = "";
    this.getAllOpenLeads(this.currentStage);
  }

  openEditModal(itemData:any) {
    this.fetchInvoiceNumber((error:boolean) => {
      if(!error) {
        const modalRef = this.modalService.open(LeadEditComponent, { windowClass: 'leadEditModalCss' });
        (<LeadEditComponent>modalRef.componentInstance).currentLeadPage = this.currentStage;
        (<LeadEditComponent>modalRef.componentInstance).onBindLeadData(itemData);
        (<LeadEditComponent>modalRef.componentInstance).piNum = this.piNum;
        const eventRef = (<LeadEditComponent>modalRef.componentInstance).callback.subscribe((res:any) => {
          console.log(res);
          if(res.isMsg) {
            const response = (<string>res.msg).toLowerCase();
            const flags = ["insert", "update", "delete"].filter((item:string) => response.includes(item));
            if(flags.length>0) this.refreshPage();
          } else { 
            this.updateInvoiceTracker("order_num");
            this.refreshPage();
          }
          eventRef.unsubscribe();
        });
      } else { this.utility.showToastMsg("error", "ERROR", "There is an Error while compilation!"); }
    });    
  }

  openAddPInvoice() {
    this.fetchInvoiceNumber((error:boolean) => {
      if(!error) {
        const modalRef = this.modalService.open(LeadInvoiceComponent, { backdrop: "static", keyboard: false, windowClass: 'leadAddModalCss3' });
        (<LeadInvoiceComponent>modalRef.componentInstance).isAddPI = true;
        (<LeadInvoiceComponent>modalRef.componentInstance).taxNum = this.taxNum;
        (<LeadInvoiceComponent>modalRef.componentInstance).orderNum = this.piNum;//["issued_By", "username", "invoice_No", "invoice_Date"]
        (<LeadInvoiceComponent>modalRef.componentInstance).labels = ["issued_By", "username", "invoice_Date"];
        const modalSubscription = (<LeadInvoiceComponent>modalRef.componentInstance).callback.subscribe({
          next: (res:any) => { 
            this.updateInvoiceTracker("order_num");
            this.refreshPage();
            modalSubscription.unsubscribe();
          }, error: (err:any) => console.log(err)
        });
        const modalSubscription2 = (<LeadInvoiceComponent>modalRef.componentInstance).printCallback.subscribe({
          next: (res:any) => { 
            if(res) window.print();
            setTimeout(() => this.eventService.onPassPrintCommand.next(false), 1000); 
            modalSubscription2.unsubscribe();
          }, error: (err:any) => console.log(err)
        });
      } else {this.utility.showToastMsg("error", "ERROR", "There is an Error while compilation!");}
    });
  }

  openInvoiceModal(itemData:any) {
    this.fetchInvoiceNumber((error:boolean) => {
      if(!error) {
        const suffixPiNum = `${new Date().getFullYear()}-${`${new Date().getFullYear()+1}`.substring(2, 4)}`;
        const modalRef = this.modalService.open(LeadInvoiceComponent, { backdrop: "static", keyboard: false, windowClass: 'leadAddModalCss3' });
        (<LeadInvoiceComponent>modalRef.componentInstance).currentStage = this.currentStage;
        if(this.currentStage == "invoice") {
          (<LeadInvoiceComponent>modalRef.componentInstance).onBindUserData(itemData);
          (<LeadInvoiceComponent>modalRef.componentInstance).taxNum = this.taxNum;
        } else (<LeadInvoiceComponent>modalRef.componentInstance).onBindRestoredData(itemData);
          
        const modalSubscription = (<LeadInvoiceComponent>modalRef.componentInstance).printCallback.subscribe({
          next: (res:any) => { 
            if(res) window.print();
            setTimeout(() => this.eventService.onPassPrintCommand.next(false), 1000); 
            modalSubscription.unsubscribe();
          }, error: (err:any) => console.log(err)
        });
            
        const modalSubs = (<LeadInvoiceComponent>modalRef.componentInstance).callback.subscribe({
          next: (res:any) => {
            if(res) {
              this.refreshPage();
              if(this.currentStage == "invoice") this.updateInvoiceTracker("PI_num");
              // this.apiSubscription2 = this.apiService.allDeleteAPIs(itemData["leadid"], itemData["user_id"], "Invoice").subscribe({
              //   next: (res:any) => {
                // this.refreshPage();
                // this.updateInvoiceTracker("PI_num");
              //   }, error: (err:any) => console.log(err)
              // });
            }
            modalSubs.unsubscribe();
          }
        });
      } else {this.utility.showToastMsg("error", "ERROR", "There is an Error while compilation!");}
    });
  }

  updateInvoiceTracker(colName:string) {
    this.apiSubscription3 = this.apiService.updateInvoiceNumAPI(colName)
    .subscribe({next: async(res:any) => { console.log("Invoice Number updated!"); }});
  }

  showDialog(itemVal:string, colType:string) {
    if(colType=="last_followup" && itemVal!="") {
      this.followUpHistory = JSON.parse(itemVal);
    } else if(["contact","email"].includes(colType)) {
      this.followUpHistory = itemVal.split(",");
    }
    this.tdModalType = colType;
    this.visibleDialogue = true;
  }

  showDialog2(itemData:any) {
    this.visibleDialogue2 = true;
    this.leadData = itemData;
  }

  restoreLeadToOpen() {
    this.excelModelVal = this.utility.setValuesForOpenLead(this.excelModelVal, this.leadData, "lead");
    this.isButtonClicked = true;
    this.apiService.revertToOpenLeadAPI(this.excelModelVal).subscribe({
      next: (res:any) => {
        if(!res.error) {
          const leadType = this.currentStage.replace(new RegExp(" ", "g"), "");
          this.apiService.allDeleteAPIs(this.leadData.id, this.leadData.user_id, leadType).subscribe({
            next: (res2:any) => {
              if(!res2.error) {
                this.visibleDialogue2 = false;
                this.isButtonClicked = false;
                this.refreshPage();
              }
            }, error: (err:any) => {console.log(err);}
          });
        }
      }, error: (err:any) => {console.log(err);}
    });
  }

  isHighlighted(item:any):string {
    const hightLightedData = this.utility.getOpenLeadHighLighted();
    if(this.currentStage == "open" && Object.keys(hightLightedData).length>0 && hightLightedData.hasOwnProperty("open")){
      const latestLeadId = hightLightedData.hasOwnProperty("openMark") ? (hightLightedData["openMark"]).at(-1) : null;
      const classname = (latestLeadId!=null && item["leadid"]==latestLeadId) ? "bg-pink-200"//"latest-mark"
                      : (hightLightedData["open"].includes(item["leadid"]))? "already-worked": "";
      return classname;
    } else return "";
  }


  onFilterLead(e:any) {this.copyLeadList = e;}

  onChangeSource(e:any, type:string) {
    const value = e.target.value;
    if(value == "") {this.copyLeadList = JSON.parse(JSON.stringify(this.leadList));}//{this.paginateTableData();}
    else {
      if(type == "tax") {
        this.copyLeadList = this.leadList.filter((item:any) => value=="personal"? item["payment_status"]=="cash": item["payment_status"]!="cash");
      } else if(type == "source") {
        this.copyLeadList = this.leadList.filter((item:any) => item["source"]==value);
      } else {
        this.copyLeadList = this.leadList.filter((item:any) => ((item["remarks"]).toLowerCase()).includes(value));
      }

      // if(this.copyLeadList.length <= this.rows) {this.first=0;}
    }
  }

  checkInfoAvailability(listStr:string):boolean {
    return !this.errorTypes.includes(listStr) && listStr.split(",").length>1;
  }

  toTitleCase(str:string) {
    if([undefined, null, ""].includes(str)) return "";
    else return str[0].toUpperCase() + str.substring(1, str.length);
  }
  doesFollowupExist(followupStr:string|any):boolean {
    if(this.errorTypes.includes(followupStr)) return false;
    else return true;
  }

  onSelectSingleItem(event:any, item:any, key:string) {
    const isChecked:boolean = event.target.checked;
    if(!this.copyItems.hasOwnProperty(key)) this.copyItems[key] = [];

      if(["email", "contact"].includes(key) && item.includes(",")) {
        const primaryItem = item.split(",")[0];
        if(isChecked) this.copyItems[key].push(primaryItem);
        else this.copyItems[key].splice(this.copyItems[key].indexOf(primaryItem), 1);
      } else {
        if(isChecked) this.copyItems[key].push(item);
        else this.copyItems[key].splice(this.copyItems[key].indexOf(item), 1);
      }
  }

  copyToClipboard(key:string) {
    if(!this.copyItems.hasOwnProperty(key) || this.copyItems[key].length==0) {
      this.utility.showToastMsg("error", "ERROR", "Please select atleast one item");
      return;
    }

    const textareaTag = document.getElementById("textareaElem") as HTMLTextAreaElement;
    const copyItemsList = this.copyItems[key];
    const leadsLen = copyItemsList.length;
    let copiedString = "";

    for(let i=0; i<leadsLen; i++) {
      if(copyItemsList[i] != "") copiedString += `${copyItemsList[i]}\n`;
    }

    textareaTag.value = copiedString;
    textareaTag.focus();
    textareaTag.select();
    navigator.clipboard.writeText(textareaTag.value).then(() => {
      this.uncheckCheckboxes(`checkbox-${key}`);
      this.copyItems[key] = [];
      this.utility.showToastMsg("success", "SUCCESS", `Selected ${key.replaceAll("_"," ")}s are successfully copied!`);
    }, (err:any) => {
      this.utility.showToastMsg("error", "ERROR", "There is some issue while copying.");
    });
  }

  uncheckCheckboxes(classname:string) {
    const checkboxesArr:any = document.querySelectorAll(`input[type='checkbox']:checked.${classname}`);
    for(let i=0; i<checkboxesArr.length; i++) {
      const checkboxTag = checkboxesArr[i] as HTMLInputElement;
      checkboxTag.checked = false;
    }
  }

  onClickInfoIcon(itemData:any) {
    this.visibleDialogue3 = true;
    this.singleItemData = itemData;
    this.itemObjKeys = this.currentStage=="status"
      ? Object.keys(infoModalStatusKeyVal)
      : this.currentStage=="invoice" 
        ? Object.keys(infoModalProformaKeyVal)
        : Object.keys(infoModalTaxKeyVal);
  }

  getInfoLabels(key:string) { 
    if(this.currentStage=="status") return infoModalStatusKeyVal[key];
    else if(this.currentStage=="invoice") return infoModalProformaKeyVal[key];
    else if(this.currentStage=="tax") return infoModalTaxKeyVal[key];
  }
  getInfoValues(key:string, value:string|any) {
    if(["",null,undefined," ","~"].includes(value)) return ["email","contact"].includes(key) ? []: "N/A";
    else {
      if(key=="transaction_time") return this.datepipe.transform(value, "dd/MM/YYYY hh:mm:ss a");
      else if(["email","contact"].includes(key)) return value.split(",");
      else return value;
    }
  }

  onClickAssign() {
    this.isAssignToActive = !this.isAssignToActive;
    this.showAssignee = false;
  }
  selectAllCheck(e:any) {
    const isChecked = e.target.checked;
    this.assignedLeadsArr = [];

    if(isChecked) {
      this.isSelectedAll = true;
      this.copyLeadList.forEach(item => this.assignedLeadsArr.push({
        id: item["id"],
        tracker: !this.errorTypes.includes(item["followup_tracker"])? JSON.parse(item["followup_tracker"]): []
      }));
    } else this.isSelectedAll = false;
  }
  onSelectSingleLead(e:any, lead:any) {
    const isChecked = e.target.checked;
    if(isChecked) this.assignedLeadsArr.push({
      id: lead?.id,
      tracker: !this.errorTypes.includes(lead["followup_tracker"])? JSON.parse(lead?.followup_tracker): []
    });
    else {
      this.assignedLeadsArr = this.assignedLeadsArr.filter(item => item?.id != lead?.id);
    }
  }

  onAssignItem(user:any) {
    const date = new Date();
    if(this.assignedLeadsArr.length==0) {
      this.showAssignee = false;
      this.assignedUserId = "";
      this.utility.showToastMsg("error", "ERROR", "Please seleact atleast one lead before assign");
      return;
    }

    this.assignedUserId = user?.id;
    const apiBody = {
      existingUser: this.utility.fetchUserSingleDetail("id"), 
      assignedUser: this.assignedUserId, 
      selectedLeads: this.assignedLeadsArr,
      assignedLeadData: {
        name: this.utility.fetchUserSingleDetail("name"), 
        date: this.datepipe.transform(date, 'yyyy-MM-dd, hh:mm:ss')
      }
    };

    this.apiService.updateOpenLeadUserAPI(apiBody).subscribe({
      next: (res:any) => {
        if(!res?.error) {
          this.assignedUserId = "";
          this.assignedLeadsArr = [];
          this.isSelectedAll = false;
          this.isAssignToActive = false;
          this.showAssignee = false;
          this.utility.showToastMsg("success", "SUCCESS", `Selected Leads have been moved to ${(user?.name).toUpperCase()} account`);
          this.refreshPage();
        }
      }, error: (err:any) => console.log(err)
    });
  }


  showOnExcelExistLeads() {
    this.eventSubscription4 = this.eventService.excelExistLeadEmit.subscribe({
      next: (res:any) => {
        console.log(res)
        if(res?.hasEmails) {
          this.visibleDialogue4 = true;
          this.alreadyExistCompanies = res?.existLeads;
        }
      }, error: (err:any) => console.log(err)
    });
  }

  getStatusColor(status:string):string {
    if(status == "demo") return "primary";
    else if(status == "price") return "orange";
    else if(status == "performa invoice") return "pink";
    else if(status == "process") return "green";
    else return "gray";
  }

  downloadTaxGstExcelFile() {
    const todayDate = new Date();
    this.excelFileService.exportAsExcelFile(this.copyLeadList, `GST_Return_${this.datepipe.transform(todayDate, "ddMMYYYY")}`, "taxInvoiceCA");
  }


  getInvoiceLeadDatesByEvent() {
    this.eventSubscription7 = this.eventService.passDatesToInoviceLeads.subscribe({
      next: (res:any) => {
        console.log(res);
        this.isApiInProcess = true;
        this.leadList = [];
        this.copyLeadList = [];
        const {from, to} = res;
        const apiBody = {
          userId: this.utility.fetchUserSingleDetail("id"),
          invoiceType: this.currentStage, from, to
        };

        this.getDatewiseInvoiceLeads(apiBody);      
      }, error: (err:any) => console.log(err)
    });
  }

  getDatewiseInvoiceLeads(apiBody:any) {
    console.log(apiBody)
    this.apiSubscription5 = this.apiService.getDatewiseInvoiceLeads(apiBody).subscribe({
      next: (res:any) => {
        if(!res?.error) {
          this.leadList = res?.result;
          this.copyLeadList = JSON.parse(JSON.stringify(this.leadList));
          this.isApiInProcess = false;
        }
      }, error: (err:any) => console.log(err)
    });
  }


}


