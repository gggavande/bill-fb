import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from '../../shared/customer'
import { ViewChild} from '@angular/core';

@Component({
  selector: 'app-customer-listing',
  templateUrl: './customer-listing.component.html',
  styleUrls: ['./customer-listing.component.css']
})
export class CustomerListingComponent implements OnInit {

  title = 'billing';
  customers :any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  custForm : any;
  isSubmit : boolean = false;
  @ViewChild('closeCustModal') closeCustModal: any;

  constructor( private customerService : CustomerService, private formBuilder : FormBuilder) {

  }

  ngOnInit(): void {
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        'print',
        'excel',
      ],
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true
    };
    this.getcustData();

    this.custForm = this.formBuilder.group({
      customerId: [''],
      name: ['',[Validators.required,Validators.min(4)]],
      mobile :['',[Validators.required,Validators.min(10),Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email :['',[Validators.required,Validators.email]],
      gst_no :['',[Validators.required,Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}"+ "[A-Z]{1}[1-9A-Z]{1}"+ "Z[0-9A-Z]{1}$")]],
      address: ['',Validators.required],
      status: ['1']
    });
  }

  getcustData(){
    this.customerService.getAll().subscribe((res : any)=>{
      this.customers = res;
      this.dtTrigger.next(this.dtOptions);
      // this.rerender();
    });
  }

  onSubmit(): void {
    this.isSubmit = true;
    var dataNew : Customer;
    dataNew = this.custForm.value;

    this.customerService.create(dataNew).then((res : any) => {
      console.log(res);
      this.custForm.reset();
      this.isSubmit = false;
      this.closeCustModal.nativeElement.click();
      // this.getcustData();
      // this.rerender();
      window.location.reload()
    })
    // console.log(dataNew);
  }

  editEle(id : any){
    console.log(id);
  }

  deleteEle(id : any){
    console.log(id);
  }

}
