import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { FrontEndConfig } from "./frontendConfig"
@Injectable({
  providedIn: 'root'
})
export class UserService {

  serverurl = this.frontEndConfig.getServerUrl();

  constructor(private http:HttpClient,private frontEndConfig:FrontEndConfig) { 
  }

  // create New User
  createUser(userdata){
    return this.http.post(this.serverurl+'/api/users',userdata)
  }

// login with user credentials
  loginAuthentication(user){
    return this.http.post(this.serverurl + '/auth/local', user)
  }
  // get user Profile when Login
  getProfile(){
    return this.http.get(this.serverurl + '/api/users/me')

  }
}
