import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SharedComponent } from './pages/shared/shared.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { LeadComponent } from './pages/lead/lead.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PdfTemplateComponent } from './components/pdf-template/pdf-template.component';
import { AttendanceComponent } from './pages/admin/pages/attendance/attendance.component';
import { AddNewSomthingComponent } from './pages/admin/pages/add-new-somthing/add-new-somthing.component';
import { LeadsListComponent } from './pages/admin/pages/leads-list/leads-list.component';
import { ChatComponent } from './pages/chat/chat.component';
import { WebLeadsComponent } from './pages/admin/pages/web-leads/web-leads.component';
import { CompanyInfoComponent } from './pages/admin/pages/company-info/company-info.component';

const routes: Routes = [
  // {path: "pdf", component:PdfTemplateComponent},
  {path: "login", component:LoginComponent},
  {path:"", component:SharedComponent, children: [
    {path: "home", component:HomeComponent},
    {path: "chat", component:ChatComponent},
    {path: "admin", component:AdminComponent, children: [
      {path: "attendance", component:AttendanceComponent},
      {path: "add/:type", component: AddNewSomthingComponent},
      {path: "lead-list", component: LeadsListComponent},
      {path: "web-lead-list", component: WebLeadsComponent},
      {path: "company-info", component: CompanyInfoComponent}
    ]},
    {path: "lead/:stage", component:LeadComponent},
    {path: "lead/invoice/:stage", component:LeadComponent},
    {path: "pdf", component:PdfTemplateComponent},
    {path: "", redirectTo: "home", pathMatch: "full"},
    {path: "**", component: PageNotFoundComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
