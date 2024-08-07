import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) { }

  hasUserLoggedIn() {
    const currentUser = localStorage.getItem("crm_user");

    if (["{}", null, undefined].includes(currentUser)) {
      this.router.navigate(["login"]);
    } else {
      const parsedUser = JSON.parse(currentUser || "{}");
      if(parsedUser?.loginDate) {
        const dateArr = [new Date(), new Date(parsedUser?.loginDate)];
        const datesArr = [
          this.datePipe.transform(dateArr[0], "MM/dd/yyyy"),
          this.datePipe.transform(dateArr[1], "MM/dd/yyyy")
        ];
  
        if(datesArr[0] != datesArr[1]) this.onNavigateToLogin();
      } else this.onNavigateToLogin();
    }
  }

  onNavigateToLogin() {
    localStorage.setItem("crm_user", "{}");
    this.router.navigate(["login"]);
  }

  fetchUserDetails() {
    const currentUser = localStorage.getItem("crm_user");
    return JSON.parse(currentUser || "{}");
  }

  fetchUserSingleDetail(key: string) {
    const userData = this.fetchUserDetails();
    return userData[key];
  }

  isUserAdmin(): boolean {
    const userDetails = this.fetchUserDetails();
    const role = userDetails["role"];
    return role == "admin";
  }

  setOpenLeadHighLighted(dataObj:any) {
    window.localStorage.setItem("highlighted", JSON.stringify(dataObj));
  }

  getOpenLeadHighLighted():any {
    return JSON.parse(window.localStorage.getItem("highlighted") || "{}");
  }

  isHighlightedLeadAlreadyExist(status:string, leadId:any):boolean {
    const existObj = this.getOpenLeadHighLighted();
    if(Object.keys(existObj).length>0 && existObj.hasOwnProperty(status) && (existObj[status]).length>0) {
      return (existObj[status]).includes(leadId);
    } else return false;
  }

  


  timeConverter(time: any) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }


  createTimeFormat(dateTime: any = null) {
    const addZero = (digit: number) => digit < 10 ? "0" + digit : digit;

    const newDate = dateTime != null ? new Date(dateTime["date"]) : new Date();
    const date = `${addZero(newDate.getFullYear())}-${addZero(newDate.getMonth() + 1)}-${addZero(newDate.getDate())}`;
    const time = dateTime != null
      ? `${addZero(Number((dateTime["time"]).split(":")[0]))}:${addZero(Number((dateTime["time"]).split(":")[1]))}:00`
      : `${addZero(newDate.getHours())}:${addZero(newDate.getMinutes())}:00`;

    return `${date} ${time}`;
  }


  setValuesForOpenLead(leadModel: any, followupLeads: any, callBy: string) {
    leadModel.userId = followupLeads["user_id"] || "";
    leadModel.leadId = followupLeads["leadid"] || "";
    leadModel.username = followupLeads["name"] || "";
    leadModel.company = followupLeads["company_name"] || "";
    leadModel.designation = followupLeads["designation"] || "";
    leadModel.department = followupLeads["department"] || "";
    leadModel.address = followupLeads["address"] || "";
    leadModel.location = followupLeads["location"] || "";
    leadModel.email = followupLeads["email"] || "";
    leadModel.contact = followupLeads["contact"] || "";
    leadModel.gst = followupLeads["gst_num"] || "";
    leadModel.pan = followupLeads["pan_num"] || "";
    leadModel.iec = followupLeads["iec_num"] || "";
    leadModel.remark = followupLeads["remarks"];
    leadModel.assignedFrom = followupLeads["assigned_from_id"] || followupLeads["assigned_from"] || "";
    leadModel.currentStage = "open";
    leadModel.leadTracker = followupLeads["lead_tracker"] || "";
    leadModel.followupTracker = followupLeads["followup_tracker"] || "";
    leadModel.transTime = new Date().toISOString();
    leadModel.nextFollow = followupLeads["next_followup"] || "";
    leadModel.lastFollow = followupLeads["last_followup"] || "";
    // if(["login","lead","leadEdit-open"].includes(callBy)) { //while login and restore
    // }

    // //for all such as demo, pricing, invoice
    // if(callBy=="leadEdit") { 
    //   leadModel.nextFollow = "";
    //   if(leadModel.followupTracker != "") {
    //     const parsedArr = JSON.parse(leadModel.followupTracker);
    //     leadModel.lastFollow = parsedArr[0]["date"];      
    //   } else { leadModel.lastFollow = ""; }
    // }

    return leadModel;
  }


  showToastMsg(severity: string, summary: string, detail: string) {
    const toastData = { severity, summary, detail };
    this.messageService.add(toastData);
  }



  //convert amount digits to english sentence
  convertNumberToWords(amount:number|string|any) {
    if([null,undefined,""].includes(amount)) return "";
    
    let words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    let atemp = amount.split(".");
    let number = atemp[0].split(",").join("");
    let n_length = number.length;
    let words_string = "";
    if (n_length <= 9) {
        let n_array:any = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        let received_n_array = new Array();
        for (let i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (let i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (let i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        let value:any = "";
        for (let i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    return words_string;
  }
}
