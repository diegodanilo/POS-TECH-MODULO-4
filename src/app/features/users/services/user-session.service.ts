import { Injectable } from '@angular/core';
import { switchMap, of, Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { IUser } from 'src/app/domain/model/user-interface';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class UserSessionService {

  userProfile$: Observable<IUser | null>;

  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {
    this.userProfile$ = this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return of(null);
        return this.usersService.getUserByUid$(user.user.uid);
      })
    );
  }
}
