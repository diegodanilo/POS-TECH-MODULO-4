import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, signOut, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Firestore } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<UserCredential | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userSubjectName = new BehaviorSubject<string | null>(null);


  user$ = this.userSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  userName$ = this.userSubject.asObservable();


  constructor(private auth: Auth, private router: Router) {
    auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        const name = user.displayName ?? user.email ?? null;
        this.userSubjectName.next(name);
        console.log('nome', name);
        this.isAuthenticatedSubject.next(true);
      } else {
        this.userSubjectName.next(null);
        this.isAuthenticatedSubject.next(false);
      }
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.userSubject.next(userCredential);
      this.isAuthenticatedSubject.next(true);
      console.log('AuthService :: login - usuário logado com sucesso');
      return true;
    } catch (error) {
      this.router.navigate(['/errorPage']);
      console.error('AuthService :: login - falha ao logar usuário', error);
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    console.log('AuthService :: logout - usuário deslogado com sucesso');
    this.router.navigate(['/login']);
  }

  async signUp(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/login']);
      console.log('AuthService :: signUp - usuário cadastrado com sucesso');
    } catch (err) {
      this.router.navigate(['/errorPage']);
      console.error('AuthService :: signUp - falha', err);
    }
  }

  /** 🔹 Pega o UID do usuário logado */
  getCurrentUid(): string | null {
    return this.userSubject.value?.user?.uid ?? null;
  }

  /** 🔹 Pega o email do usuário logado */
  getCurrentEmail(): string | null {
    return this.userSubject.value?.user?.email ?? null;
  }
}