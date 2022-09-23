import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BillService } from 'src/app/services/bill.service';
import { BillitemService } from 'src/app/services/billitem.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Bill } from 'src/app/shared/bill';
import { Billitem } from 'src/app/shared/billItem';
import { Customer } from 'src/app/shared/customer';

@Component({
  selector: 'app-generate-bill',
  templateUrl: './generate-bill.component.html',
  styleUrls: ['./generate-bill.component.css']
})
export class GenerateBillComponent implements OnInit {

  itemNo : number = 1;
  billForm: any;
  customerList : any;
  data: any;
  keyword = 'name';
  myDate : any;
  isSubmit : boolean = false;

  // aa :any = encodeURIComponent('dvdxcvc');


  constructor(private datePipe: DatePipe, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private customerService : CustomerService, private billService : BillService, private billItemService : BillitemService) { }

  ngOnInit(): void {
    this.myDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.billForm = this.fb.group({
      custName: ['',[Validators.required,Validators.min(4)]],
      noOfItem: ['1'],
      gst: ['1',Validators.required],
      isPaid: ['0',Validators.required],
      amountReceived: ['0'],
      item1: ['',Validators.required],
      item1Rate: ['',Validators.required],
      item1Unit: ['',Validators.required],
      item1Price: [{value:''},Validators.required],
      item1Date: [this.myDate,Validators.required],
      custGst : [''],
      custCity : [''],
      custMob : [''],
      custEmail : [''],
      engineersName : [''],
      siteLocation : [''],
      siteName : [''],
      date: [this.myDate,Validators.required]

    });

    this.customerService.getAll().subscribe(res => {
      console.log(res);
      this.data = res;
    })
  }

  addEle(){
    this.itemNo++;
    this.billForm.addControl("item"+this.itemNo,this.fb.control('',Validators.required));
    this.billForm.addControl("item"+this.itemNo+"Rate",this.fb.control('',Validators.required));
    this.billForm.addControl("item"+this.itemNo+"Unit",this.fb.control('',Validators.required));
    this.billForm.addControl("item"+this.itemNo+"Price",this.fb.control('',Validators.required));
    this.billForm.addControl("item"+this.itemNo+"Date",this.fb.control(this.myDate));
    this.billForm.patchValue({noOfItem: this.itemNo});
  }

  removeEle(){
    this.billForm.removeControl("item"+this.itemNo);
    this.billForm.removeControl("item"+this.itemNo+"Rate");
    this.billForm.removeControl("item"+this.itemNo+"Unit");
    this.billForm.removeControl("item"+this.itemNo+"Price");
    this.billForm.removeControl("item"+this.itemNo+"Date");
    this.itemNo--;
    this.billForm.patchValue({noOfItem: this.itemNo});
  }

  /* onSubmit(form: FormGroup){
    this.isSubmit = true;
    //  console.log(form.value);
     this.generateInsData(form.value);

  } */

  onSubmit(formData : any){
    this.isSubmit = true;
    formData = formData.value;
    console.log(formData);

    let totAmt = 0;
    let gstAmt = 0;
    let billId = '';
    let amtPending = 0;
    let custId :any;

    var getCust = new Promise((resolve, reject) => {
      let custIdt;
      if(typeof formData.custName == 'string'){
        var dataNewCst : Customer;
        dataNewCst = {
          id : "",
          address : formData.custCity,
          email : formData.custEmail,
          gst_no : formData.custGst,
          mobile : formData.custMob,
          name : formData.custName,
          status : "1",
        }

        this.customerService.create(dataNewCst).then((res : any) => {
          custIdt = res.id;
          resolve(custIdt);
        });
      }else{
        custIdt = formData.custName.id;
        resolve(custIdt);
      }
    });

    getCust.then(res => {
      custId = res;
      for (let index = 1; index <= formData.noOfItem; index++) {
        console.log("index is"+index,formData["item"+index+"Price"]);
        totAmt += formData["item"+index+"Price"];
      }

      if(formData.gst == 1){
        console.log("with GST");
        gstAmt = totAmt*(18/100);
        totAmt += gstAmt;
      }

      amtPending = totAmt-formData.amountReceived;

      let year = new Date().getFullYear();
      let month = new Date().getMonth().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
      let dayst = new Date().getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
      let datebn2 = Date.now();
      let billNo = year.toString()+month.toString()+dayst.toString()+Math.floor(100000 + Math.random() * 900000);

      var dataNew : Bill = {
        id:'',
        amount:totAmt,
        amountPending:amtPending,
        amountReceived:formData.amountReceived,
        billNo:billNo,
        date : formData.date,
        customerId:custId,
        engineersName:formData.engineersName,
        gstAmount:gstAmt,
        gstStatus:formData.gst,
        itemCount:formData.noOfItem,
        location:formData.siteLocation,
        siteName:formData.siteName,
        status:formData.isPaid,
      }

      this.billService.create(dataNew).then((res : any) => {
        billId = res.id;
        formData.billId = billId;
        this.insBillItems(formData);
      });
    })
  }

  insBillItems(formData : any){
    for (let index = 1; index <= formData.noOfItem; index++) {
      var dataNew : Billitem = {
        id : '',
        amount : formData["item"+index+"Price"],
        billId : formData["billId"],
        date : formData["item"+index+"Date"],
        name : formData["item"+index],
        rate : formData["item"+index+"Rate"],
        unit : formData["item"+index+"Unit"],
        itemNo : index,
        status : 1,
      }

      this.billItemService.create(dataNew).then((res : any) => {
        console.log(res);
        if(index == formData.noOfItem){
          this.router.navigate(['view-bill/'+btoa(formData["billId"])]);
        }
      });
    }
  }

  calcAmount(ind : number){
    let rate : any = this.billForm.get('item'+ind+'Rate').value;
    let unit : any = this.billForm.get('item'+ind+'Unit').value;
    if(rate && unit){
      let price = parseInt(rate)*parseInt(unit);
      this.billForm.patchValue({['item'+ind+'Price']: price});
    }
  }

  searchCleared() {
    console.log('searchCleared');
    this.data = [];
  }

  selectEvent(item : any) {
    console.log(item);
    this.billForm.patchValue({custGst: item['gst_no']});
    this.billForm.patchValue({custCity: item['address']});
    this.billForm.patchValue({custMob : item['mobile']});
    this.billForm.patchValue({custEmail : item['email']});
  }

  onChangeSearch(val: string) {

    /* this.http.post('http://localhost/testslim_1/public/getCustomerList',{q : val}).subscribe((response:any) => {
      if(response.status == true){
        this.data = response.data;
      }else{
        this.data = [];
      }
    }); */
  }

  onFocused(e : any){
    // do something when input is focused
  }
}
