import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from '../../shared/customer'
import { ViewChild} from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {DataTableDirective} from 'angular-datatables';



@Component({
  selector: 'app-customer-listing',
  templateUrl: './customer-listing.component.html',
  styleUrls: ['./customer-listing.component.css']
})
export class CustomerListingComponent implements OnInit,OnDestroy  {

  title = 'billing';
  customers :any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  custForm : any;
  isSubmit : boolean = false;
  closeResult!: string;
  @ViewChild('closeCustModal') closeCustModal: any;
  delStatus: boolean = false;
  delAlertContent: string = 'Deleted';
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: any = DataTableDirective;
  isDtInitialized:boolean = false


  constructor( private customerService : CustomerService, private formBuilder : FormBuilder, private modalService: NgbModal) {

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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
      id: [''],
      name: ['',[Validators.required,Validators.min(4)]],
      mobile : ['',[Validators.required,Validators.min(10),Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email : ['',[Validators.required,Validators.email]],
      gst_no : ['',[Validators.required,Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}"+ "[A-Z]{1}[1-9A-Z]{1}"+ "Z[0-9A-Z]{1}$")]],
      address: ['',Validators.required],
      status: ['1']
    });
  }

  getcustData(){
    this.customerService.getAll().subscribe((res : any)=>{
      console.log(res);
      this.customers = res;

      if (this.isDtInitialized) {
        console.log('111111111');
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next(this.dtOptions);
        });
      } else {
        console.log('22222222');
        this.isDtInitialized = true
        this.dtTrigger.next(this.dtOptions);
      }
      // this.dtTrigger.next(this.dtOptions);
      // this.rerender();
    });
  }

  onSubmit(): void {
    this.isSubmit = true;
    var dataNew : Customer;
    dataNew = this.custForm.value;
      // window.location.reload()
    console.log(dataNew)
    if(this.custForm.value.id != ''){
      this.customerService.update(dataNew).then(res => {
        console.log(res);
        this.delStatus = true;
        this.delAlertContent = 'Updated';
        this.custForm.reset();
        this.isSubmit = false;
        this.closeCustModal.nativeElement.click();
      }).catch(err => {
        console.log(err);
      })
    }else{
      this.customerService.create(dataNew).then((res : any) => {
        console.log(res);
        this.delStatus = true;
        this.delAlertContent = 'Added';
        this.custForm.reset();
        this.isSubmit = false;
        this.closeCustModal.nativeElement.click();
      })
    }

  }

  editEle(id : any){
    console.log(id);
    this.customerService.get(id).subscribe(res => {
      this.custForm.patchValue({id: res['id']});
      this.custForm.patchValue({name: res['name']});
      this.custForm.patchValue({mobile : res['mobile']});
      this.custForm.patchValue({email : res['email']});
      this.custForm.patchValue({gst_no : res['gst_no']});
      this.custForm.patchValue({address: res['address']});
      this.custForm.patchValue({status: res['status']});
      console.log(res);
    });
  }

  deleteEle(id : any){
    console.log(id);
    this.customerService.delete(id).then(res =>{
      this.delStatus = true;
      this.delAlertContent = 'Deleted';
      // this.getcustData();
    })
    .catch(err => {
      console.log(err);
    })
  }

  resetDel(){
    this.delStatus = false;
  }

  openConfirm(content : any, videoId :any ) {
    console.log("del clicked");
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteEle(videoId);
      }
    }, (reason) => {
      console.log(reason);
    });
  }

}
