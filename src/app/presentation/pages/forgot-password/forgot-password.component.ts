import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private auth: Auth) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const { email } = this.form.value;

    try {
      await sendPasswordResetEmail(this.auth, email);
      this.successMessage = 'Um link de redefinição foi enviado para seu e-mail.';
    } catch (err: any) {
      switch (err.code) {
        case 'auth/user-not-found':
          this.errorMessage = 'Não existe conta com este e-mail.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'E-mail inválido.';
          break;
        default:
          this.errorMessage = 'Erro ao enviar link. Tente novamente.';
      }
    } finally {
      this.loading = false;
    }
  }
}