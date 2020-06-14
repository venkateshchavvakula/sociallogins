
export class FrontEndConfig {
    constructor() { }
    serverurl = "http://localhost:9000"
  
    frontendurl = "http://localhost:4200"
    getServerUrl() {
      return this.serverurl;
    }
    getFrontEndUrl(){
      return this.frontendurl;
  
    }
  
  }