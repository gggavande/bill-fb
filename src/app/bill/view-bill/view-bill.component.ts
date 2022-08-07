import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelperFunctionService } from 'src/app/common/helper-function.service';
import { BillService } from 'src/app/services/bill.service';
import { BillitemService } from 'src/app/services/billitem.service';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.css']
})
export class ViewBillComponent implements OnInit {
  billId : any;
  isLoading : boolean = true;

  billDetails : any;
  billNo : any;
  date : any;
  items : any = [];
  amount : any;
  gstStatus : any;
  gstAmount : any;
  customerName : any;
  customerEmail : any;
  customerMobile : any;
  amountInWords : string = '';
  urlBillId : any = '';

  constructor(private route : ActivatedRoute , private helpers : HelperFunctionService, private billService : BillService, private billItemService : BillitemService) {
    this.route.paramMap.subscribe(params => {
      // this.billId = atob(params.get('billId'));
      this.urlBillId = params.get('billId');
      console.log(atob(this.urlBillId));
      this.billId = atob(this.urlBillId);
    });
   }

  ngOnInit(): void {
    this.fetchBill();
  }

  fetchBill(){
    this.billService.get(this.billId).subscribe(response => {
      console.log(response);
      this.billNo = response['billNo'];
      this.date = response['date'];
      this.amount = response['amount'];
      this.gstStatus = response['gstStatus'];
      this.gstAmount = response['gstAmount'];
      this.amountInWords = this.helpers.numToWord(response['amount']);
      console.log(this.amountInWords);
      this.billItemService.getAllByBillId(this.billId).then(res=>{
        res.forEach((doc : any) => {
          // doc.data() is never undefined for query doc snapshots
          this.items.push(doc.data());
        });
        console.log('////////////////////////');
        console.log(this.items);
      })

      /* this.items = response.data.item;
      this.customerName = response.data.customer.name;
      this.customerEmail = response.data.customer.email;
      this.customerMobile = response.data.customer.mobile;

      this.billDetails = response.data; */
    });
    /* this.http.post('http://localhost/testslim_1/public/fetchBill',{billId : this.billId}).subscribe((response:any) => {
      console.log(response);
      this.isLoading = false;
      if(response.status == true){
        this.billNo = response.data.billNo;
        this.date = response.data.date;
        this.items = response.data.item;
        this.amount = response.data.amount;
        this.gstStatus = response.data.gstStatus;
        this.gstAmount = response.data.gstAmount;
        this.customerName = response.data.customer.name;
        this.customerEmail = response.data.customer.email;
        this.customerMobile = response.data.customer.mobile;

        this.billDetails = response.data;
        this.amountInWords = this.helpers.numToWord(response.data.amount);
      }else{
        alert("Something Went Wrong!");
      }
    }); */
  }

  printPage() {
    window.print();
  }
}
