import { RouterModule, Routes } from '@angular/router';
import { NewTikcetComponent } from './new-tikcet/new-tikcet.component';
import { NgModule } from '@angular/core';
import { TicketInfoComponent } from './ticket-info/ticket-info.component';

export const routes: Routes = [{
    path:'',
    redirectTo:'newTicket',
    pathMatch:'full'
  },
  {
    path:'newTicket',
    component: NewTikcetComponent
  },
  {
    path:'ticket',
    component: TicketInfoComponent
  }];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }