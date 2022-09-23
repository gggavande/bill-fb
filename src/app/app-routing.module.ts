import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillListingComponent } from './bill/bill-listing/bill-listing.component';
import { EditBillComponent } from './bill/edit-bill/edit-bill.component';
import { GenerateBillComponent } from './bill/generate-bill/generate-bill.component';
import { ViewBillComponent } from './bill/view-bill/view-bill.component';
import { CustomerListingComponent } from './customer/customer-listing/customer-listing.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'customers', component: CustomerListingComponent },
  { path: 'bill', component: GenerateBillComponent },
  { path: 'view-bill/:billId', component: ViewBillComponent },
  { path: 'view-bills/:custId', component: BillListingComponent },
  { path: 'edit-bill/:billId', component: EditBillComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
