import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { All_BranchesComponent } from './all_Branches/all_Branches.component';
import { Best_roadComponent } from './best_road/best_road.component';
import { Service_areaComponent } from './service_area/service_area.component';
import { DashboardComponent } from './Dashboard/Dashboard.component';
import { HeaderComponent } from './header/header.component';
import { MatrialModule } from './matrial/matrial.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatSidenavModule } from '@angular/material/sidenav';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
@NgModule({
  declarations: [
    AppComponent,
    All_BranchesComponent,
    Best_roadComponent,
    Service_areaComponent,
    DashboardComponent,
    HeaderComponent,
  ],
  imports: [
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    MatrialModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
