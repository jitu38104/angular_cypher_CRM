import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventsService } from 'src/app/services/events.service';
import { SocketIoService } from 'src/app/services/socket-io.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit{
  msgArr:any[] = [];
  sendMsg:string = "";
  allUsers:any[] = [];
  currentUser:any = {isEmpty:true};

  constructor(
    private socketService: SocketIoService,
    private eventService: EventsService,
    private apiService: ApiService,
    private utility: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.socketService.getMessage().subscribe({
      next: (res:any) => {
        const {socketId, userId, userName, message, time} = res;
        const userid = this.utility.fetchUserSingleDetail("id")
        if(userid != userId) {
          const msgDataPackage = { msgId: socketId, message, userName, time, direction: "left" };
          this.msgArr.push(msgDataPackage);
        }
      }, error: (err:any) => console.log("Chat Error:", err)
    });

    this.eventService.allUserDataEmit.subscribe({
      next: (res:any) => {
        this.allUsers = res;
      }, error: (err:any) => console.log(err)
    });
    this.getAllUserList(); //start fetching all users
  }

  sendMessage() {
    // const msgDataPackage = {
    //   msgId: this.socketService.getSocketId(),
    //   message: this.sendMsg,
    //   userName: "",
    //   time: new Date(),
    //   direction: "right"
    // };
    // this.msgArr.push(msgDataPackage);
    
    this.socketService.sendMessage(this.sendMsg);
  }
  onClickEnter(e:any) {
    if(e.key=="Enter") {
      this.sendMessage();
      this.sendMsg = "";
    }
  }


  getAllUserList() {
    if(this.allUsers.length>0) return;

    const userId = this.utility.fetchUserDetails()["id"];
    this.apiService.getAllUsersAPI(userId).subscribe({
      next: (res: any) => {
        if (!res.error) {
          (res?.result).map((item: any) => { if (item.id == userId) item.name = "self"; });
          const usersList = res?.result;
          usersList.sort((a:any, b:any) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
          this.eventService.allUserDataEmit.next(usersList);
        }
      }, error: (err: any) => { console.log(err); }
    });
  }

  
  onClickSideUser(user:any) {
    console.log(user?.id);
    this.currentUser = user;
    this.currentUser["isEmpty"] = false; 
  }
}
