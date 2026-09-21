import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {MessagesService} from "../messages/messages.service";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'login',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  routerService = inject(Router);
  authService = inject(AuthService);
  messagesService = inject(MessagesService);
  fb = inject(FormBuilder);

  form = this.fb.group({
    email: [''],
    password: [''],
  })

  protected async onLogin() {
    try {
      const {email, password} = this.form.value;
      if (!email || !password) {
        this.messagesService.showMessage(
          "Enter an email and password",
          "error"
        )
        return;
      }
      await this.authService.login(email, password);
      await this.routerService.navigate(['/home']);
    } catch (err) {
      this.messagesService.showMessage(
        "Login failed, please try again later",
        "error"
      )
      console.log(err);
    }
  }
}
