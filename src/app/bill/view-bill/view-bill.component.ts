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
  customerGst : any;
  customerMobile : any;
  amountInWords : string = '';
  urlBillId : any = '';
  amtWrdPipe = new AmountToWordPipe();
  engineersName: any;
  location: any;
  siteName: any;

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
      console.log(response);
      this.billNo = response['billNo'];
      this.date = response['date'];
      this.amount = response['amount'];
      this.gstStatus = response['gstStatus'];
      this.gstAmount = response['gstAmount'];
      this.engineersName = response['engineersName'];
      this.location = response['location'];
      this.siteName = response['siteName'];
      // this.amountInWords = this.helpers.numToWord(response['amount']);
      this.billItemService.getAllByBillId(this.billId).then(res=>{
        res.forEach((doc : any) => {
          if(doc.data()['itemNo'] != undefined){
            this.items[doc.data()['itemNo']-1] = doc.data();
          }else{
            this.items.push(doc.data());
          }
        });
        console.log(this.items);
      });

      this.customerService.get(response['customerId']).subscribe(res => {
        this.customerName = res['name'];
        this.customerEmail = res['email'];
        this.customerGst = res['gst_no'];
        this.customerMobile = res['mobile'];
      });
    });
  }

  printPage() {
    window.print();
  }

  generatePdf(action : string){
    let rowsCnt = this.items.length;
    let tableData : any = [
      [
        {fillColor: '#eeeeee',text : {text : 'Date',style: 'tabHead'}},
        {fillColor: '#eeeeee',text : {text : 'Item',style: 'tabHead'}},
        {fillColor: '#eeeeee',text : {text : 'Rate',style: 'tabHead'}},
        {fillColor: '#eeeeee',text : {text : 'Unit',style: 'tabHead'}},
        {fillColor: '#eeeeee',text : {text : 'Amount',style: 'tabHead'}},
      ]
    ];
    this.items.forEach((doc : any) => {
      let tempData = [];
      tempData.push(doc.date);
      tempData.push(doc.name);
      tempData.push(doc.rate);
      tempData.push(doc.unit);
      tempData.push(doc.amount);
      tableData.push(tempData);
    });

    if(this.gstStatus == 1){
      rowsCnt += 2;
      let tempData = [];
      tempData.push('');
      tempData.push('CGST (9%)');
      tempData.push('');
      tempData.push('');
      tempData.push((this.gstAmount/2).toFixed(2));
      tableData.push(tempData);
      tempData = [];
      tempData.push('');
      tempData.push('SGST (9%)');
      tempData.push('');
      tempData.push('');
      tempData.push((this.gstAmount/2).toFixed(2));
      tableData.push(tempData);
    }

    let footMarg = (480-170)-(rowsCnt*18);
    let amtInWords = this.amtWrdPipe.transform(this.amount)


    // const documentDefinition = { conte/////////////nt: 'This is an sample PDF printed with pdfMake' };
    const dd : any = {
      watermark: { text: 'Gavande Brothers', color: 'grey', opacity: 0.1, angle : -50, bold: true, italics: true },
      content: [
        {
          table: {
            widths: [510],
            body: [
              [{text : [{text : 'Tax Invoice',style: 'boldStyle'}], alignment: 'center',fontSize: 20}]
            ]
          },
          layout: 'noBorders',
          // margin: [0, 600, 0, 0],
        },
        {
          table: {
            widths: [250, 250],
            body: [
              [{image: this.imageService.logoImg,width : 250}, {
                text: 'Jai Jawan Chowk, Indiranagar,Sangamner.\nTal.:Sangamner\nDist.:Ahmednagar,422605\n7350442744,9850179535\ngavandebrothers@gmail.com',
                margin: [80, 0, 0, 0],
              }],
              [{text : [{text : 'Prop: ',style: 'boldStyle'},'Somnath Arun Gavande'],colSpan: 2}]
            ]
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 5],
        },
        {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.1, lineColor: '#a4a4a4' } ]},
        {
          table: {
            widths: [300, 200],
            body: [
              [
                {
                  text: [
                    {text : 'Invoice No.: ',style: 'boldStyle'},this.billNo,
                    '\n',
                    {text : 'Date: ',style: 'boldStyle'},new Date(this.date).toDateString().substr(3),
                    '\n',
                    {text : 'GST: 27BNUPG2300P1ZN',style: 'boldStyle'},
                    '\n',
                    {text : 'HSN No.: ',style: 'boldStyle'},'9015',
                  ]
                },
                {
                  text: [
                    {text : 'Customer Details',style: 'boldStyleWithU'},
                    '\n',
                    this.customerName,
                    '\n',
                    this.customerEmail,
                    '\n',
                    {text : 'GST No.: ',style: 'boldStyle'},{text : this.customerGst,style: 'boldStyle'}
                  ]
                }
              ]
            ]
          },
          margin: [0, 5, 0, 5],
          layout: 'noBorders'
        },
        {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.1, lineColor: '#a4a4a4'} ]},
        {
          table: {
            widths: [300, 200],
            body: [
              [
                {
                  text: [
                    {text : 'Bank Details',style: 'boldStyle'},
                    '\n',
                    {text : 'Acc Name: ',style: 'boldStyle'},{text : 'GAVANDE BROTHERS ENGINEERS AND SURVEYORS',fontSize: 10},
                    '\n',
                    {text : 'Account No.: ',style: 'boldStyle'},'091663700000655',
                    '\n',
                    {text : 'IFSC Code : ',style: 'boldStyle'},'YESB0000916',
                  ]
                },
                {
                  text: [
                    {text : 'Site Name: ',style: 'boldStyle'},this.siteName,
                    '\n',
                    {text : 'Site Engg/Supervisor: ',style: 'boldStyle'},this.engineersName,
                    '\n',
                    {text : 'Location: ',style: 'boldStyle'},this.location,
                  ]
                }
              ]
            ]
          },
          margin: [0, 10, 0, 5],
          layout: 'noBorders'
        },
        {
          table: {
            widths: [68,210, 70, 40, 90],
            body: tableData
          },
          layout: {
            hLineWidth: function (i : any, node: any) {
              return 0.5;
            },
            vLineWidth: function (i: any, node: any) {
              return 0.5;
            },
            hLineColor: function (i: any, node: any) {
              return '#a4a4a4';
            },
            vLineColor: function (i: any, node: any) {
              return '#a4a4a4';
            }
            // paddingLeft: function(i, node) { return 4; },
            // paddingRight: function(i, node) { return 4; },
            // paddingTop: function(i, node) { return 2; },
            // paddingBottom: function(i, node) { return 2; },
            // fillColor: function (i, node) { return null; }
          }
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
                  text: {text : this.amount.toFixed(2),alignment: 'right'},
                  // text: this.amount.toFixed(2),
                }
              ],
              [{text : amtInWords,colSpan: 2, alignment: 'right'}]
            ]
          },
          margin: [0, 20, 0, 0]
        },
        {
          table: {
            widths: [250, 250],
            body: [
              [
                {
                  text: {text : 'Customer Signature',style: 'boldStyle'},
                },
                {
                  text: {text : 'For Gavande Brother\'s',style: 'boldStyle',alignment: 'right'},
                }
              ],
              [{text : 'Thank\'s For Your Business, Please Visit Again!!!',colSpan: 2, style: 'boldStyle',alignment: 'center'}]
            ]
          },
          layout: 'noBorders',
          margin: [0, 50, 0, 0]
        }
      ],
      styles: {
        boldStyle: {
          bold: true,
        },
        boldStyleWithU: {
          bold: true,
          decoration : 'underline'
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
