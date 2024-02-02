import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { All_BranchesComponent } from './all_Branches/all_Branches.component';
import { Best_roadComponent } from './best_road/best_road.component';
import { DashboardComponent } from './Dashboard/Dashboard.component';
import { Service_areaComponent } from './service_area/service_area.component';

const routes: Routes = [
  { path: '', component: All_BranchesComponent },
  { path: 'best_road', component: Best_roadComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'service', component: Service_areaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
