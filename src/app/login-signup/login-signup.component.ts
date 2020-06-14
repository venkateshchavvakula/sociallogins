import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent implements OnInit {
  loginForm: FormGroup; // login Form Group 
  signUpForm: FormGroup; // Signup Form Group
  showForm: any = 'login'; // show or hide login form

  constructor(private formBuilder: FormBuilder,
    private userServices: UserService,
    private router: Router) { }

  ngOnInit(): void {
    // initialize Login Form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('([A-Za-z]|[0-9])[A-Za-z0-9.-]+[A-Za-z0-9]@((?:[-a-z0-9]+\.)+[a-z]{2,})')]],
      password: ['', [Validators.required, Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ !"#$%&()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,14}/)]],
      Remember: ['']
    });

    // initialize Signup Form
    this.signUpForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z\s]{1,65}$')]],
      email: ['', [Validators.required, Validators.pattern('([A-Za-z]|[0-9])[A-Za-z0-9.-]+[A-Za-z0-9]@((?:[-a-z0-9]+\.)+[a-z]{2,})')]],
      password: ['', [Validators.required, Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ !"#$%&()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,14}/)]],
    });


  }

  showSelectedForm(formname) {
    this.showForm = formname
  }


  login(loginForm) {
    if (loginForm.valid) {
      this.userServices.loginAuthentication(loginForm.value).subscribe((response: any) => {
        if (response.token) {
          localStorage.setItem('usertoken', JSON.stringify(response.token))
          this.router.navigate(['/home'])
        }

      })
    }

  }
  signup(signUpForm) {
    if (signUpForm.valid) {
      this.userServices.createUser(signUpForm.value).subscribe((response: any) => {
        if (response.token) {
          localStorage.setItem('usertoken', JSON.stringify(response.token))
          this.router.navigate(['/home'])
        }
      })
    }

  }

}
