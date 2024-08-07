import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  constructor(
    private router: Router,
    private utility: UtilitiesService
  ) {}

  lastSideOption:any;

  sideOptions:any[] = [
    {id: "home", optionName: "dashboard", isDisable: this.shouldDisable("has_dashboard"), children: []},
    {id: "admin", optionName: "admin", isDisable: this.shouldDisable("has_admin"), children: []},
    {id: "lead", optionName: "lead", isDisable: this.shouldDisable("has_lead"), children: [
      {id: "open", optionName: "Today Followup", isDisable: false},
      {id: "follow-up", optionName: "Next Followup", isDisable: false},
      {id: "reject", optionName: "reject", isDisable: false},
      {id: "close", optionName: "close", isDisable: false},
      {id: "status", optionName: "lead status", isDisable: false}
    ]},
    {id: "demo", optionName: "demo", isDisable: this.shouldDisable("has_demo"), children: []},
    {id: "price", optionName: "pricing", isDisable: this.shouldDisable("has_pricing"), children: []},
    {id: "invoice", optionName: "invoice", isDisable: this.shouldDisable("has_invoice"), children: [
      {id: "invoice", optionName: "proforma", isDisable: false},
      {id: "tax", optionName: "tax", isDisable: false}
    ]}, 
    {id: "chat", optionName: "group chat", isDisable: true, children: []}//this.shouldDisable("has_chat")
  ];

  ngOnInit(): void {
    
  }

  onClickSideOption(event:any, sideOption:any) {
    if(sideOption?.isDisable) return;

    if(event.target.classList.contains("parent")) {
      const parentTag = event.target as HTMLDivElement;
      if(parentTag.nextElementSibling) {
        this.lastSideOption = parentTag.nextElementSibling;
        this.lastSideOption.classList.toggle("active");
      } else {
        if(this.lastSideOption) this.lastSideOption.classList.remove("active");
      }

      if(!parentTag.nextElementSibling) {
        const isOtherPath = ["admin", "chat", "home"].includes(sideOption?.id);
        if(!isOtherPath) this.router.navigate(["lead", sideOption?.id]);
        else this.router.navigate([sideOption?.id]);
      }
    }
  }

  shouldDisable(key:string):boolean {
    return !this.utility.fetchUserSingleDetail(key);
  }
}
