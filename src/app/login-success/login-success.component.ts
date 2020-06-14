import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service'
import { UserService } from '../user.service';
import{Router} from '@angular/router'
@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.css']
})
export class LoginSuccessComponent implements OnInit {
  token: any ;
  profile:any;
  constructor(public socket: SocketService,
     private UserService: UserService,
     private router:Router) { }

  ngOnInit(): void {

    this.token = JSON.parse(localStorage.getItem('usertoken'));
    if (this.token) {
      this.socectConnection();
      this.getProfile()
    }else{
    this.router.navigate(['/'])
    }

  }

  socectConnection() {
    this.socket.Connectsocket('connect');
    this.socket.newMessageReceived().subscribe(data => {
      console.log(data);

    })
  }

  getProfile() {
    this.UserService.getProfile().subscribe((response: any) => {
      this.profile=response

    })
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/'])

  }

  ngOnDestroy(){
    // prevent memory leak when component destroyed
    this.socket.disconnectsocket()
  }
}