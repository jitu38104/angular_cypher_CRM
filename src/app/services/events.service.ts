import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor() { }

  onCompleteInsertion:Subject<any> = new Subject<any>();
  passExistingEmails:Subject<any[]> = new BehaviorSubject<any[]>([]);
  onPassPrintCommand:Subject<boolean> = new BehaviorSubject<boolean>(false);
  userLoginEvent:Subject<boolean> = new Subject<boolean>();
  passPdfData:Subject<any> = new BehaviorSubject<any>({});
  excelExistLeadEmit:Subject<any> = new BehaviorSubject<any>({});
  allUserDataEmit:Subject<any> = new BehaviorSubject<any>([]);
  passDataToHome:Subject<any> = new Subject<any>();
  passDatesToInoviceLeads:Subject<any> = new Subject<any>();
}
