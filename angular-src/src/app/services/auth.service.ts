import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import  { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
 
})
export class AuthService {
  authToken: any;
  user: any;
  user_id:any;

  constructor(private http:Http, private jwtHelper: JwtHelperService) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/register', user,{headers:headers})
    .pipe(map(res => res.json()));
  }

  // updateUser(user){
  //   let headers = new Headers({ 'Content-Type':'application/json' });
  //   let options = new RequestOptions({headers:headers});
  //   return this.http.put('http://localhost:3000/users/user/5c1d533a2494ee1e7d3420b2'+ user, options)
  //   .pipe(map(res => res.json()));

  // }

  updateUser(user){
    const u_id = localStorage.getItem('user_id');
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.put('http://localhost:3000/users/user/'+ u_id, user,{headers:headers})
    .pipe(map(res => res.json()));
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/authenticate', user,{headers:headers})
    .pipe(map(res => res.json()));
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/users/profile',{headers:headers})
    .pipe(map(res => res.json()));
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('user_id',user.id)

    this.authToken = token;
    this.user = user;
    this.user_id = user.id;
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(){
    return this.jwtHelper.isTokenExpired();
  }
  
  //Logout 
  logout(){
    this.authToken = null;
    this.user = null;
    this.user_id = null;
    localStorage.clear();

  }
}
