import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  setDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IUser } from '../../../domain/model/user-interface';
import { Auth, authState, User } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly usersCollection;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, 'users');
  }

  /** 🔹 Stream em tempo real (onSnapshot → Observable) */
  getUsers$(): Observable<IUser[]> {
    return collectionData(this.usersCollection, {
      idField: 'id'
    }) as Observable<IUser[]>;
  }

  getLoggedUser$(): Observable<User | null> {
    return authState(this.auth);
  }
  
  getUserName(): string | null {
  const user = this.auth.currentUser;
  return user?.displayName ?? null;
}


  // Pega o usuário atual (snapshot)
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Logout
  async logout(): Promise<void> {
    await this.auth.signOut();
  }

  /** 🔹 Busca usuário por ID */
  getUserByUid$(uid: string): Observable<IUser> {
    const ref = doc(this.firestore, `users/${uid}`);
    return docData(ref, { idField: 'id' }) as Observable<IUser>;
  }

  /** 🔹 Cria ou sobrescreve usuário */
  createUser(id: string, data: IUser): Promise<void> {
    const ref = doc(this.firestore, `users/${id}`);
    return setDoc(ref, {
      ...data,
      createdAt: new Date()
    });
  }

  /** 🔹 Atualiza usuário */
  updateUser(id: string, data: Partial<IUser>): Promise<void> {
    const ref = doc(this.firestore, `users/${id}`);
    return updateDoc(ref, data);
  }

  /** 🔹 Remove usuário */
  deleteUser(id: string): Promise<void> {
    const ref = doc(this.firestore, `users/${id}`);
    return deleteDoc(ref);
  }
}
