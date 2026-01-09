import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  form: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = null;

    const { name, email, password } = this.form.value;

    try {
      // Cria usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      // Atualiza o perfil com o nome
      await updateProfile(userCredential.user, { displayName: name });

      // Persiste dados adicionais no Firestore
      await setDoc(doc(this.firestore, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        createdAt: new Date()
      });

      this.router.navigate(['/home-page']);
    } catch (err: any) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          this.errorMessage = 'Este e-mail já está em uso.';
          break;
        case 'auth/weak-password':
          this.errorMessage = 'A senha precisa ter pelo menos 6 caracteres.';
          break;
        default:
          this.errorMessage = 'Erro ao criar conta. Tente novamente.';
      }
    } finally {
      this.loading = false;
    }
  }
}