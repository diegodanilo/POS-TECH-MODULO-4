import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, ContentWrapperComponent } from './app.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NZ_I18N, pt_BR } from 'ng-zorro-antd/i18n';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { WelcomeCardComponent } from './presentation/components/welcome-card/welcome-card.component';
import { HomePageComponent } from './presentation/components/home/home-page.component';
import { ExtratoComponent } from './presentation/components/extrato/extrato.component';
import { NewTransactionCardComponent } from './presentation/components/new-transaction-card/new-transaction-card.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AngularFireModule } from '@angular/fire/compat'; 
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; 
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; 
import { environment } from '../../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { DashboardComponent } from './presentation/components/dashboard/dashboard.component';
import { LoginComponent } from './presentation/pages/login/login.component';
import { SignupComponent } from './presentation/pages/signup/signup.component';
import { ForgotPasswordComponent } from './presentation/pages/forgot-password/forgot-password.component';
import { LateralMenuComponent } from './presentation/components/lateral-menu/lateral-menu.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterModule } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { TopNavbarComponent } from './presentation/components/top-navbar/top-navbar.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NavbarComponent } from './presentation/components/navbar/navbar.component';
import { HomePageModule } from './presentation/components/home/home-page.module';


registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    WelcomeCardComponent,
    LoginComponent,
    SignupComponent,
    LateralMenuComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    TopNavbarComponent,
    NavbarComponent,
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NzButtonModule,
    ExtratoComponent,
    FormsModule,
    NzIconModule,
    HttpClientModule,
    HomePageModule,
    BrowserAnimationsModule,
    NewTransactionCardComponent,
    NzLayoutModule,
    ReactiveFormsModule,
    CommonModule,
    NzMenuModule,
    RouterModule,
    NzAvatarModule,
    NzToolTipModule,
    ContentWrapperComponent,
    NzCardModule,
    NzDividerModule,
    AngularFireModule.initializeApp(environment.firebase), 
    AngularFireAuthModule, 
    AngularFirestoreModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),


  ],
  providers: [
    { provide: NZ_I18N, useValue: pt_BR },
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
