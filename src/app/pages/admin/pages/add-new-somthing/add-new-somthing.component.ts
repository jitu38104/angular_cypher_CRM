import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { permissionModel, adminPermissionModel } from 'src/app/models/leadModel';
import { ApiService } from 'src/app/services/api.service';
import { EventsService } from 'src/app/services/events.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-add-new-somthing',
  templateUrl: './add-new-somthing.component.html',
  styleUrls: ['./add-new-somthing.component.scss']
})
export class AddNewSomthingComponent implements OnInit, OnDestroy{
  constructor(
    private apiService: ApiService,
    private utility: UtilitiesService,
    private eventService: EventsService
  ) {}

  apiSubscription1:Subscription = new Subscription();
  apiSubscription2:Subscription = new Subscription();
  apiSubscription3:Subscription = new Subscription();
  apiSubscription4:Subscription = new Subscription();

  isCustomMode:boolean = false;
  roles:any[] = [];
  isAdminOptSelected:boolean = false;
  userDataObj:any = {
    userName: "",
    userEmail: "",
    userPhone: "",
    password: "",
    roleId: 0,
    permissionId: 0,
    adminOptPermission: 0
  };
  permissions:any[] = JSON.parse(JSON.stringify(permissionModel));
  adminPermissions:any[] = JSON.parse(JSON.stringify(adminPermissionModel));


  onCheckClick = (e:any, item:any) => {
    const checkBool = e.target.checked;
    item.flag = checkBool;

    if(item.key=="has_admin") {
      this.isAdminOptSelected = checkBool;
      if(!checkBool) { this.modifyAdminOptPermit(); }
    }
  }
  isAPIinProgress:boolean = false;

  ngOnInit(): void {
    this.getRoles();
  }

  ngOnDestroy(): void {
    this.apiSubscription1.unsubscribe();
    this.apiSubscription2.unsubscribe();
    this.apiSubscription3.unsubscribe();
    this.apiSubscription4.unsubscribe();
  }

  onChangeRole(e:any) {
    const roleId = e.target.value;
    this.isCustomMode = false;
    this.permissions = JSON.parse(JSON.stringify(permissionModel));
    this.modifyAdminOptPermit();

    if(roleId=="") return;
    
    if(roleId==0) {
      this.isCustomMode = true;
      this.isAdminOptSelected = false;
    } else {
      this.userDataObj.roleId = Number(roleId);
      this.userDataObj.permissionId = this.roles.filter(item => item.id == roleId)[0]["permission_id"];
      this.apiSubscription2 = this.apiService.getRolePermissionAPI(this.userDataObj.permissionId).subscribe({
        next: (res:any) => {
          if(!res?.error) {
            const result = res?.result[0];
            this.permissions.map((item:any) => {
              item["flag"] = result[item["key"]];
            });
            if(roleId==1 || roleId==2) { this.isAdminOptSelected = true; }
            else { this.isAdminOptSelected = false; }
          }
        }, error: (err:any) => console.log(err)
      });
    }
  }

  getRoles() {
    this.apiSubscription1 = this.apiService.getAllUserRolesAPI().subscribe({
      next: (res:any) => {
        if(!res.error) {
          this.roles = res.result;
          this.roles.push({id:0, name: "custom"});
        }
      }, error: (err:any) => console.log(err)
    });
  }


  onSubmitAddUser() {
    const {userEmail, userPhone} = this.userDataObj;
    const strLen = (userPhone+'').length;
    this.userDataObj.password = `${userEmail.substring(0,5)}${(userPhone+'').substring(strLen-5, strLen)}`;
    this.isAPIinProgress = true;
    
    if(this.isCustomMode) {
      const permissionObj:any = {};
      const len = this.permissions.length;
      for(let i=0; i<len; i++) {
        const key = (this.permissions[i]["label"]).replace(" ", "");
        permissionObj[key] = this.permissions[i]["flag"];
        if(i==(len-1)) { permissionObj["userEmail"]=userEmail; }
      }
      
      this.apiSubscription3 = this.apiService.addCustomPermission(permissionObj).subscribe({
        next: (res:any) => {
          if(!res.error) {
            const customPermissionId = res.result[0]["id"];
            this.userDataObj.permissionId = customPermissionId;

            if(this.isAdminOptSelected) { this.adminPermissionInit(); } 
            else { this.addNewCrmUser(); }
          }
        }, error: (err:any) => console.log(err)
      });
    } else {
      if(this.isAdminOptSelected) { this.adminPermissionInit(); } 
      else { this.addNewCrmUser(); }
    }
  }


  addNewCrmUser() {
    this.apiSubscription4 = this.apiService.addNewCrmUser(this.userDataObj).subscribe({
      next: (res:any) => {
        this.utility.showToastMsg("success", "SUCCESS", "New user has been added");
        this.isAPIinProgress = false;
        this.userDataObj = { userName: "",userEmail: "",userPhone: "",password: "",roleId: 0,permissionId: 0,adminOptPermission: 0 };
        this.permissions = JSON.parse(JSON.stringify(permissionModel));
        this.isAdminOptSelected = false;
        const dropTag = document.getElementById("roleDropdown") as HTMLSelectElement;
        dropTag.value = "";
      }, error: (err:any) => console.log(err)
    });
  }


  async adminPermissionInit() {
    const adminPermission = await this.modifyAdminOptPermit(false);
    this.apiService.addAdminOptPermission(adminPermission).subscribe({
      next: (res:any) => {
        const adminPermissionId = res.result[0]["id"];
        this.userDataObj.adminOptPermission = adminPermissionId;
        this.addNewCrmUser();
      }, error: (err:any) => console.log(err)
    });
  }


  modifyAdminOptPermit(isForModify=true):void|any {
    if(isForModify) {
      this.adminPermissions = JSON.parse(JSON.stringify(adminPermissionModel));
    } else {
      return new Promise((resolve, reject) => {
        const permissionObj:any = {};
        for(let i=0; i<this.adminPermissions.length; i++) {
          const permission = this.adminPermissions[i];
          permissionObj[permission.key] = permission.flag;
        }

        resolve(permissionObj);
      });
    }
  }
}
