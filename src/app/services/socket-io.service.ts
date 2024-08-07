import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment.prod';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  // private socket:Socket;
  baseUrl = environment.apiurl.replace("/api", "");

  constructor(
    private utility: UtilitiesService
  ) {
    // this.socket = io(this.baseUrl); 
  }

  // getSocketId = ():string|undefined => this.socket.id;

  // initializeStoreIdentity() {
  //   console.log("called1")
  //   const {id, name} = this.utility.fetchUserDetails();
  //   const socketId = this.getSocketId();
  //   const dataObj = { socketId, userDetail: {id, name} };
  //   this.socket.emit("store-Ids", dataObj);
  // }

  sendMessage(message: string): void {
    const {id, name} = this.utility.fetchUserDetails();
    // const socketId = this.socket.id;
    const msgObj = { 
      // socketId, message,
      userId: id,
      userName: name,
      time: new Date()
    };
    // this.socket.emit("single-user-msg", msgObj);
  }

  getMessage(): Observable<any> {
    return new Observable<any>((observer) => {
      // this.socket.on("single-user-msg", (data: any) => {
      //   observer.next(data);
      // });
    });
  }

  // setAllUsersSocketIds() {
  //   console.log("called2");
  //   this.socket.on("store-Ids", (data) => {
  //     console.log("Socket Initialized");
  //     localStorage.setItem("socket_data", JSON.stringify(data));
  //   });
  // }
}
