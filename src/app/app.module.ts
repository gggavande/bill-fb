import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { CustomerListingComponent } from './customer/customer-listing/customer-listing.component';
import { HeaderComponent } from './includes/header/header.component';
import { DataTablesModule } from 'angular-datatables';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { GenerateBillComponent } from './bill/generate-bill/generate-bill.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DatePipe } from '@angular/common';
import { ViewBillComponent } from './bill/view-bill/view-bill.component';


@NgModule({
  declarations: [
    AppComponent,
    CustomerListingComponent,
    HeaderComponent,
    HomeComponent,
    GenerateBillComponent,
    ViewBillComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    DataTablesModule,
    ReactiveFormsModule,
    AutocompleteLibModule
  ],
  providers: [FormBuilder,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
