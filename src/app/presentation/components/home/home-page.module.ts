import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { HomePageRoutingModule } from './home-page-routing.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    NzLayoutModule,
    HomePageRoutingModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
  ]
})
export class HomePageModule { }
