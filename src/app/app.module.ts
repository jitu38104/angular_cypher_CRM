import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SharedComponent } from './pages/shared/shared.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { LeadComponent } from './pages/lead/lead.component';
import { LeadbarComponent } from './components/leadbar/leadbar.component';
import { LeadEditComponent } from './modals/lead-edit/lead-edit.component';
import { LeadAddComponent } from './modals/lead-add/lead-add.component';

// ============================primeng moduels============================
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { EllipsisPipe } from './common/ellipsis.pipe';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { LeadFileComponent } from './modals/lead-file/lead-file.component';
import { LeadInvoiceComponent } from './modals/lead-invoice/lead-invoice.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { MousemoveDirective } from './common/mousemove.directive';
import { PdfTemplateComponent } from './components/pdf-template/pdf-template.component';
import { AttendanceComponent } from './pages/admin/pages/attendance/attendance.component';
import { AddNewSomthingComponent } from './pages/admin/pages/add-new-somthing/add-new-somthing.component';
import { LeadsListComponent } from './pages/admin/pages/leads-list/leads-list.component';
import { ChatComponent } from './pages/chat/chat.component';
import { WebLeadsComponent } from './pages/admin/pages/web-leads/web-leads.component';
import { CompanyInfoComponent } from './pages/admin/pages/company-info/company-info.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SharedComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    AdminComponent,
    LeadComponent,
    LeadbarComponent,
    LeadEditComponent,
    LeadAddComponent,
    LeadFileComponent,
    LeadInvoiceComponent,
    PageNotFoundComponent,
    MousemoveDirective,
    PdfTemplateComponent,
    AttendanceComponent,
    AddNewSomthingComponent,
    LeadsListComponent,
    ChatComponent,
    WebLeadsComponent,
    CompanyInfoComponent,
  ],
  imports: [
    NgbModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,

    InputTextareaModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    TooltipModule,
    DialogModule,
    ToastModule,
    RadioButtonModule,
    CheckboxModule,
    ContextMenuModule,
    PaginatorModule
  ],
  providers: [NgbActiveModal, DatePipe, TitleCasePipe, EllipsisPipe, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
