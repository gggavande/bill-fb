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
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.css']
})
export class EditBillComponent implements OnInit {
  itemNo : number = 0;
  billForm: any;
  customerList : any;
  data: any;
  keyword = 'name';
  myDate : any;
  isSubmit : boolean = false;
  urlBillId : any = '';
  billId : any;
  billData : any;
  customerData : any;
  customerName: any;
  customerEmail: any;
  billItemData : any = [];
  customerMobile: any;
  customeraddress: any;
  customergst_no: any;
  custDetails: any;
  billNo: any;
  lastEleId: any;
  myDateTod: any;

  constructor(private datePipe: DatePipe, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private customerService : CustomerService, private billService : BillService, private billItemService : BillitemService,  private modalService: NgbModal) {
    this.route.paramMap.subscribe(params => {
      // this.billId = atob(params.get('billId'));
      this.urlBillId = params.get('billId');
      console.log(atob(this.urlBillId));
      this.billId = atob(this.urlBillId);
    });
  }

  ngOnInit(): void {
    this.fetchBill();

    this.billForm = this.fb.group({
      custName: ['',[Validators.required,Validators.min(4)]],
      billNo: ['',[Validators.required]],
      noOfItem: ['1'],
      gst: ['1',Validators.required],
      isPaid: ['0',Validators.required],
      amountReceived: ['0'],
      custGst : [''],
      custCity : [''],
      custMob : [''],
      custEmail : [''],
      engineersName : [''],
      siteLocation : [''],
      siteName : [''],
      date: [this.myDate]

    });

    this.customerService.getAll().subscribe(res => {
      console.log(res);
      this.data = res;
    })
  }

  fetchBill(){
    this.billService.get(this.billId).subscribe(response => {
      this.billData = response;
      this.myDateTod = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.myDate = response['date'];
      this.billNo = response['billNo'];
      this.billForm.patchValue({billNo: response['billNo']});
      this.billForm.patchValue({date: this.myDate});
      this.billForm.patchValue({engineersName: response['engineersName']});
      this.billForm.patchValue({siteLocation: response['location']});
      this.billForm.patchValue({siteName : response['siteName']});

      this.billItemService.getAllByBillId(this.billId).then(res=>{
        res.forEach((doc : any) => {
          let tmpDoc = doc.data();
          tmpDoc['id'] = doc.id;
          if(doc.data()['itemNo'] != undefined){
            this.billItemData[doc.data()['itemNo']-1] = tmpDoc;
          }else{
            this.billItemData.push(tmpDoc);
          }
          console.log('doc',doc);
        });
        console.log(this.billData);
        console.log(this.billItemData);
        this.lastEleId = this.billItemData[this.billItemData.length-1]['id'];
        console.log("--------------last ele---------",this.lastEleId);
        this.billItemData.forEach((doc : any,i:any) => {
            this.itemNo++;
            this.billForm.addControl("item"+this.itemNo,this.fb.control(doc['name'],Validators.required));
            this.billForm.addControl("item"+this.itemNo+"Rate",this.fb.control(doc['rate'],Validators.required));
            this.billForm.addControl("item"+this.itemNo+"Unit",this.fb.control(doc['unit'],Validators.required));
            this.billForm.addControl("item"+this.itemNo+"Price",this.fb.control(doc['amount'],Validators.required));
            this.billForm.addControl("item"+this.itemNo+"Date",this.fb.control(doc['date']));
            this.billForm.addControl("item"+this.itemNo+"Id",this.fb.control(doc['id']));
            this.billForm.patchValue({noOfItem: this.itemNo});
        });
      });

      this.customerService.get(response['customerId']).subscribe(res => {
        console.log("--------------------------------------");
        console.log(res);
        this.custDetails = res;
        this.customerName = res['name'];
        this.customerEmail = res['email'];
        this.customerMobile = res['mobile'];
        this.customergst_no = res['gst_no'];
        this.customeraddress = res['address'];
        this.billForm.patchValue({custName: this.custDetails});
        this.billForm.patchValue({custGst: res['gst_no']});
        this.billForm.patchValue({custCity: res['address']});
        this.billForm.patchValue({custMob : res['mobile']});
        this.billForm.patchValue({custEmail : res['email']});
      });
    });
  }

  addEle(){
    this.itemNo++;
    this.billForm.addControl("item"+this.itemNo,this.fb.control('',Validators.required));
    this.billForm.addControl("item"+this.itemNo+"Rate",this.fb.control('',Validators.required));
    this.billForm.addControl("item"+this.itemNo+"Unit",this.fb.control('',Validators.required));
    this.billForm.addControl("item"+this.itemNo+"Price",this.fb.control('',Validators.required));
    this.billForm.addControl("item"+this.itemNo+"Date",this.fb.control(this.myDateTod));
    this.billForm.addControl("item"+this.itemNo+"Id",this.fb.control(''));
    this.billForm.patchValue({noOfItem: this.itemNo});
    this.lastEleId = '';
  }

  removeEle(content : any, itId : any ){
    console.log('content',content,'itId',itId);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result === 'yes') {
        this.billForm.removeControl("item"+this.itemNo);
        this.billForm.removeControl("item"+this.itemNo+"Rate");
        this.billForm.removeControl("item"+this.itemNo+"Unit");
        this.billForm.removeControl("item"+this.itemNo+"Price");
        this.billForm.removeControl("item"+this.itemNo+"Date");
        this.billForm.removeControl("item"+this.itemNo+"Id");
        this.itemNo--;
        this.billForm.patchValue({noOfItem: this.itemNo});
        if(itId != ''){
          this.billItemService.delete(itId);
        }
      }
    }, (reason) => {
      console.log(reason);
    });

    if(this.billItemData[this.itemNo-1] == undefined){
      this.lastEleId = '';
    }else{
      this.lastEleId = this.billItemData[this.itemNo-1]['id'];
    }
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

      /* let year = new Date().getFullYear();
      let month = new Date().getMonth().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
      let dayst = new Date().getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
      let datebn2 = Date.now();
      let billNo = year.toString()+month.toString()+dayst.toString()+Math.floor(100000 + Math.random() * 900000); */
      let billNo = this.billNo;

      var dataNew : Bill = {
        id:this.billId,
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

      this.billService.update(dataNew).then((res : any) => {
        billId = this.billId;
        formData.billId = billId;
        this.updBillItems(formData);
      });
    })
  }

  updBillItems(formData : any){
    for (let index = 1; index <= formData.noOfItem; index++) {
      var dataNew : Billitem = {
        id : formData["item"+index+"Id"],
        amount : formData["item"+index+"Price"],
        billId : formData["billId"],
        date : formData["item"+index+"Date"],
        name : formData["item"+index],
        rate : formData["item"+index+"Rate"],
        unit : formData["item"+index+"Unit"],
        itemNo : index,
        status : 1,
      }

      if(dataNew.id != ''){
        this.billItemService.update(dataNew).then((res : any) => {
          console.log(res);
          if(index == formData.noOfItem){
            this.router.navigate(['view-bill/'+btoa(formData["billId"])]);
          }
        });
      }else{
        this.billItemService.create(dataNew).then((res : any) => {
          console.log(res);
          if(index == formData.noOfItem){
            this.router.navigate(['view-bill/'+btoa(formData["billId"])]);
          }
        });
      }
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
