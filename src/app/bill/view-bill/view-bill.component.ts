import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BillService } from 'src/app/services/bill.service';
import { BillitemService } from 'src/app/services/billitem.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Imagesbase64Service } from "src/app/services/imagesbase64.service";
import { AmountToWordPipe } from "src/app/pipes/amount-to-word.pipe";

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
  amtWrdPipe = new AmountToWordPipe();

  constructor(private route : ActivatedRoute, private billService : BillService, private billItemService : BillitemService, private customerService : CustomerService, private imageService : Imagesbase64Service) {
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
      this.billNo = response['billNo'];
      this.date = response['date'];
      this.amount = response['amount'];
      this.gstStatus = response['gstStatus'];
      this.gstAmount = response['gstAmount'];
      // this.amountInWords = this.helpers.numToWord(response['amount']);
      this.billItemService.getAllByBillId(this.billId).then(res=>{
        res.forEach((doc : any) => {
          this.items.push(doc.data());
        });
      });

      this.customerService.get(response['customerId']).subscribe(res => {
        this.customerName = res['name'];
        this.customerEmail = res['email'];
        this.customerMobile = res['mobile'];
      });

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

  generatePdf(action : string){
    let rowsCnt = this.items.length;
    let tableData : any = [
      [
        {fillColor: '#eeeeee',text : {text : 'Item',style: 'tabHead'}},
        {fillColor: '#eeeeee',text : {text : 'Rate',style: 'tabHead'}},
        {fillColor: '#eeeeee',text : {text : 'Unit',style: 'tabHead'}},
        {fillColor: '#eeeeee',text : {text : 'Amount',style: 'tabHead'}},
      ]
    ];
    this.items.forEach((doc : any) => {
      let tempData = [];
      tempData.push(doc.name);
      tempData.push(doc.rate);
      tempData.push(doc.unit);
      tempData.push(doc.amount);
      tableData.push(tempData);
    });

    if(this.gstStatus == 1){
      rowsCnt += 2;
      let tempData = [];
      tempData.push('CGST (9%)');
      tempData.push('');
      tempData.push('');
      tempData.push((this.gstAmount/2).toFixed(2));
      tableData.push(tempData);
      tempData = [];
      tempData.push('SGST (9%)');
      tempData.push('');
      tempData.push('');
      tempData.push((this.gstAmount/2).toFixed(2));
      tableData.push(tempData);
    }

    let footMarg = (650-170)-(rowsCnt*18);
    let amtInWords = this.amtWrdPipe.transform(this.amount)


    // const documentDefinition = { conte/////////////nt: 'This is an sample PDF printed with pdfMake' };
    const dd : any = {
      watermark: { text: 'Gavande Brothers', color: 'grey', opacity: 0.1, angle : -50, bold: true, italics: true },
      content: [
        {
          table: {
            widths: [250, 250],
            body: [
              [{image: this.imageService.logoImg,width : 200}, {
                text: 'Jai Jawan Chowk, Indiranagar,Sangamner.\nTal.:Sangamner\nDist.:Ahmednagar,422605\n7350442744\ngavandebrothers@gmail.com',
                margin: [80, 0, 0, 0],
              }],
              [{text : [{text : 'Prop: ',style: 'boldStyle'},'Somnath Arun Gavande'],colSpan: 2, alignment: 'center'}]
            ]
          },
          layout: 'noBorders',
          // margin: [0, 600, 0, 0],
        },
        {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 } ]},
        {
          table: {
            widths: [250, 250],
            body: [
              [
                {
                  text: [
                    {text : 'Invoice No.: ',style: 'boldStyle'},this.billNo,
                    '\n',
                    {text : 'Date: ',style: 'boldStyle'},new Date().toDateString().substr(3),
                    '\n',
                    {text : 'GST: ',style: 'boldStyle'},'27BEGPG5692M1ZX',
                    '\n',
                    {text : 'HSN No.: ',style: 'boldStyle'},'9015',
                  ]
                },
                {
                  text: [
                    this.customerName,
                    '\n',
                    this.customerEmail,
                    '\n',
                    this.customerMobile
                  ],
                  margin: [100, 0, 0, 0],
                }
              ]
            ]
          },
          layout: 'noBorders'
        },
        {
          table: {
            widths: [250, 70, 72, 90],
            body: tableData
          },
        },
        {
          table: {
            widths: [250, 250],
            body: [
              [
                {
                  text: {text : 'Total',style: 'boldStyle'},
                },
                {
                  text: this.amount.toFixed(2),
                }
              ],
              [{text : amtInWords,colSpan: 2, alignment: 'right'}]
            ]
          },
          margin: [0, footMarg, 0, 0],
        },
      ],
      styles: {
        boldStyle: {
          bold: true,
        },
        tabHead: {
          bold: true,
        }
      }
    }
    // pdfMake.createPdf(documentDefinition).open();
    if(action == 'print'){
      pdfMake.createPdf(dd).print();
    }else if(action == 'download'){
      pdfMake.createPdf(dd).download(this.customerName+'_'+this.billNo+'.pdf');
    }else{
      pdfMake.createPdf(dd).open();
    }
   }
}
