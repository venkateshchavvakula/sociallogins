import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client'

declare var io: {
  connect(url: string): any;
};

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  socket: any;
  observer: any;
  constructor() { }
  Connectsocket(type): Observable<number> {
    Observable.create(observer => {
      this.observer = observer;
    });
    if (type === 'connect') {
      let token = JSON.parse(localStorage.getItem('usertoken'));

      this.socket = socketIo('http://localhost:9000', {
        query: { token: token }
      });
      console.log(this.socket);


    }

    if (type === 'disconnect') {
      this.socket.emit('onDisconnect', '');
    }
    return this.createObservable();
  }

  newMessageReceived() {
    const observable = new Observable<any>(observer => {
      this.socket.on('user:save', (data) => {
        console.log(data);

        observer.next(data);
      });
    });
    return observable;
  }


  disconnectsocket() {
    this.socket.emit('disconnect', '');
  }

  createObservable(): Observable<number> {
    return new Observable<number>(observer => {
      this.observer = observer;
    });
  }
}


