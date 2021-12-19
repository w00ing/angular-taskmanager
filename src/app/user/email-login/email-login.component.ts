import { Component, OnInit } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

type ActionType = 'login' | 'signup' | 'reset';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
})
export class EmailLoginComponent implements OnInit {
  form: FormGroup;

  type: ActionType = 'signup';
  loading = false;

  serverMessage: string;

  constructor(private afAuth: Auth, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.required]],
      passwordConfirm: ['', []],
    });
  }

  changeType(val: ActionType) {
    this.type = val;
  }

  get isLogin() {
    return this.type === 'login';
  }

  get isSignup() {
    return this.type === 'signup';
  }

  get isPasswordReset() {
    return this.type === 'reset';
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  get passwordDoesMatch() {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password?.value === this.passwordConfirm?.value;
    }
  }

  async onSubmit() {
    this.loading = true;

    const email = this.email?.value;
    const password = this.password?.value;

    try {
      if (this.isLogin) {
        await signInWithEmailAndPassword(this.afAuth, email, password);
      }
      if (this.isSignup) {
        await createUserWithEmailAndPassword(this.afAuth, email, password);
      }
      if (this.isPasswordReset) {
        await sendPasswordResetEmail(this.afAuth, email);
        this.serverMessage = 'Check your email';
      }
    } catch (err) {
      this.serverMessage = err as string;
    }

    this.loading = false;
  }
}
