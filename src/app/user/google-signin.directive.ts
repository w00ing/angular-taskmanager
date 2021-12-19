import { Directive, HostListener } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Directive({
  selector: '[appGoogleSignin]',
})
export class GoogleSigninDirective {
  constructor(private afAuth: Auth) {}

  @HostListener('click')
  onclick() {
    signInWithPopup(this.afAuth, new GoogleAuthProvider());
  }
}
