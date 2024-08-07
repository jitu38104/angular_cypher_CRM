import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ApiMsgRes, NewCompanyDetails, UpdateCompanyRequestType } from '../common/dataType.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  loginApi(body:any) {
    return this.http.post(`${environment.apiurl}/user/login`, body);
  }

  logoutAPI(body:any) {
    return this.http.post(`${environment.apiurl}/user/logout`, body);
  }

  getAllUsersAPI(id:number|string) {
    return this.http.get(`${environment.apiurl}/user/getAllUsers`);//?id=${id}
  }

  getInvoiceNumAPI() {
    return this.http.get(`${environment.apiurl}/user/getInvoiceNum`);
  }

  updateInvoiceNumAPI(colName:string) {
    return this.http.get(`${environment.apiurl}/user/updateInvoiceNum?column=${colName}`);
  }

  resetInvoiceNumAPI() {
    return this.http.get(`${environment.apiurl}/user/resetInvoiceNumber`);
  }

  otpWiseLoginAPI(otp:number) {
    return this.http.get(`${environment.apiurl}/user/sendOtpPass?otp=${otp}`);
  }

  addNewCrmUser(body:any) {
    return this.http.post(`${environment.apiurl}/user/addNewCrmUser`, body);
  }

  addCustomPermission(body:any) {
    return this.http.post(`${environment.apiurl}/user/addCustomPermission`, body);
  }

  addAdminOptPermission(body:any) {    
    return this.http.post(`${environment.apiurl}/user/addAdminOptionPermission`, body);
  }
  //****************************** APIs for Leads ******************************//
  getAllOpenLeadsAPI(id:number|string) {
    return this.http.get(`${environment.apiurl}/lead/getOpenLeads?userId=${id}`);
  }

  addSingleOpenLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/addSingleLead`, body);
  }

  addMultiOpenLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/addMultipleLeads`, body);
  }

  revertToOpenLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/revertToOpenLeads`, body);
  }

  updateSingleLeadAPI(body:any, leadType:string) {
    return this.http.post(`${environment.apiurl}/lead/updateOpenLead?tablename=${leadType}`, body);
  }

  deleteOpenLeadAPI(leadId:number, userId:number) {
    return this.http.delete(`${environment.apiurl}/lead/deleteOpenLead?leadId=${leadId}&userId=${userId}`);
  }

  getAllRejectLeadsAPI(id:number|string) {
    return this.http.get(`${environment.apiurl}/lead/getRejectLeads?userId=${id}`);
  }

  getAllCloseLeadsAPI(id:number|string) {
    return this.http.get(`${environment.apiurl}/lead/getCloseLeads?userId=${id}`);
  }
  
  getAllFollowupLeadsAPI(id:number|string) {
    return this.http.get(`${environment.apiurl}/lead/getFollowupLeads?userId=${id}`);
  }

  addFollowupLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/addFollowupLead`, body);
  }

  deleteFollowupLeadAPI(body:any) {
    const {id, leadId, userId} = body;
    return this.http.delete(`${environment.apiurl}/lead/deleteFollowupLead?id=${id}&leadId=${leadId}&userId=${userId}`);
  }

  addRejectLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/addRejectLead`, body);
  }

  allDeleteAPIs(leadId:number, userId:number, apiType:string) {
    
    return this.http.delete(`${environment.apiurl}/lead/delete${apiType}Lead?leadId=${leadId}&userId=${userId}`);
  }

  getAllDemoLeadsAPI(id:number|string) {
    return this.http.get(`${environment.apiurl}/lead/getDemoLeads?userId=${id}`);
  }

  addDemoLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/addDemoLead`, body);
  }

  addStatusLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/addStatusLead`, body);
  }

  updateStatusLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/updateStatusLead`, body);
  }

  updateTaxInvoiceLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/updateTaxInvoiceLead`, body);
  }

  getAllStatusLeadsAPI(id:number|string) {
    return this.http.get(`${environment.apiurl}/lead/getStatusLead?userId=${id}`);
  }

  deleteStatusLeadAPI(leadId:number, userId:number) {
    return this.http.delete(`${environment.apiurl}/lead/deleteStatusLead?leadId=${leadId}&userId=${userId}`);
  }

  getAllPriceLeadsAPI(id:number|string) {
    return this.http.get(`${environment.apiurl}/lead/getPriceLeads?userId=${id}`);
  }

  addPriceLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/addPriceLead`, body);
  }

  getAllInvoiceLeadsAPI(id:number|string) {
    return this.http.get(`${environment.apiurl}/lead/getInvoiceLeads?userId=${id}`);
  }

  addInvoiceLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/addInvoiceLead`, body);
  }

  getAllTaxInvoiceLeadsAPI(id:number|string) {
    return this.http.get(`${environment.apiurl}/lead/getTaxInvoiceLeads?userId=${id}`);
  }

  addTaxInvoiceLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/addTaxInvoiceLead`, body);
  }

  updateFollowupLeadAPI(body:any, tableType:string="Followup") {
    return this.http.post(`${environment.apiurl}/lead/updatePartial${tableType}Lead`, body);
  }

  updateLeadRemarkAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/updatePartialAllLead`, body);
  }

  updateDemoLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/updateDemoLead`, body);
  }

  updatePriceLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/updatePriceLead`, body);
  }

  updateOpenLeadUserAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/updateOpenLeadUser`, body);
  }

  getCompaniesListAPI() {
    return this.http.get(`${environment.apiurl}/getAllCompanies`);
  }

  getSingleCompanyDetailAPI(id:any) {
    return this.http.get(`${environment.apiurl}/getSingleCompany?leadId=${id}`);
  }

  getEmailExistanceAPI(email:string) {
    return this.http.get(`${environment.apiurl}/getEmailExistanceResponse?email=${email}`);
  }

  getAllEmailsListAPI() {
    return this.http.get(`${environment.apiurl}/getAllEmailsList`);
  }

  getInvoiceReportsAPI() {
    return this.http.get(`${environment.apiurl}/getInvoiceReports`);    
  }

  getAllUserRolesAPI() {
    return this.http.get(`${environment.apiurl}/getAllUserRoles`);
  }

  getRolePermissionAPI(id:any) {
    return this.http.get(`${environment.apiurl}/getRolePermission?id=${id}`);
  }

  sendInvoiceEmailAPI(apiObj:any) {
    return this.http.post(`${environment.apiurl}/user/sendEmail`, apiObj);
  }

  sendTaxInvoiceEmailAPI(apiObj:any) {
    return this.http.post(`${environment.apiurl}/user/sendTaxInvoiceEmail`, apiObj);
  }

  updateInvoideLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/updateInvoideLead`, body);
  }
  
  updateStatusRemarkAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/updateStatusRemark`, body);
  }

  getUserAttendanceAPI(body:any) {
    return this.http.post(`${environment.apiurl}/user/getUserAttendance`, body);
  }

  addCloseLeadAPI(body:any) {
    return this.http.post(`${environment.apiurl}/lead/addCloseLead`, body);
  }

  getUserAllLeadsAPI() {
    return this.http.get(`${environment.apiurl}/lead/getUserAllLeads`);
  }

  getDatewiseInvoiceLeads(body:any) {
    return this.http.post(`${environment.apiurl}/lead/fetchDatewiseInvoiceLeads`, body);
  }

  getAllScheduleDemoLeads() {
    return this.http.get(`${environment.apiurl}/site/get_schedule_demos`);
  }

  addScheduledDemoLead(body:any) {    
    return this.http.post(`${environment.apiurl}/site/insertScheduleDemoToOpen`, body);
  }

  updateScheduleDemoStatus(body:any) {
    return this.http.post(`${environment.apiurl}/site/updateScheduleDemoStatus`, body);
  }

  getAllRequestedCompanies():Observable<ApiMsgRes> {
    return this.http.get<ApiMsgRes>(`${environment.apiurl}/portal/getRequestedCompanies`);
  }

  updateRequestedCompany(body:UpdateCompanyRequestType):Observable<ApiMsgRes> {
    return this.http.post<ApiMsgRes>(`${environment.apiurl}/portal/updateRequestedCompany`, body);
  }

  addNewCompany(body:NewCompanyDetails):Observable<ApiMsgRes> {
    return this.http.post<ApiMsgRes>(`${environment.apiurl}/portal/addNewCompany`, body);
  }

  updateCompanyDetails(body:NewCompanyDetails):Observable<ApiMsgRes> {
    return this.http.post<ApiMsgRes>(`${environment.apiurl}/portal/updateCompanyInfo`, body);
  }

  getSingleCompanyDetail(id:number):Observable<ApiMsgRes> {
    return this.http.get<ApiMsgRes>(`${environment.apiurl}/portal/getSingleCompany?id=${id}`);
  }
}
