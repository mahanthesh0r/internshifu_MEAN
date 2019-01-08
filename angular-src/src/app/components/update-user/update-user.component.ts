import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  dob:String;
  phone:Number;
  graduation:String;
  college:String;
  profession:String;
  website:String;
  github:String;
  otherlinks:String;
  prolanguage:String;
  framework:String;
  otherskills:String;


  constructor(private flashMessage: FlashMessagesService,private authService: AuthService) { }

  ngOnInit() {
  }

  onUpdate(){
    const user = {
      dob: this.dob,
      phone: this.phone,
      graduation: this.graduation,
      college: this.college,
      profession: this.profession,
      website: this.website,
      github: this.github,
      otherlinks: this.otherlinks,
      prolanguage: this.prolanguage,
      framework: this.framework,
      otherskills: this.otherskills
    }
    //update user
    this.authService.updateUser(user).subscribe(data => {
      if(data.success){
        this.flashMessage.show('Updated Successfully', {cssClass: 'alert-success', timeout:2000});
      }else{
        this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 2000});
      }
    });
  }

}
