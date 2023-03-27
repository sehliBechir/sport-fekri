import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from './../../services/user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  msgError:String;

  constructor(
    private router:Router,
    private formBuilder:FormBuilder, private userService:UserService) { }

  ngOnInit() {
    this.loginForm=this.formBuilder.group({
      
      email:["", [ Validators.required , Validators.email] ],
      password:["", [Validators.required]],
    })
  }

  login(){
    // user : {email:....., pwd:.....}
    let user= this.loginForm.value;
    this.userService.login(user);
  //   console.log("here object",user);
  //   this.userService.login(user).subscribe(

  // (response)=>{
  //   console.log("Response after login", response);
  //   if (response.message=="2") {
  //     localStorage.setItem("connectedUserID", response.user.id);
  //     if (response.user.role=="admin") {
  //       this.router.navigate(["admin"]);

  //     } else {
  //       this.router.navigate([""]);

  //     }
  //   } else {
  //     this.msgError="Please check your email/PWD"
      
  //   }
    
  // }
  //   );
      
    }
  }


