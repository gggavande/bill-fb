import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BillService } from 'src/app/services/bill.service';

@Component({
  selector: 'app-bill-listing',
  templateUrl: './bill-listing.component.html',
  styleUrls: ['./bill-listing.component.css']
})
export class BillListingComponent implements OnInit, OnDestroy {

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  datatableElement: any = DataTableDirective;
  isDtInitialized:boolean = false
  urlCustId: any;
  billsData : any = [];
  content : any = '';

  constructor(private router : Router, private route : ActivatedRoute, private billService : BillService) {
    this.route.paramMap.subscribe(params => {
      // this.billId = atob(params.get('billId'));
      this.urlCustId = params.get('custId');
      console.log(atob(this.urlCustId));
      this.urlCustId = atob(this.urlCustId);
    });
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
    this.getBills();
  }

  getBills(){
    this.billService.getAllByCustomerId(this.urlCustId).then(res => {
      res.forEach((doc : any) => {
        let tempData = doc.data();
        tempData.id = doc.id
        this.billsData.push(tempData);
        console.log(tempData);
      });

      if (this.isDtInitialized) {
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next(this.dtOptions);
        });
      } else {
        this.isDtInitialized = true
        this.dtTrigger.next(this.dtOptions);
      }
    });
  }

  openConfirm(content : any, videoId :any ) {
    console.log("del clicked");
    /* this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteEle(videoId);
      }
    }, (reason) => {
      console.log(reason);
    }); */
  }

  editEle(id : any){
    console.log(id);
    this.router.navigate(['edit-bill/'+btoa(id)]);

  }

  deleteEle(id : any){
    console.log(id);

  }

  viewBill(id : any){
    console.log(id);
    this.router.navigate(['view-bill/'+btoa(id)]);
    // this.router.navigate(['view-bills/'+btoa(custId)]);
  }

}
