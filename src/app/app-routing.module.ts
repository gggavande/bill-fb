import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListingComponent } from './customer/customer-listing/customer-listing.component';

const routes: Routes = [
  { path: 'customers', component: CustomerListingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
