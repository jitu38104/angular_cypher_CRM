import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { EventsService } from 'src/app/services/events.service';
import { ExcelCreatorService } from 'src/app/services/excel-creator.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  constructor(
    private eventService: EventsService,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private excelFileService: ExcelCreatorService
  ) {}

  todayDate:Date = new Date();
  eventSubscription1:Subscription = new Subscription();
  assigneeList:any[] = [];
  tableHeads:string[] = ["S. No.", "Date", "Day", "Name", "User ID", "Login Time", "Logout Time", "Total Minutes"];
  apiBody = { userId: "all", from: this.datePipe.transform(this.todayDate, "yyyy-MM-dd"), to: this.datePipe.transform(this.todayDate, "yyyy-MM-dd") };
  totalMinutes:number = 0;
  attendanceData:any[] = [];
  tempAttendanceData:any[] = [];
  isApiInProcess:boolean = false;
  isSingleDateSelected:boolean = false;

  ngOnInit(): void {
    this.getAllUser();
    this.onSearchUserAttendance();
  }

  getAllUser() {
    this.eventSubscription1 = this.eventService.allUserDataEmit.subscribe({
      next: (res:any) => this.assigneeList = res,
      error: (err:any) => console.log(err)
    });
  }

  onSearchUserAttendance() {
    this.isApiInProcess = true;
    this.totalMinutes = 0;
    this.attendanceData = [];
    this.apiService.getUserAttendanceAPI(this.apiBody).subscribe({
      next: (res:any) => {
        if(!res.error) {
          if(this.apiBody.userId!="all" && this.apiBody.from == this.apiBody.to) {
            this.isSingleDateSelected = true;
            this.tempAttendanceData = res?.result;
            this.attendanceData = res?.result;
            this.totalMinutes = res?.result.reduce((total:number, item:any) => total + Number(item["total_minutes"]), 0);
          } else {
            if(this.apiBody.userId=="all") this.onSelectMultiAll(res?.result);
            else this.attendanceData = this.reduceDuplicacy(res?.result);
          }
          this.isApiInProcess = false;
        }
      },
      error: (err:any) => console.log(err)
    });
  }

  onClickCheckbox(e:any) {
    const isChecked = e.target.checked;
    if(isChecked) {this.attendanceData = this.reduceDuplicacy(this.tempAttendanceData);}
    else this.attendanceData = this.tempAttendanceData;
  }

  reduceDuplicacy(result:any[]):any {
    let dateArr = result.map(item => this.datePipe.transform(item["Date"], "yyyy-MM-dd"));
    dateArr = Array.from(new Set(dateArr));

    if(dateArr.length>1) {
      const reducedArr = [];
      this.isSingleDateSelected = false;
      for(let i=0; i<dateArr.length; i++) {
        const tempArr = [];
        const resultLen = result.length;
        for(let j=0; j<resultLen; j++) {
          const convertedDate = this.datePipe.transform(result[j]["Date"], "yyyy-MM-dd");
          if(dateArr[i] == convertedDate) tempArr.push(result[j]);
          if(result.length-1 == j && tempArr.length>0) {
            const totalCount = tempArr.reduce((total:number, item:any) => total + Number(item["total_minutes"]), 0);
            const firstLogin = tempArr[0]["login_time"];
            const lastLogout = tempArr.at(-1)["logout_time"];
            const reducedArrItem = JSON.parse(JSON.stringify(tempArr[0]));
            reducedArrItem["total_minutes"] = totalCount;
            reducedArrItem["login_time"] = firstLogin;
            reducedArrItem["logout_time"] = lastLogout;
            reducedArr.push(reducedArrItem);
          }
        }
        if(dateArr.length-1 == i) return reducedArr;
      }
    } else if(dateArr.length==1) {
      const totalCount = result.reduce((total:number, item:any) => total + Number(item["total_minutes"]), 0);
      const firstLogin = result[0]["login_time"];
      const lastLogout = result.at(-1)["logout_time"];
      const reducedArrItem = JSON.parse(JSON.stringify(result[0]));
      reducedArrItem["total_minutes"] = totalCount;
      reducedArrItem["login_time"] = firstLogin;
      reducedArrItem["logout_time"] = lastLogout;
      return [reducedArrItem];
    }
  }

  onSelectMultiAll(result:any[]) {
    const getFormattedDate = (date:string) => this.datePipe.transform(date, "yyyy-MM-dd");
    let dateArr = result.map(item => getFormattedDate(item["Date"]));
    dateArr = Array.from(new Set(dateArr));

    const tempArr:any[] = [];
    for(let i=0; i<dateArr.length; i++) {
      const dateWiseDataArr = result.filter(item => dateArr[i] == getFormattedDate(item["Date"]));
      const allDuplicateUsers = dateWiseDataArr.map(item => item["name"]);
      const allUsers = Array.from(new Set(allDuplicateUsers));

      for(let j=0; j<allUsers.length; j++) {
        const userWiseDataArr = dateWiseDataArr.filter(item => allUsers[j] == item["name"]);
        const getReducedData = this.reduceDuplicacy(userWiseDataArr);
        if(getReducedData.length>0) getReducedData.forEach((item:any) => tempArr.push(item)); 
      }
      if(dateArr.length-1 == i) this.attendanceData = tempArr;
    }
  }

  onClickExcelFile() {
    const todayDate = new Date();
    this.excelFileService.exportAsExcelFile(this.attendanceData, `Attendance_${this.datePipe.transform(todayDate, "ddMMYYYY")}`, "attandence");
  }
}
