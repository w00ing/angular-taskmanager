import { Component, OnInit } from '@angular/core';
import { Auth, User, authState, signOut } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  // public authState: Observable<User | null>;
  // public signOut: Promise<void>;
  public afAuthState: Observable<User | null>;

  constructor(public afAuth: Auth) {
    this.afAuthState = authState(this.afAuth);
  }

  async afSignOut(): Promise<any> {
    return signOut(this.afAuth);
  }

  ngOnInit(): void {}
}
