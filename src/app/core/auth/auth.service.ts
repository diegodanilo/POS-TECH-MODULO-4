import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly userSubject = new BehaviorSubject<User | null>(null);

  readonly user$: Observable<User | null> = this.userSubject.asObservable();

  readonly isAuthenticated$: Observable<boolean> = this.user$.pipe(
    map(user => !!user),
    distinctUntilChanged()
  );


  readonly userName$: Observable<string | null> = this.user$.pipe(
    map(user => user?.displayName ?? user?.email ?? null),
    distinctUntilChanged()
  );

  constructor(
    private auth: Auth,
    private router: Router
  ) {
  
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log('AuthService :: login - sucesso');
    } catch (error) {
      console.error('AuthService :: login - erro', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
    console.log('AuthService :: logout - sucesso');
  }

  async signUp(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/login']);
      console.log('AuthService :: signUp - sucesso');
    } catch (error) {
      console.error('AuthService :: signUp - erro', error);
      throw error;
    }
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  get currentUid(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }
}
