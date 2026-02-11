import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Dateformater } from '../dateformater';
import { ServiceService } from '../service.service';
import { FilterPopUpComponent } from './filter-pop-up/filter-pop-up.component';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { AgentContractListComponent } from '../agent-contract-list/agent-contract-list.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { process,State  } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { DatePipe } from '@angular/common'
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  status: boolean = false;
  dateformater: Dateformater = new Dateformater();
  data:any={};
  menuName: any = {};
  response: any;
  temp: any[];
  columns: any = [];
  commissionRsum:any;
  openContractReport: any = [];
  agentBookingStatus: any = [];
  billingReportInvoiceWise: any = [];
  billingReportContractWise: any = [];
  commissionReport: any = [];
  commissionReportFilter:any=[];
  kickbackReport: any = [];
  paymentReport: any = [];
  contractWise : any = []
  buyer : any = []
  seller : any = []
  article : any = []
  invBill: any = [];
  contractBill: any = [];
  cancelContract:any =[];
  rows:any =[];
  data3:any=[];
  data7:any=[];
data8 : any=[]
  DbCrData:any=[];
dbCount : any;
data4: any = [];
data5: any = [];
data6: any = [];
dispatchReport : any =[]
openSearch : any = []
cancelSearch : any = []
externalAgent: any = []
taxChallanReport: any = []
agents :  any = []
totalContract  = 0;
totalQuantity =0;
totalDispatch =0;
lCReport : any = []
contractTotal :  any
invoiceTotal  : any
paymentTotal : any;
kickbackContract :  any;
kickbackDispatch : any;
kickbackQty : any
loggedInDepartmentName :  any;
month : any;
year : any ;
paySearch : any = []
dbCrSearch2 : any = []
searchAgent : any = []
kickbackSearch2 : any = []
data9: any = [];
searchDispatch : any = []
searchDispatchfilter : any = []
bookingAgent : any = []
totalContainer:any;
@ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  constructor(

    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: ServiceService,
    public datepipe: DatePipe,
    private router: Router,


  ) { 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; 
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('sidebar-collapse'); 
    let footer = document.getElementsByTagName('footer')[0];
    footer.classList.add('d-none'); 
    if(this.menuName.menuName !='OpenContractReport'){
    }
   }

  ngOnInit(): void {
    this.data4.saleInvoiceType =null;
    this.data8.maturityStatus=null;
      this.data8.paymentStatus=null;
    this.menuName = this.route.snapshot.queryParams;
    this.billingReportInvoiceWise.startDate = this.dateformater.toModel(this.billingReportInvoiceWise.startDate)
    this.billingReportInvoiceWise.endDate = this.dateformater.toModel(this.billingReportInvoiceWise.endDate)
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');
    let varr = {
      "buyerId":this.data.buyerId ==undefined ? 0 :this.data.buyerId,
      "sellerId":this.data.sellerId == undefined?0 :this.data.sellerId,
      "contractNo":this.data.contractNo == undefined ? '': this.data.contractNo,
       "startInvoiceDate" :  this.data.startInvoiceDate == undefined?'':this.dateformater.toModel(this.data.startInvoiceDate),
       "endInvoiceDate" :  this.data.endInvoiceDate == undefined?'':this.dateformater.toModel(this.data.endInvoiceDate),
       "startBillDate" :  this.data.startBillDate == undefined?'':this.dateformater.toModel(this.data.startBillDate),
       "endIBillDate" :  this.data.endIBillDate == undefined?'':this.dateformater.toModel(this.data.endIBillDate),
       "billNo":this.data.billNo == undefined ? '': this.data.billNo,
       "saleInvoiceNo":this.data.saleInvoiceNo == undefined ? '': this.data.saleInvoiceNo,
       "articleId":this.data.articleId ==undefined ? 0 :this.data.articleId,
       "maturityStatus":this.data.maturityStatus == undefined? "Matured": this.data.maturityStatus,
       "paymentStatus":this.data.paymentStatus == undefined? "null":this.data.paymentStatus


    }

if(this.menuName.menuName == 'CancleContarctReport'){

  this.cancelContractReport();
}
else if ( this.menuName.menuName == 'BillingReportInvoiceWise'){
  this.fetch();
}
else if(this.menuName.menuName =='OpenContractReport'){
  this.getOpenContractReport2();
}
else if(this.menuName.menuName =='PaymentReport'){
  this.PaymentReport();
}
else if(this.menuName.menuName =='KickbackReport'){
 this.kickbackContractReport();
}
else if(this.menuName.menuName =='AgentBookingStatus'){
  this.agentBooking();
 }


else if (this.menuName.menuName == 'DbcrNoteSummary'){
  this.GetDbCrReport();
}
else if (this.menuName.menuName == 'BillingReportContractWise'){
  this.fetchContractInvise();
}
else if (this.menuName.menuName == 'DispatchReport'){
  this.getdispatchReport();
}
else if (this.menuName.menuName == 'ExternalAgentReport'){
  //this.externalAgentReport();
}

else if (this.menuName.menuName == 'CommissionReport'){
this.filterPopUform("CommissionReport");
}

    this.GetBuyersDropdown();
    this.GetSellersDropdown();
    this.GetArticleDropdown();
    this.GetAgentDropdown();
  }
  GetBuyersDropdown() {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.buyer = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetArticleDropdown() {
    this.service.getArticles().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.article = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetAgentDropdown() {
    this.service.getAgents().subscribe(res => {
      this.response = res;
      if (this.response.success == true && this.response.data != null) {
        this.agents = this.response.data;
      }
      else if(this.response.success == false) {
         
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetSellersDropdown() {
    this.service.getSellers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.seller = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  seeContractMethod(data){
    const modalRef = this.modalService.open(AgentContractListComponent, { centered: true,size:"sm" });
    modalRef.componentInstance.dataR = data;
    modalRef.result.then((p) => {
      if (p != null) {


      }
    }, (reason) => {
    });

  }

  navigateEditContract(obj) {
    this.router.navigate(['/FabCot/active-contract-details'], { queryParams: {id: obj.contractId} });
  };
  filterPopUform(menu) {
    const modalRef = this.modalService.open(FilterPopUpComponent, { centered: true });
    modalRef.componentInstance.menu = menu;
    modalRef.result.then((p) => {
      if (p != null) {
  this.commisionReport(p)

      }
    }, (reason) => {
    });
  }
  public onFilter(inputValue: string): void {
    this.rows = process(this.invBill, {
        filter: {
            logic: "or",
            filters: [
                {
                    field: 'articleName',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'contractNo',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'contractDate',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'billDate',
                    operator: 'contains',
                    value: inputValue
                },
             
                {
                    field: 'billNo',
                    operator: 'contains',
                    value: inputValue
                }
                ,
                {
                    field: 'sellerName',
                    operator: 'contains',
                    value: inputValue
                }
                ,
                {
                    field: 'buyerName',
                    operator: 'contains',
                    value: inputValue
                }
                ,
                {
                    field: 'rate',
                    operator: 'contains',
                    value: inputValue
                },
                {
                  field: 'fabcotCommission',
                  operator: 'contains',
                  value: inputValue
              },
              {
                field: 'invoiceNo',
                operator: 'contains',
                value: inputValue
            },
            {
              field: 'quantity',
              operator: 'contains',
              value: inputValue
          },
          {
            field: 'contractOwners',
            operator: 'contains',
            value: inputValue
        },
        {
          field: 'commissionAmount',
          operator: 'contains',
          value: inputValue
      },
            ],
        }
    }).data;

    this.dataBinding.skip = 0;
}
  billInvSearch(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.invBill.filter(function (d) {
      return (d.contractNo.toLowerCase().indexOf(val) !== -1   || d.contractOwners.toLowerCase().indexOf(val) !== -1 ||
      d.manualContractNumber.toLowerCase().indexOf(val) !==-1   || !val );
    });
    this.billingReportInvoiceWise = temp;
  }
  agentBookingSearch(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.bookingAgent.filter(function (d) {
      return (d.agentName.toLowerCase().indexOf(val) !== -1   || !val);
    });
    this.agentBookingStatus = temp;
  }

  CommissionReportsearch(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.commissionReportFilter.filter(function (d) {
      return (d.contractNo.toLowerCase().indexOf(val) !== -1   || !val);
    });
    this.agentBookingStatus = temp;
  }
  billContractSearch(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.contractBill.filter(function (d) {
      return (d.contractNo.toLowerCase().indexOf(val) !== -1   || d.manualContractNumber.toLowerCase().indexOf(val) !==-1   || !val);
    });
    this.contractWise = temp;
  }
  dispatchSearch(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.searchDispatch.filter(function (d) {
      return (d.contractNo.toLowerCase().indexOf(val) !== -1   ||d.manualContractNumber.toLowerCase().indexOf(val) !==-1   || !val);
    });
    this.dispatchReport = temp;
  }

  openContractSearch(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.openSearch.filter(function (d) {
      return (d.contractNo.toLowerCase().indexOf(val) !== -1 ||
        d.manualContractNumber.toLowerCase().indexOf(val) !==-1   ||
      !val);
    });
    this.rows = temp;
  }

  cancelContractSearch(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.cancelSearch.filter(function (d) {
      return (d.contractNo.toLowerCase().indexOf(val) !== -1 || d.buyerName.toLowerCase().indexOf(val) !==-1   || 
      d.sellerName.toLowerCase().indexOf(val) !==-1   || d.manualContractNumber.toLowerCase().indexOf(val) !==-1   ||
      !val);
    });
    this.cancelContract = temp;
  }
  paymentSearch(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.paySearch.filter(function (d) {
      return (d.autoContractNo.toLowerCase().indexOf(val) !== -1  ||
      d.saleInvoiceNo.toLowerCase().indexOf(val) !==-1   ||
      !val);
    });
    this.paymentReport = temp;
  }
  dbCrSearch(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.dbCrSearch2.filter(function (d) {
      return (d.autoContractNumber.toLowerCase().indexOf(val) !== -1  || d.manualContractNumber.toLowerCase().indexOf(val) !==-1   ||
      !val);
    });
    this.DbCrData = temp;
  }
  externalAgentSearch(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.searchAgent.filter(function (d) {
      return (d.contractNo.toLowerCase().indexOf(val) !== -1  || d.manualContractNumber.toLowerCase().indexOf(val) !==-1   ||
      !val);
    });
    this.externalAgent = temp;
  }
  kickbackSearch(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.kickbackSearch2.filter(function (d) {
      return (d.contractNo.toLowerCase().indexOf(val) !== -1  || d.manualContractNumber.toLowerCase().indexOf(val) !==-1   ||
      !val);
    });
    this.kickbackReport = temp;
  }
  fetch() {
    this.billingReportInvoiceWise.startDate = this.dateformater.toModel(this.billingReportInvoiceWise.startDate)
    this.billingReportInvoiceWise.endDate = this.dateformater.toModel(this.billingReportInvoiceWise.endDate)

    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/Reports/AllBillingReportInvoiceWise/`+   this.billingReportInvoiceWise.startDate + '/' +this.billingReportInvoiceWise.endDate      )
    .subscribe(res => {
      this.response = res;

    if(this.response.success==true)
    {
    this.billingReportInvoiceWise=this.response.data.getBillReport;
    this.spinner.hide();

    this.invBill = [...this.billingReportInvoiceWise]
    this.invoiceTotal  = this.response.data.totalcommisionamount +' '+ this.billingReportInvoiceWise[0].rateCurrencyName;

    }
    else{
      this.toastr.error(this.response.message, 'Message.');
      this.spinner.hide();

    }

    }, err => {
      if ( err.status == 400) {
  this.toastr.error(err.error.message, 'Message.');
  this.spinner.hide();

      }
    });
  }

 

  GetDbCrReport() {

let test=localStorage.getItem('loggedInDepartmentId');
    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/Reports/GetDebitCreditReporte/`+test )
    .subscribe(res => {
      this.response = res;

    if(this.response.success==true)
    {
    this.DbCrData=this.response.data;
 this.dbCrSearch2 = [...this.DbCrData]
    this.spinner.hide();

    }
    else{
      this.toastr.error(this.response.message, 'Message.');
      this.spinner.hide();

    }

    }, err => {
      if ( err.status == 400) {
  this.toastr.error(err.error.message, 'Message.');
  this.spinner.hide();

      }
    });
  }

  getOpenContractReport(){
    this.rows = [];
    let varr = {
      "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
      "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
      "autoContractNumber":this.data3.autoContractNumber == undefined ? '': this.data3.autoContractNumber,
      "startContractDate":this.data3.startContractDate == undefined? '':this.dateformater.toModel(this.data3.startContractDate),
      "endContractDate":this.data3.endContractDate == undefined?'':this.dateformater.toModel(this.data3.endContractDate),
      "status" : "Open"
    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Reports/ContractReport`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.obj.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.rows = this.response.data.obj;
            this.openSearch = [...this.rows]
            this.totalContract = this.response.data.totalContract 
            this.totalDispatch = this.response.data.totalDispatchAmount
            this.totalQuantity = this.response.data.totalQuantity
            this.totalContainer =this.response.data.totalContainers
         this.spinner.hide();
          }
          else if(this.response.data.obj.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
         this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });
  }
  getOpenContractReport2(){

    let varr = {
      "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
      "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
      "autoContractNumber":this.data3.autoContractNumber == undefined ? '': this.data3.autoContractNumber,
      "startContractDate":this.data3.startContractDate == undefined? '': this.dateformater.toModel(this.data3.startContractDate),
      "endContractDate":this.data3.endContractDate == undefined?'':this.dateformater.toModel(this.data3.endContractDate),
      "status" : "Open"
    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Reports/ContractReport`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.obj.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.rows = this.response.data.obj;
            this.openSearch = [...this.rows]
            this.totalContract = this.response.data.totalContract 
            this.totalDispatch = this.response.data.totalDispatchAmount
            this.totalQuantity = this.response.data.totalQuantity
            this.totalContainer =this.response.data.totalContainers

         this.spinner.hide();
          }
          else if(this.response.data.obj.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
         this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });
  }
  getdispatchReport(){

    let varr = {
      "buyerId":this.data9.buyerId ==undefined ? 0 :this.data9.buyerId,
      "sellerId":this.data9.sellerId == undefined?0 :this.data9.sellerId,
      "contractNo":this.data9.autoContractNumber == undefined ? '': this.data9.autoContractNumber,
      "startInvoiceDate":this.data9.startContractDate == undefined? '': this.dateformater.toModel(this.data9.startContractDate),
      "endInvoiceDate":this.data9.endContractDate == undefined?'':this.dateformater.toModel(this.data9.endContractDate),
      "articleId":this.data9.articleId ==undefined ? 0 :this.data9.articleId,
      "maturityStatus":this.data9.maturityStatus,
      "paymentStatus":this.data9.paymentStatus,
    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Reports/GetDispatchReport`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.dispatchReport = this.response.data.list;
            this.searchDispatch = [...this.dispatchReport]
            this.searchDispatchfilter = [...this.dispatchReport]
            // this.openSearch = [...this.rows]
            // this.totalContract = this.response.data.totalContract 
            // this.totalDispatch = this.response.data.totalDispatchAmount
            // this.totalQuantity = this.response.data.totalQuantity


         this.spinner.hide();
          }
          else if(this.response.data.obj.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
         this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });
  }
  sellerbillstatus(value){
    if(value == 'Pending'){
      let pdata=this.dispatchReport.filter(x=>x.sellerBill == 'Pending');
      this.dispatchReport =[...pdata]
    }
    else if(value == 'Received'){
      let Rdata=this.searchDispatchfilter.filter(x=>x.sellerBill != 'Pending');
      this.dispatchReport =[...Rdata]
    }
    else{
      this.dispatchReport =[...this.searchDispatch]
    }
  }
  externalAgentReport(){

    let varr = {
      "agentId":this.data8.agentId ==undefined ? "" :this.data8.agentId.toString(),
      "sellerId":this.data8.sellerId == undefined?0 :this.data8.sellerId,
      "contractNo":this.data8.autoContractNumber == undefined ? '': this.data8.autoContractNumber,
      "maturityStatus":this.data8.maturityStatus,
      "paymentStatus":this.data8.paymentStatus,

    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Reports/External_Agent_Report`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.externalAgent = this.response.data.obj;
         this.searchAgent = [...this.externalAgent]

         this.spinner.hide();
          }
          else if(this.response.data.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
         this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });
  }

  cancelContractReport(){

    let varr = {
      "buyerId":this.data7.buyerId ==undefined ? 0 :this.data7.buyerId,
      "sellerId":this.data7.sellerId == undefined?0 :this.data7.sellerId,
      "autoContractNumber":this.data7.autoContractNumber == undefined ? '': this.data7.autoContractNumber,
      "startContractDate":this.data7.startContractDate == undefined? '': this.dateformater.toModel(this.data7.startContractDate),
      "endContractDate":this.data7.endContractDate == undefined?'':this.dateformater.toModel(this.data7.endContractDate),
      "status" : "Cancel"
    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Reports/ContractReport`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.obj.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.cancelContract = this.response.data.obj;
            this.cancelSearch = [...this.cancelContract];
            this.totalContract = this.response.data.totalContract 
            this.totalDispatch = this.response.data.totalDispatchAmount
            this.totalQuantity = this.response.data.totalQuantity

         this.spinner.hide();
          }
          else if(this.response.data.obj.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
         this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });
  }


 agentBooking(){

    this.spinner.show();
    this.http.
    get(`${environment.apiUrl}/api/Reports/AgentBookingReport`)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.agentBookingStatus = this.response.data;
         this.bookingAgent = [...this.agentBookingStatus]

         this.spinner.hide();
          }
          else if(this.agentBookingStatus.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
         this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });
  }



PaymentReport(){
  let varr = {
    "buyerId":this.data4.buyerId ==undefined ? 0 :this.data4.buyerId,
    "sellerId":this.data4.sellerId == undefined?0 :this.data4.sellerId,
    "startContractDate":this.data4.startContractDate == undefined? '': this.dateformater.toModel(this.data4.startContractDate),
    "endContractDate":this.data4.endContractDate == undefined?'':this.dateformater.toModel(this.data4.endContractDate),
    "saleInvoiceType": this.data4.saleInvoiceType
  }
  this.spinner.show();
  this.http.
    post(`${environment.apiUrl}/api/Reports/Payment_Report`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.paymentReport = this.response.data.objsaleinvoiceitem;
          this.paySearch = [...this.paymentReport]
        this.paymentTotal  =  this.response.data.totalAmount;


       this.spinner.hide();
        }
        else if(this.paymentReport.length == 0) {
          this.toastr.error("No such Contract Exist", 'Message.');
       this.spinner.hide();
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
       this.spinner.hide();
        }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(),'Message.');
        this.spinner.hide();

      });
}
kickbackContractReport(){
  let varr = {
    "buyerId":this.data5.buyerId ==undefined ? 0 :this.data5.buyerId,
    "sellerId":this.data5.sellerId == undefined?0 :this.data5.sellerId,
    "autoContractNumber":this.data5.autoContractNumber == undefined ? '': this.data5.autoContractNumber,
    "startContractDate":this.data5.startContractDate == undefined? '': this.dateformater.toModel(this.data5.startContractDate),
    "endContractDate":this.data5.endContractDate == undefined?'':this.dateformater.toModel(this.data5.endContractDate)
  }
  this.spinner.show();
  this.http.
    post(`${environment.apiUrl}/api/Reports/KickbackContractReport`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.kickbackReport = this.response.data.obj1;
          this.kickbackSearch2 = [...this.kickbackReport]
        this.kickbackContract =  this.response.data.totalContract
         this.kickbackDispatch = this.response.data.totalDispatchAmount
         this.kickbackQty = this.response.data.totalQuantity

       this.spinner.hide();
        }
        else if(this.kickbackReport.length == 0) {
          this.toastr.error("No such Contract Exist", 'Message.');
       this.spinner.hide();
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
       this.spinner.hide();
        }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(),'Message.');
        this.spinner.hide();

      });
}
kickbackContractReport2(){
  this.kickbackReport = [];
  let varr = {
    "buyerId":this.data5.buyerId ==undefined ? 0 :this.data5.buyerId,
    "sellerId":this.data5.sellerId == undefined?0 :this.data5.sellerId,
    "autoContractNumber":this.data5.autoContractNumber == undefined ? '': this.data5.autoContractNumber,
    "startContractDate":this.data5.startContractDate == undefined? '': this.dateformater.toModel(this.data5.startContractDate),
    "endContractDate":this.data5.endContractDate == undefined?'':this.dateformater.toModel(this.data5.endContractDate)
  }
  this.spinner.show();
  this.http.
    post(`${environment.apiUrl}/api/Reports/KickbackContractReport`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.kickbackReport = this.response.data;


       this.spinner.hide();
        }
        else if(this.kickbackReport.length == 0) {
          this.toastr.error("No such Contract Exist", 'Message.');
       this.spinner.hide();
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
       this.spinner.hide();
        }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(),'Message.');
        this.spinner.hide();

      });
}
commisionReport(varr){

  this.spinner.show();
  this.http.
    post(`${environment.apiUrl}/api/Reports/Commission_Report`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.commissionReport = this.response.data;
          this.commissionReportFilter = [...this.commissionReport]
          this.commissionRsum= this.commissionReport.reduce((prev,next)=>prev+parseFloat(next.amount),0);


       this.spinner.hide();
        }
        else if(this.kickbackReport.length == 0) {
          this.toastr.error("No such Contract Exist", 'Message.');
       this.spinner.hide();
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
       this.spinner.hide();
        }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(),'Message.');
        this.spinner.hide();

      });
}
fetchContractInvise() {
  this.contractWise.startDate = this.dateformater.toModel(this.contractWise.startDate)
  this.contractWise.endDate = this.dateformater.toModel(this.contractWise.endDate)
  this.spinner.show();
  this.http
  .get(`${environment.apiUrl}/api/Reports/AllBillingReportContractWise/`+   this.contractWise.startDate + '/' +this.contractWise.endDate)
  .subscribe(res => {
    this.response = res;

  if(this.response.success==true)
  {
this.spinner.hide();

  this.contractWise=this.response.data.getBillReport;
  this.contractWise=this.contractWise.sort((a, b) => parseInt(b.price) - parseInt(a.price));
  this.contractTotal = this.response.data.totalcommisionamount +' ' + this.contractWise[0].rateCurrencyName;
  this.contractTotal= parseFloat(this.contractTotal).toLocaleString()
 this.contractBill = [...this.contractWise]
console.log(this.contractWise)


  }
  else{
    this.toastr.error(this.response.message, 'Message.');
    this.spinner.hide();

  }

  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');
this.spinner.hide();

    }
  });
}

  invoiceExcelFile(){
    const filtered = this.billingReportInvoiceWise.map(row => ({
      BillFor: row.billFor,
      Article: row.articleName + row.construction,
      ContractNumber: row.contractNo,
      CotractDate: row.contractDate ,
      BillDate: row.billDate,
      BillNumber: row.billNo,
      Buyer: row.buyerName ,
      Seller: row.sellerName,
      InvoiceNumber:row.invoiceNo,
      InvoiceDate:row.invoiceDate,
      Rate: row.rate +row.uomName,
      CommPer: row.fabcotCommission +' '+ row.commissionUomName  ,
      Quantity: row.quantity,
      QtyUOM:row.quantityUOMName,

      CommAmount: row.commissionAmount + row.rateCurrencyName ,
    }));

    this.service.exportAsExcelFile(filtered, 'Bill Report(Invoice Wise)');

  }
  invoiceExcelFileB(){
    const filtered = this.billingReportInvoiceWise.map(row => ({
      BillFor: row.billFor,
      Article: row.articleName + row.construction,
      ContractNumber: row.contractNo,
      CotractDate: row.contractDate ,
      BillDate: row.billDate,
      BillNumber: row.billNo,
      Buyer: row.buyerName ,
      Seller: row.sellerName,
      InvoiceNumber:row.invoiceNo,
      Rate: row.rate +row.uomName,
      CommPer:row.commissionUomName == null? row.fabcotCommission +' '+ row.quantityUOMName :row.fabcotCommission +' '+row.commissionUomName ,
      Quantity: row.quantity,
      QtyUOM:row.quantityUOMName,

      CommAmount: row.commissionAmount + row.rateCurrencyName ,
    }));

    this.service.exportAsExcelFile(filtered, 'Bill Report(Invoice Wise)');

  }
  invoiceExcelFileYarnlocal(){
    const filtered = this.billingReportInvoiceWise.map(row => ({
      BillFor: row.billFor,
      Article: row.articleName + row.construction,
      ContractNumber: row.contractNo,
      CotractDate: row.contractDate ,
      BillDate: row.billDate,
      BillNumber: row.billNo,
      Buyer: row.buyerName ,
      Seller: row.sellerName,
      InvoiceNumber:row.invoiceNo,
      Rate: row.rate +row.uomName,
      CommPer: row.fabcotCommission +' '+ (row.commissionUomName == null || row.commissionUomName == ""  ?'%':row.commissionUomName),
      Quantity: row.debitQuantity == null || row.debitQuantity == "" ?  row.quantity:  row.remainingQuantity  ,
      QtyUOM:row.quantityUOM,

      CommAmount:row.debitAmount == null || row.debitAmount == "" ? row.commissionAmount + row.rateCurrencyName : row.crdbCommission + " " + row.rateCurrencyName,
    }));

    this.service.exportAsExcelFile(filtered, 'Bill Report(Invoice Wise)');
  }
  openContractExcelFile(){
    const filtered = this.rows.map(row => ({
    Age:row.age,
    ContractNo: row.contractNo,
  
    Buyer: row.buyerName,
    Seller: row.sellerName ,
    Date: row.date,
    PONumber: row.poNumber,
    Article: this.loggedInDepartmentName =='Yarn Export' || this.loggedInDepartmentName =='Yarn Export Bangladesh' ? row.articlesPlusRate:row.articleName ,
    Rate: row.rate,
      RateUOM: row.rateUOMName ,
  
      QtyUOM:row.quantityUOMName,
      BookingQty: row.booking ,
      
      DispatchQty: row.dispatch,
      BalanceQty: row.balanceQty,
      Cost: parseFloat(row.cost) ,
      SellerComm: this.loggedInDepartmentName =='Yarn Export' || this.loggedInDepartmentName =='Yarn Export Bangladesh' ? parseFloat(row.sellerCommission) :row.sellerCommission + "[" + row.sellerCommissionAmount + "]" ,
      BuyerComm: row.buyerCommission + "[" + row.buyerCommissionAmount + "]" ,
    PaymentTermSellerAndBuyer : row.paymentTerm, 
    Agent: row.agent ,

      Status: row.status 

     
    }));

    this.service.exportAsExcelFile(filtered, 'Open Contract Report');

  }
  cancleContractExcelFile(){
    const filtered = this.cancelContract.map(row => ({
    Age:row.age,
    ContractNo: row.contractNo,
    Buyer: row.buyerName,
    Seller: row.sellerName ,
    Date: row.date,
    PONumber: row.poNumber,
    Article: row.articleName ,
    Rate: row.rate,
      RateUOM: row.rateUOMName ,
  Container : row.containerName,
      Quantity: row.balanceQty,
      QtyUOM:row.uomName,
      Booking: row.booking ,
      Cost:row.cost,
      Dispatch: row.dispatch ,
      Balance: row.balanceQty ,
      PaymentTermSellerAndBuyer : row.paymentTerm,
      SellerComm : row.sellerCommission,
      BuyerComm : row.buyerCommission, 
      Status:row.status

    }));

    this.service.exportAsExcelFile(filtered, 'Cancle Contract Report');

  }
  contractExcelFileyarn(){

    this.contractWise=this.contractWise.sort((a, b) => parseInt(a.billNo) - parseInt(b.billNo));
    const filtered = this.contractWise.map(row => ({
      BillFor: row.billFor,
      Article: row.articleName,
      ContractNumber: row.contractNo +'('+row.manualContractNumber+')',
      // ManualContractNumber: row.manualContractNumber,
      CotractDate: row.contractDate,
      BillDate: row.billDate ,
      BillNumber: row.billNo,
      Buyer: row.buyerName ,
      Seller: row.sellerName,
      Rate: row.rate +''+ row.uomName,
      CommPer: row.fabcotCommission +' '+ row.quantityUOMName ,
      Quantity:row.debitQuantity == null || row.debitQuantity == "" || row.debitQuantity == 0 ? row.quantity:  (row.quantity -  row.debitQuantity),
      QtyUOM:row.quantityUOM,
      CommAmount:  row.commissionAmount  +' '+ row.rateCurrencyName,
      // row.debitAmount == null || row.debitAmount == "" ? row.commissionAmount +' '+ row.rateCurrencyName  : row.debitAmount + '-' + row.commissionAmount,
  
    }));
    filtered.push({
      "BillFor":'',
      "Article":'',
      "ContractNumber":'',
      "CotractDate":'',
      "BillDate":'',
      "BillNumber":'',
      "Buyer":'',
      "Seller":'',
      "Rate":'',
      "CommPer":'',
      "Quantity":'',
      "QtyUOM":'TotalComAmount',
      "CommAmount":this.contractTotal +' '+'PKR',
    })
    this.service.exportAsExcelFile(filtered, 'Bill Report(Contract Wise)');

  }

  contractExcelFile(){

    // this.contractWise.push({
    //   "BillFor":'',
    //   "Article":'',
    //   "ContractNumber":'',
    //   "CotractDate":'',
    //   "BillDate":'',
    //   "BillNumber":'',
    //   "Buyer":'',
    //   "Seller":'',
    //   "Rate":'',
    //   "CommPer":'',
    //   "Quantity":'',
    //   "QtyUOM":'TotalComAmount',
    //   "CommAmount":this.contractTotal ,
    // })

    this.contractWise=this.contractWise.sort((a, b) => parseInt(a.billNo) - parseInt(b.billNo));
    const filtered = this.contractWise.map(row => ({
      BillFor: row.billFor,
      Article: row.articleName,
      ContractNumber: row.contractNo +'('+row.manualContractNumber+')',
      // ManualContractNumber: row.manualContractNumber,
      CotractDate: row.contractDate,
      BillDate: row.billDate ,
      BillNumber: row.billNo,
      Buyer: row.buyerName ,
      Seller: row.sellerName,
      Rate: row.rate +''+ row.uomName,
      CommPer: row.fabcotCommission + '%' ,
      Quantity: row.quantity,
      QtyUOM:row.quantityUOMName,
      CommAmount: row.commissionAmount +' '+ row.rateCurrencyName ,
  
    }));
    filtered.push({
      "BillFor":'',
      "Article":'',
      "ContractNumber":'',
      "CotractDate":'',
      "BillDate":'',
      "BillNumber":'',
      "Buyer":'',
      "Seller":'',
      "Rate":'',
      "CommPer":'',
      "Quantity":'',
      "QtyUOM":'TotalComAmount',
      "CommAmount":this.contractTotal +' '+'PKR',
    })
    this.service.exportAsExcelFile(filtered, 'Bill Report(Contract Wise)');

  }
  paymentExcelFile(){
    const filtered = this.paymentReport.map(row => ({
      ContractNo: row.autoContractNo,
      InvNo: row.saleInvoiceNo,
      InvDate: row.saleInvoiceDateToDisplay ,
      Buyer: row.buyerName,
      Seller: row.sellerName,
      Quantity: row.quantity ,
      InvoiceAmount: row.amount,
      Received: row.received ,
    
      Balance: row.balance,
      Aging:row.age,
    
    }));

    this.service.exportAsExcelFile(filtered, 'PaymentReport');

  }
  dbCrExcelFile(){
    const filtered = this.DbCrData.map(row => ({
      ContractNo: row.autoContractNumber,
      InvNo: row.saleInvoiceNo,
      InvDate: row.saleInvoiceDateToDisplay ,
      Buyer: row.buyerName,
      Seller: row.sellerName,
      Date:row.date,
      Note:row.dC_Note,
      Article: row.article ,
      
      Quantity: row.quantity ,
      Amount: row.amount,
      Remarks: row.remarks,
    
    }));

    this.service.exportAsExcelFile(filtered, 'DebitCreditExcelFile');

  }
  kickbackExcelFile(){
    const filtered = this.kickbackReport.map(row => ({
    Age:row.age,
    ContractNo: row.contractNo,
    Buyer: row.buyerName,
    Seller: row.sellerName ,
    Date: row.date,
    PONumber: row.poNumber,
    Article: row.articleName ,
    Rate: row.rate,
  Container : row.containerName,
   PaymenTerms:row.paymentTerm,
      QtyUnit:row.uomName,
      Booking: row.booking ,
      Cost:row.cost,
      Dispatch: row.dispatch ,
      Balance: row.balanceQty ,
      SellerComm : row.sellerCommission,
      BuyerComm : row.buyerCommission, 
      Agent:row.agent,
      Status:row.status

    }));

    this.service.exportAsExcelFile(filtered, 'Contract Kickback Report');

  }
  commsionExcelFile(){
    const filtered = this.commissionReport.map(row => ({
    ContractNo: row.contractNo,
    ContractDate: row.contractDate,
    BillNo: row.billNo,
    BillFor: row.billFor,
    BLDate: row.blDate,

    Buyer: row.buyer,
    Seller: row.seller ,
    SaleInvNo: row.saleInvoiceNo,
    SaleInvDate: row.saleInvoiceDate,
    paymentTerms: row.paymentTerm,
    Article: row.article ,
    Quantity: row.quantity,

    Amount: row.amount,
  Received : row.received,
  Balance : row.balance,
   
      PaymentTerms:row.paymentTerms,
      Commission: row.commission ,
  

    }));

    this.service.exportAsExcelFile(filtered, 'Contract Kickback Report');

  }
  openContractPdf() {

    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'Landscape',
      info: {
        title: 'Open Contract List'
      },
      content: [
        {
          text: 'Open Contract List',
          style: 'heading',

        },
        {
          margin: [-30 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [20, 50, 50, 40 , 30 , 25 , 35 , 30 , 30 , 30 , 40 , 40 , 30 , 30 , 30 , 30 , 30 , 30, 30 
            ],
            body:[
              [
                {text:'Age' , style:'tableHeader' }
              ,{text:'Contract#' , style:'tableHeader'} ,
              {text:'Buyer' , style:'tableHeader' }, 
              {text:'Seller' , style:'tableHeader' }, 
              {text:'Date'  , style:'tableHeader'} , 
              {text:'PO#' , style:'tableHeader'} , 
              {text:'Article' , style:'tableHeader'},
              {text:'Rate'  , style:'tableHeader'} , 
              {text:'Qty Unit' , style:'tableHeader'} , 
              {text:'Booking' , style:'tableHeader'},
              {text:'Dispatch'  , style:'tableHeader'} , 
              {text:'Balance' , style:'tableHeader'} , 
              {text:'Cost' , style:'tableHeader'} , 
              {text:'SellerComm' , style:'tableHeader'} , 
              {text:'SellerComm Amount' , style:'tableHeader'} , 
              {text:'BuyerComm' , style:'tableHeader'} ,
              {text:'BuyerComm Amount' , style:'tableHeader'} , 
              {text:'PaymentTerm(S|B)' , style:'tableHeader'} , 
              {text:'Agent' , style:'tableHeader'} 

            ],
              ...this.rows.map(row => (
                [
                  {text: row.age , style:'tableHeader2'} ,
                {text:  row.contractNo , style:'tableHeader2'},
                {text: row.buyerName, style:'tableHeader2'} ,
                {text: row.sellerName , style:'tableHeader2'} ,
                 {text: row.date, style:'tableHeader2'} ,
                  {text:row.poNumber  , style:'tableHeader2' }  ,
                  {text: row.articleName , style:'tableHeader2'},
           
                 {text: row.rate + " " + row.rateUOMName, style:'tableHeader2'} ,
                  {text:row.quantityUOMName  , style:'tableHeader2' }  ,
                  {text: row.booking + " " + row.quantityUOMName , style:'tableHeader2'},
              
                   {text:row.dispatch + " " + row.quantityUOMName , style:'tableHeader2' }  ,
                   {text:row.balanceQty + " " + row.quantityUOMName  , style:'tableHeader2' }  ,
                   {text: row.rateCurrencyName == 'PKR' ? "Rs." + row.cost : row.rateCurrencyName == 'USD' ? "$ " + row.cost : row.rateCurrencyName == 'EUR' ? "€ " + row.cost : row.rateCurrencyName == 'GBP' ? "GBP " + row.cost : row.cost, style:'tableHeader2'} ,
                   {text:  row.sellerCommission == "" ?  "" : this.loggedInDepartmentName =='Yarn Export'? row.rateCurrencyName +' '+ row.sellerCommission: row.sellerCommission + "%"   , style:'tableHeader2' }  ,
                   {text:   row.sellerCommissionAmount != '' ?   row.rateCurrencyName == 'PKR' ? "Rs." + "[" + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'USD' ? "$ " + "[" + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'EUR' ? "€ " + "[" + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'GBP' ? "GBP " + "[" + row.sellerCommissionAmount + "]" :  row.sellerCommissionAmount  : row.sellerCommissionAmount , style:'tableHeader2'} ,

                   {text:row.buyerCommission != "" ? row.buyerCommission + "%" : ""   , style:'tableHeader2' }  ,
                   {text: row.buyerCommissionAmount != '' ?  row.rateCurrencyName == 'PKR' ? "Rs." + "[" + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'USD' ? "$ " + "[" + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'EUR' ? "€ " + "[" + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'GBP' ? "GBP " + "[" + row.buyerCommissionAmount + "]" :  row.buyerCommissionAmount  :  row.buyerCommissionAmount  , style:'tableHeader2'} ,
                   {text: row.paymentTerm , style:'tableHeader2'},
                   {text:row.agent  , style:'tableHeader2' }  

                ]
              ))
            ]
          }
        },
      ],
      styles: {
        heading: {
          fontSize: 13,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 6},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 5},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }



  billingInvoicePdf() {

this.fetch();


    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Billing Invoice List'
      },
      content: [
        {
          text: 'Billing Invoice  List',
          style: 'heading',

        },
        {
          margin: [-20 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [23, 40, 33, 39 , 39 , 20 , 45 , 45 , 30 , 33 , 30 , 35 , 40
            ],
            body:[
              [
                {text:'Bill For' , style:'tableHeader' }
              ,{text:'Article' , style:'tableHeader'} ,
              {text:'Contract#' , style:'tableHeader' }, 
              {text:'Contract Date' , style:'tableHeader' }, 

              {text:'Bill Date'  , style:'tableHeader'} , 
              {text:'Bill#' , style:'tableHeader'} , 
              {text:'Seller' , style:'tableHeader'},
              
              {text:'Buyer'  , style:'tableHeader'} , 
              {text:'Rate' , style:'tableHeader'} , 
              {text:'Comm%' , style:'tableHeader'},
              {text:'Inv#'  , style:'tableHeader'} , 
              {text:'Quantity' , style:'tableHeader'} , 
              {text:'Comm Amount' , style:'tableHeader'} , 
            ],
              ...this.billingReportInvoiceWise.map(row => (
                [
                  {text: row.billFor , style:'tableHeader2'} ,
                {text:  row.articleName , style:'tableHeader2'},
                {text: row.contractNo, style:'tableHeader2'} ,
                {text: row.contractDate , style:'tableHeader2'} ,
                 {text: row.billDate, style:'tableHeader2'} ,
                  {text:row.billNo  , style:'tableHeader2' }  ,
                  {text: row.sellerName , style:'tableHeader2'},
           
                 {text: row.buyerName , style:'tableHeader2'} ,
                  {text:row.rate +' '+ row.uomName , style:'tableHeader2' }  ,
                  {text: row.fabcotCommission +'%' , style:'tableHeader2'},
              
                   {text:row.invoiceNo  , style:'tableHeader2' }  ,
                   {text: row.debitQuantity == null || row.debitQuantity == "" ?  row.quantity + " " + row.quantityUOM :  row.remainingQuantity + '\n' +  row.quantity  + '-' + row.debitQuantity  + row.quantityUOM , style:'tableHeader2' }  ,

                   {text: row.debitAmount == null || row.debitAmount == "" ?  row.commissionAmount + " " + row.rateCurrencyName :  row.crdbCommission + " " + row.rateCurrencyName
                    , style:'tableHeader2' }  ,
                ]
              ))
            ]
          }
        },
        {text: "Total Comm Amount: " , bold: true , margin:[340 , 20,0,0] ,style:'totalAmount' },
        {text: this.invoiceTotal , bold: true , margin:[420 , -9,0,0] ,style:'totalAmount' }
      ],
      styles: {
        heading: {
          fontSize: 13,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        },
        totalAmount:{
          fontSize:8
              },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 7},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 6},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }
  billingInvoicePdf2() {
    // for(let i=0;i<=this.billingReportInvoiceWise.length; i++){
    //   this.invoiceTotal += this.billingReportInvoiceWise[i].totalCommisson
     
    // }
    //this.invoiceTotal =this.billingReportInvoiceWise.reduce((accumulator, current) => accumulator + current.totalCommisson, 0);
    this.invoiceTotal =this.invoiceTotal; 
    let docDefinition = {
      pageSize: 'A4',
     
      info: {
        title: 'Billing Invoice List'
      },
      content: [
        {
          text: 'Billing Invoice  List' ,
          style: 'heading',

        },
        {
          text:  this.month != null && this.year != null ? '(' + this.month + '-' +this.year + ')' : '',
          style: 'heading2',

        },
        {
          margin: [-20 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [ 50, 39, 34 , 34 , 20 , 50 , 50 , 30 , 33 , 30 , 35 , 40
            ],
            body:[
              [
                
              {text:'Article' , style:'tableHeader'} ,
              {text:'Contract#' , style:'tableHeader' }, 
              {text:'Contract Date' , style:'tableHeader' }, 

              {text:'Bill Date'  , style:'tableHeader'} , 
              {text:'Bill#' , style:'tableHeader'} , 
              {text:'Seller' , style:'tableHeader'},
              
              {text:'Buyer'  , style:'tableHeader'} , 
              {text:'Rate' , style:'tableHeader'} , 
              {text:'Comm%' , style:'tableHeader'},
              {text:'Inv#'  , style:'tableHeader'} , 
              {text:'Quantity' , style:'tableHeader'} , 
              {text:'Comm Amount' , style:'tableHeader'} 
            ],
              ...this.billingReportInvoiceWise.map(row => (
                [
                
                {text:  row.articleName + row.construction , style:'tableHeader2'},
                {text: row.contractNo, style:'tableHeader2'} ,
                {text: row.contractDate , style:'tableHeader2'} ,
                 {text: row.billDate, style:'tableHeader2'} ,
                  {text:row.billNo  , style:'tableHeader2' }  ,
                  {text: row.sellerName , style:'tableHeader2'},
           
                 {text: row.buyerName , style:'tableHeader2'} ,
                  {text: row.rate != '' ? row.rateCurrencyName == 'PKR' ?'Rs ' + row.rate + '/' + row.uomName : row.rateCurrencyName == 'USD' ? '$ ' + row.rate + '/' +row.uomName : row.rateCurrencyName == 'EUR' ? '€ ' + row.rate + '/' +row.uomName : row.rateCurrencyName == 'GBP' ? 'GBP ' + row.rate + '/' +row.uomName : row.rateCurrencyName + row.rate + " /" + row.uomName : '' , style:'tableHeader2' }  ,
                  {text: row.commissionUomName == null || row.commissionUomName ==""? row.fabcotCommission +' '+ row.quantityUOMName: row.fabcotCommission +' '+ row.commissionUomName, style:'tableHeader2'},
              
                   {text:row.invoiceNo  , style:'tableHeader2' }  ,
                   {text:   row.quantity + ' ' + row.quantityUOM  , style:'tableHeader2' }  ,

                   {text:row.commissionAmount != '' ? row.rateCurrencyName == 'PKR' ?  row.commissionAmount +' Rs' : row.rateCurrencyName == 'USD' ? row.commissionAmount + ' $' : row.rateCurrencyName == 'EUR' ? row.commissionAmount + ' €': row.rateCurrencyName == 'GBP' ? row.commissionAmount + ' GBP' : row.commissionAmount + " " + row.rateCurrencyName : '' 
                    , style:'tableHeader2' }  
                ]
              ))
            ]
          }
        },
        {text: "Total Comm Amount: " , bold: true , margin:[340 , 20,0,0] ,style:'totalAmount' },
        {text: this.invoiceTotal , bold: true , margin:[420 , -9,0,0] ,style:'totalAmount' }
      ],
      styles: {
        heading: {
          fontSize: 12,
          alignment: 'center',
          margin: [0, 9, 0, 4]
        },
        heading2: {
          fontSize: 10,
          alignment: 'center',
          margin: [0, 2, 0, 9]
        },
        totalAmount:{
          fontSize:8
              },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 7},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 6},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }


  billingInvoicePdf2b() {
    // for(let i=0;i<=this.billingReportInvoiceWise.length; i++){
    //   this.invoiceTotal += this.billingReportInvoiceWise[i].totalCommisson
     
    // }
    this.invoiceTotal =this.billingReportInvoiceWise.reduce((accumulator, current) => accumulator + current.totalCommisson, 0);
    this.invoiceTotal =this.invoiceTotal.toFixed(3); 
    let docDefinition = {
      pageSize: 'A4',
     
      info: {
        title: 'Billing Invoice List'
      },
      content: [
        {
          text: 'Billing Invoice  List' ,
          style: 'heading',

        },
        {
          text:  this.month != null && this.year != null ? '(' + this.month + '-' +this.year + ')' : '',
          style: 'heading2',

        },
        {
          margin: [-20 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [ 50, 39, 34 , 34 , 20 , 50 , 50 , 30 , 33 , 30 , 35 , 40
            ],
            body:[
              [
                
              {text:'Article' , style:'tableHeader'} ,
              {text:'Contract#' , style:'tableHeader' }, 
              {text:'Contract Date' , style:'tableHeader' }, 

              {text:'Bill Date'  , style:'tableHeader'} , 
              {text:'Bill#' , style:'tableHeader'} , 
              {text:'Seller' , style:'tableHeader'},
              
              {text:'Buyer'  , style:'tableHeader'} , 
              {text:'Rate' , style:'tableHeader'} , 
              {text:'Comm%' , style:'tableHeader'},
              {text:'Inv#'  , style:'tableHeader'} , 
              {text:'Quantity' , style:'tableHeader'} , 
              {text:'Comm Amount' , style:'tableHeader'} 
            ],
              ...this.billingReportInvoiceWise.map(row => (
                [
                
                {text:  row.articleName + row.construction , style:'tableHeader2'},
                {text: row.contractNo, style:'tableHeader2'} ,
                {text: row.contractDate , style:'tableHeader2'} ,
                 {text: row.billDate, style:'tableHeader2'} ,
                  {text:row.billNo  , style:'tableHeader2' }  ,
                  {text: row.sellerName , style:'tableHeader2'},
           
                 {text: row.buyerName , style:'tableHeader2'} ,
                  {text: row.rate != '' ? row.rateCurrencyName == 'PKR' ?'Rs ' + row.rate + '/' + row.uomName : row.rateCurrencyName == 'USD' ? '$ ' + row.rate + '/' +row.uomName : row.rateCurrencyName == 'EUR' ? '€ ' + row.rate + '/' +row.uomName : row.rateCurrencyName == 'GBP' ? 'GBP ' + row.rate + '/' +row.uomName : row.rateCurrencyName + row.rate + " /" + row.uomName : '' , style:'tableHeader2' }  ,
                  {text: row.commissionUomName == null ?row.fabcotCommission +' '+  row.quantityUOMName:row.fabcotCommission +' '+row.commissionUomName, style:'tableHeader2'},
              
                   {text:row.invoiceNo  , style:'tableHeader2' }  ,
                   {text:   row.quantity + ' ' + row.quantityUOM  , style:'tableHeader2' }  ,

                   {text:row.commissionAmount != '' ? row.rateCurrencyName == 'PKR' ?  row.commissionAmount +' Rs' : row.rateCurrencyName == 'USD' ? row.commissionAmount + ' $' : row.rateCurrencyName == 'EUR' ? row.commissionAmount + ' €': row.rateCurrencyName == 'GBP' ? row.commissionAmount + ' GBP' : row.commissionAmount + " " + row.rateCurrencyName : '' 
                    , style:'tableHeader2' }  
                ]
              ))
            ]
          }
        },
        {text: "Total Comm Amount: " , bold: true , margin:[340 , 20,0,0] ,style:'totalAmount' },
        {text: this.invoiceTotal , bold: true , margin:[420 , -9,0,0] ,style:'totalAmount' }
      ],
      styles: {
        heading: {
          fontSize: 12,
          alignment: 'center',
          margin: [0, 9, 0, 4]
        },
        heading2: {
          fontSize: 10,
          alignment: 'center',
          margin: [0, 2, 0, 9]
        },
        totalAmount:{
          fontSize:8
              },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 7},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 6},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }
  billingInvoicePdfFabriclocal() {
    // for(let i=0;i<=this.billingReportInvoiceWise.length; i++){
    //   this.invoiceTotal += this.billingReportInvoiceWise[i].totalCommisson
     
    // }
    this.invoiceTotal =this.billingReportInvoiceWise.reduce((accumulator, current) => accumulator + current.totalCommisson, 0);
    this.invoiceTotal =this.invoiceTotal.toFixed(3); 
    let docDefinition = {
      pageSize: 'A4',
     
      info: {
        title: 'Billing Invoice List'
      },
      content: [
        {
          text: 'Billing Invoice  List' ,
          style: 'heading',

        },
        {
          text:  this.month != null && this.year != null ? '(' + this.month + '-' +this.year + ')' : '',
          style: 'heading2',

        },
        {
          margin: [-20 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [ 50, 39, 34 , 34 , 20 , 50 , 50 , 30 , 33 , 30 , 35 , 40
            ],
            body:[
              [
                
              {text:'Article' , style:'tableHeader'} ,
              {text:'Contract#' , style:'tableHeader' }, 
              {text:'Contract Date' , style:'tableHeader' }, 

              {text:'Bill Date'  , style:'tableHeader'} , 
              {text:'Bill#' , style:'tableHeader'} , 
              {text:'Seller' , style:'tableHeader'},
              
              {text:'Buyer'  , style:'tableHeader'} , 
              {text:'Rate' , style:'tableHeader'} , 
              {text:'Comm%' , style:'tableHeader'},
              {text:'Inv#'  , style:'tableHeader'} , 
              {text:'Quantity' , style:'tableHeader'} , 
              {text:'Comm Amount' , style:'tableHeader'} 
            ],
              ...this.billingReportInvoiceWise.map(row => (
                [
                
                {text:  row.articleName + row.construction , style:'tableHeader2'},
                {text: row.contractNo, style:'tableHeader2'} ,
                {text: row.contractDate , style:'tableHeader2'} ,
                 {text: row.billDate, style:'tableHeader2'} ,
                  {text:row.billNo  , style:'tableHeader2' }  ,
                  {text: row.sellerName , style:'tableHeader2'},
           
                 {text: row.buyerName , style:'tableHeader2'} ,
                  {text: row.rate != '' ? row.rateCurrencyName == 'PKR' ?'Rs ' + row.rate + '/' + row.uomName : row.rateCurrencyName == 'USD' ? '$ ' + row.rate + '/' +row.uomName : row.rateCurrencyName == 'EUR' ? '€ ' + row.rate + '/' +row.uomName : row.rateCurrencyName == 'GBP' ? 'GBP ' + row.rate + '/' +row.uomName : row.rateCurrencyName + row.rate + " /" + row.uomName : '' , style:'tableHeader2' }  ,
                  {text: row.fabcotCommission +' '+ row.commissionUomName , style:'tableHeader2'},
              
                   {text:row.invoiceNo  , style:'tableHeader2' }  ,
                   {text:   row.debitQuantity = null ?  row.quantity + " " + row.quantityUOM :  row.remainingQuantity + '\n' +  row.quantity  + '-' + row.debitQuantity  + row.quantityUOM  , style:'tableHeader2' }  ,

                   {text:row.commissionAmount != '' ? row.rateCurrencyName == 'PKR' ?  row.commissionAmount +' Rs' : row.rateCurrencyName == 'USD' ? row.commissionAmount + ' $' : row.rateCurrencyName == 'EUR' ? row.commissionAmount + ' €': row.rateCurrencyName == 'GBP' ? row.commissionAmount + ' GBP' : row.commissionAmount + " " + row.rateCurrencyName : '' 
                    , style:'tableHeader2' }  
                ]
              ))
            ]
          }
        },
        {text: "Total Comm Amount: " , bold: true , margin:[340 , 20,0,0] ,style:'totalAmount' },
        {text: this.invoiceTotal , bold: true , margin:[420 , -9,0,0] ,style:'totalAmount' }
      ],
      styles: {
        heading: {
          fontSize: 12,
          alignment: 'center',
          margin: [0, 9, 0, 4]
        },
        heading2: {
          fontSize: 10,
          alignment: 'center',
          margin: [0, 2, 0, 9]
        },
        totalAmount:{
          fontSize:8
              },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 7},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 6},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }
  billingContractPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Billing Contract Wise List'
      },
      content: [
        {
          text: 'Billing Contract Wise  List',
          style: 'heading',

        },
        {
          margin: [-20 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [23, 45, 37,45 , 45 , 20 , 45 , 45 , 24 , 33  , 35 , 33
            ],
            body:[
              [
                {text:'Bill For' , style:'tableHeader' }
              ,{text:'Article' , style:'tableHeader'} ,
              {text:'Contract#' , style:'tableHeader' }, 
              //{text:'Manual#' , style:'tableHeader' }, 
              {text:'Contract Date' , style:'tableHeader' }, 

              {text:'Bill Date'  , style:'tableHeader'} , 
              {text:'Bill#' , style:'tableHeader'} , 
              {text:'Seller' , style:'tableHeader'},
              
              {text:'Buyer'  , style:'tableHeader'} , 
              {text:'Rate' , style:'tableHeader'} , 
              {text:'Comm%' , style:'tableHeader'},
              
              {text:'Quantity' , style:'tableHeader'} , 
              {text:'Comm Amount' , style:'tableHeader'} , 
            ],
              ...this.contractWise.map(row => (
                [
                  {text: row.billFor , style:'tableHeader2'} ,
                {text:  row.articleName , style:'tableHeader2'},
                {text: row.contractNo +'('+ row.manualContractNumber +')', style:'tableHeader2'} ,
                //{text: row.manualContractNumber, style:'tableHeader2'} ,
                //{text: row.contractNo, style:'tableHeader2'} ,
                {text: row.contractDate , style:'tableHeader2'} ,
                 {text: row.billDate, style:'tableHeader2'} ,
                  {text:row.billNo  , style:'tableHeader2' }  ,
                  {text: row.sellerName , style:'tableHeader2'},
           
                 {text: row.buyerName , style:'tableHeader2'} ,
                  {text:row.rate != '' ? row.rateCurrencyName == 'PKR' ?  row.rate +'Rs' : row.rateCurrencyName == 'USD' ? row.rate + '$' : row.rateCurrencyName == 'EUR' ? row.rate + '€': row.rateCurrencyName == 'GBP' ? row.rate + 'GBP' : row.rate + " " + row.rateCurrencyName : '' , style:'tableHeader2'  }  ,
                  {text: row.fabcotCommission +' '+ row.quantityUOMName , style:'tableHeader2'},
              
               
                   {text: row.debitQuantity == null || row.debitQuantity == "" ?row.quantity: row.quantity  + '-' + row.debitQuantity  + " " + row.quantityUOM  , style:'tableHeader2' }  ,

                   {text: row.commissionAmount != '' ? row.rateCurrencyName == 'PKR' ?  row.commissionAmount +'Rs' : row.rateCurrencyName == 'USD' ? row.commissionAmount + '$' : row.rateCurrencyName == 'EUR' ? row.commissionAmount + '€': row.rateCurrencyName == 'GBP' ? row.commissionAmount + 'GBP' : row.commissionAmount + " " + row.rateCurrencyName : '' , style:'tableHeader2' }  ,
                ]
              ))
            ]
          }
        },
        {text: "Total Comm Amount: " , bold: true , margin:[340 , 20,0,0] ,style:'totalAmount' },
        {text: this.contractTotal , bold: true , margin:[420 , -9,0,0] ,style:'totalAmount' }
      ],
      styles: {
        heading: {
          fontSize: 13,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        },
        totalAmount:{
          fontSize:8
              },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 7},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 6},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }

  agentBookingPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Agent Booking List'
      },
      content: [
        {
          text: 'Agent Booking List',
          style: 'heading',

        },
        {
          margin: [40 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [70, 120, 120, 90 
            ],
            body:[
              [
                {text:'Agent' , style:'tableHeader' }
              ,{text:'Contracts' , style:'tableHeader'} ,
              {text:'Commission' , style:'tableHeader' }, 
              {text:'Quantity' , style:'tableHeader' }
            ],
              ...this.agentBookingStatus.map(row => (
                [
                  {text: row.agentName , style:'tableHeader2'} ,
                {text:  row.contracts , style:'tableHeader2'},
                {text: row.commission, style:'tableHeader2'} ,
                 {text: row.quantity, style:'tableHeader2'} ,
             
                ]
              ))
            ]
          }
        },
      ],
      styles: {
        heading: {
          fontSize: 13,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 8},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 7},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }
  cancelContractPdf() {

    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'Landscape',
      info: {
        title: 'Cancel Contract List'
      },
      content: [
        {
          text: 'Cancel Contract List',
          style: 'heading',

        },
        {
          margin: [-30 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [20, 30, 35, 35 , 30 , 23 , 30 , 25, 20 , 25 , 25 , 25 , 25 , 29 , 32 , 29 , 32 , 40 , 23 , 33 , 33 
            ],
            body:[
              [
                {text:'Age' , style:'tableHeader' }
              ,{text:'Contract#' , style:'tableHeader'} ,
              {text:'Buyer' , style:'tableHeader' }, 
              {text:'Seller' , style:'tableHeader' }, 

              {text:'Date'  , style:'tableHeader'} , 
              {text:'PO#' , style:'tableHeader'} , 
              {text:'Article' , style:'tableHeader'},
              
              {text:'Rate'  , style:'tableHeader'} , 
              {text:'Qty Unit' , style:'tableHeader'} , 
              {text:'Booking' , style:'tableHeader'},
              {text:'Dispatch'  , style:'tableHeader'} , 
              {text:'Balance' , style:'tableHeader'} , 
              {text:'Cost' , style:'tableHeader'} , 
              {text:'Seller Comm' , style:'tableHeader'} , 
              {text:'SellerComm Amount' , style:'tableHeader'} , 
              {text:'Buyer Comm' , style:'tableHeader'} ,
              {text:'BuyerComm Amount' , style:'tableHeader'} , 
              {text:'PaymentTerm(S|B)' , style:'tableHeader'} , 
              {text:'Agent' , style:'tableHeader'} ,
              {text:'Canceled By' , style:'tableHeader'} ,
              {text:'Canceled On' , style:'tableHeader'} 
            
            ],
              ...this.cancelContract.map(row => (
                [
                  {text: row.age , style:'tableHeader2'} ,
                {text:  row.contractNo , style:'tableHeader2'},
                {text: row.buyerName, style:'tableHeader2'} ,
                {text: row.sellerName , style:'tableHeader2'} ,
                 {text: row.date, style:'tableHeader2'} ,
                  {text:row.poNumber  , style:'tableHeader2' }  ,
                  {text: row.articleName , style:'tableHeader2'},
           
                 {text: row.rate + " " + row.rateUOMName, style:'tableHeader2'} ,
                 {text:row.containerName  , style:'tableHeader'} ,
                  {text: row.uomName = null ? '' : row.uomName  , style:'tableHeader2' }  ,
                  {text: row.booking , style:'tableHeader2'},
              
                   {text:row.dispatch  , style:'tableHeader2' }  ,
                   {text:row.balanceQty  , style:'tableHeader2' }  ,
                   {text: row.rateCurrencyName == 'PKR' ? "Rs." + row.cost : row.rateCurrencyName == 'USD' ? "$ " + row.cost : row.rateCurrencyName == 'EUR' ? "€ " + row.cost : row.rateCurrencyName == 'GBP' ? "GBP " + row.cost : row.cost, style:'tableHeader2'} ,
                   {text:row.sellerCommission != "" ? row.sellerCommission + "%" : ""   , style:'tableHeader2' }  ,
                   {text:   row.sellerCommissionAmount != '' ?   row.rateCurrencyName == 'PKR' ? "Rs." + "[" + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'USD' ? "$ " + "[" + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'EUR' ? "€ " + "[" + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'GBP' ? "GBP " + "[" + row.sellerCommissionAmount + "]" :  row.sellerCommissionAmount  : row.sellerCommissionAmount , style:'tableHeader2'} ,

                   {text:row.buyerCommission != "" ? row.buyerCommission + "%" : ""   , style:'tableHeader2' }  ,
                   {text: row.buyerCommissionAmount != '' ?  row.rateCurrencyName == 'PKR' ? "Rs." + "[" + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'USD' ? "$ " + "[" + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'EUR' ? "€ " + "[" + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'GBP' ? "GBP " + "[" + row.buyerCommissionAmount + "]" :  row.buyerCommissionAmount  :  row.buyerCommissionAmount  , style:'tableHeader2'} ,
                   {text: row.paymentTerm , style:'tableHeader2'},
                   {text:row.agent  , style:'tableHeader2' }  ,
                   {text:row.contractOwner  , style:'tableHeader2' } , 
                   {text:row.updatedBy  , style:'tableHeader2' }  ,
                   {text:row.updatedOn  , style:'tableHeader2' }  


                ]
              ))
            ]
          }
        },
      ],
      styles: {
        heading: {
          fontSize: 13,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'left' ,fontSize: 7},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 6},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }
  paymentPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Payment Report List'
      },
      content: [
        {
          text: 'Payment Report List',
          style: 'heading',

        },
        {
          margin: [-10 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [40 , 27 , 45 , 40 , 40 , 40 , 45 , 45 , 40 , 40
            ],
            body:[
              [
                {text:'Contact#' , style:'tableHeader' }
              ,{text:'Inv #' , style:'tableHeader'} ,
              {text:'Inv Date' , style:'tableHeader' }, 
              {text:'Buyer' , style:'tableHeader' },
              {text:'Seller' , style:'tableHeader' }
              ,{text:'Quantity' , style:'tableHeader'} ,
              {text:'Inv Amount' , style:'tableHeader' }, 
              {text:'Received' , style:'tableHeader' },
              {text:'Balance' , style:'tableHeader' }
              ,
              {text:'Aging' , style:'tableHeader' }
            ],
              ...this.paymentReport.map(row => (
                [
                  {text: row.autoContractNo , style:'tableHeader2'} ,
                {text:  row.saleInvoiceNo , style:'tableHeader2'},
                {text: row.saleInvoiceDateToDisplay, style:'tableHeader2'} ,
                 {text: row.buyerName, style:'tableHeader2'} ,
                 {text: row.sellerName, style:'tableHeader2'} ,
                 {text: row.quantity, style:'tableHeader2'} ,
                 {text: row.amount, style:'tableHeader2'} ,
                 {text: row.received, style:'tableHeader2'} ,
                 {text: row.balance, style:'tableHeader2'} ,
                 {text: row.age, style:'tableHeader2'} ,

             
                ]
              ))
            ]
          }
        },
      ],
      styles: {
        heading: {
          fontSize: 13,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 8},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 7},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }
  
  // commissionPdf() {

  //   let docDefinition = {
  //     pageSize: 'A4',
  //     info: {
  //       title: 'Commission Report'
  //     },
  //     content: [
  //       {
  //         text: 'Commission Report',
  //         style: 'heading',

  //       },
  //       {
  //         margin: [-20 , 5 , 0 , 0 ],
  //         table:{
  //           headerRows : 1,
  //           widths : [ 35, 45, 40 , 30 , 45 , 40 , 40 , 30 , 35 , 30 , 30 , 35 , 30 , 30 , 30           ],
  //           body:[
  //             [
              
  //             ,{text:'Contract#' , style:'tableHeader'} ,
  //             ,{text:'Contract Date' , style:'tableHeader'} ,
  //             ,{text:'Bill#' , style:'tableHeader'} ,
  //             ,{text:'Bill For' , style:'tableHeader'} ,
  //             ,{text:'BL Date' , style:'tableHeader'} ,

  //             {text:'Buyer' , style:'tableHeader' }, 
  //             {text:'Seller' , style:'tableHeader' }, 

  //             {text:'Sale Inv#'  , style:'tableHeader'} , 
  //             {text:'Article' , style:'tableHeader'},
              
  //             {text:'Quantity'  , style:'tableHeader'} , 
  //             {text:'Amount' , style:'tableHeader'} , 
  //             {text:'Received' , style:'tableHeader'},
  //             {text:'Balance'  , style:'tableHeader'} , 
  //             {text:'Payment Terms' , style:'tableHeader'} , 
  //             {text:'Comm' , style:'tableHeader'} 
  //           ],
  //             ...this.commissionReport.map(row => (
  //               [
  //                 {text: row.contractNo , style:'tableHeader2'} ,
  //                 {text: row.contractDate , style:'tableHeader2'} ,
  //                 {text: row.billNo , style:'tableHeader2'} ,
  //                 {text: row.billFor , style:'tableHeader2'} ,
  //               {text:  row.blDate , style:'tableHeader2'},
  //               {text: row.buyer, style:'tableHeader2'} ,
  //               {text: row.seller , style:'tableHeader2'} ,
  //                {text: row.saleInvoiceNo, style:'tableHeader2'} ,
  //                 {text:row.article  , style:'tableHeader2' }  ,
  //                 {text: row.quantity , style:'tableHeader2'},
           
  //                {text: row.amount, style:'tableHeader2'} ,
  //                 {text:row.received  , style:'tableHeader2' }  ,
  //                 {text: row.balance , style:'tableHeader2'},
              
  //                  {text:row.paymentTerms  , style:'tableHeader2' }  ,
  //                  {text:row.commission  , style:'tableHeader2' }  ,
  //               ]
  //             ))
  //           ]
  //         }
  //       },
  //     ],
  //     styles: {
  //       heading: {
  //         fontSize: 13,
  //         alignment: 'center',
  //         margin: [0, 15, 0, 30]
  //       },
  //       tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 7},
  //       tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 6},
  //     }

  //   };
  //   pdfMake.createPdf(docDefinition).print();
  // }
  dbCrReportPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Debit Credit Report '
      },
      content: [
        {
          text: 'Debit Credit Report ',
          style: 'heading',

        },
        {
          margin: [-10 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [43 , 45 , 45 , 40 , 40 , 40 , 45 , 45 , 40 , 40
            ],
            body:[
              [
                {text:'Contact#' , style:'tableHeader' }
              ,{text:'Buyer' , style:'tableHeader'} ,
              {text:'Supplier' , style:'tableHeader' }, 
              {text:'Date' , style:'tableHeader' },
              {text:'Inv#' , style:'tableHeader' }
              ,{text:'D/C Note' , style:'tableHeader'} ,
              {text:'Article' , style:'tableHeader' }, 
              {text:'Quantity' , style:'tableHeader' },
              {text:'Amount' , style:'tableHeader' }
              ,
              {text:'Remarks' , style:'tableHeader' }
            ],
              ...this.DbCrData.map(row => (
                [
                  {text: row.autoContractNumber , style:'tableHeader2'} ,
                {text:  row.buyerName , style:'tableHeader2'},
                {text: row.sellerName, style:'tableHeader2'} ,
                 {text: row.date, style:'tableHeader2'} ,
                 {text: row.saleInvoiceNo, style:'tableHeader2'} ,
                 {text: row.dC_Note, style:'tableHeader2'} ,
                 {text: row.article, style:'tableHeader2'} ,
                 {text: row.quantity + row.quantityUOMName, style:'tableHeader2'} ,
                 {text: 
                  row.amount != '' ? row.rateCurrencyName == 'PKR' ?  row.amount +'Rs' : row.rateCurrencyName == 'USD' ? row.amount + '$' : row.rateCurrencyName == 'EUR' ? row.amount + '€': row.rateCurrencyName == 'GBP' ? row.amount + 'GBP' : row.amount + " " + row.rateCurrencyName : ''
                  
                  , style:'tableHeader2'} ,
                 {text: row.remarks, style:'tableHeader2'} ,

             
                ]
              ))
            ]
          }
        },
      ],
      styles: {
        heading: {
          fontSize: 13,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 8},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 7},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }
  agentPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'External Agents Report'
      },
      content: [
        {
          text: 'External Agents Report',
          style: 'heading',

        },
        {
          margin: [-20 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [35, 40, 40, 40 , 30 , 30 , 40 , 35 , 35 , 30  , 30 , 30 , 30 , 30
            ],
            body:[
              [
                {text:'Contract#' , style:'tableHeader' }
              ,{text:'Contract Date' , style:'tableHeader'} ,
              {text:'Buyer' , style:'tableHeader' }, 
              {text:'Seller' , style:'tableHeader' }, 

              {text:'Ext Agent'  , style:'tableHeader'} , 
              {text:'Inv#' , style:'tableHeader'} , 
              {text:'Inv Date' , style:'tableHeader'},
              {text:'Payment Terms' , style : 'tableHeader'},
              {text:'B/L Date'  , style:'tableHeader'} , 
              {text:'Article'  , style:'tableHeader'} , 

              {text:'Rate' , style:'tableHeader'} , 
              
              {text:'Quantity' , style:'tableHeader'} , 
              {text:'Comm%' , style:'tableHeader'},

              {text:'Comm Amount' , style:'tableHeader'} , 
            ],
              ...this.externalAgent.map(row => (
                [
                  {text: row.contractNo , style:'tableHeader2'} ,
                {text:  row.contractDate , style:'tableHeader2'},
                {text: row.buyer, style:'tableHeader2'} ,
                {text: row.seller , style:'tableHeader2'} ,
                 {text: row.ext_Agents, style:'tableHeader2'} ,
                  {text:row.saleInvoiceNo  , style:'tableHeader2' }  ,
                  {text: row.saleInvoiceDate , style:'tableHeader2'},
                  {text:row.paymentTerm , style:'tableHeader2'},
                 {text: row.blDate , style:'tableHeader2'} ,
                  {text:row.article  , style:'tableHeader2' }  , 
                  {text:   row.rateCurrencyName+" "+row.rate +  '/' + row.rateUOMName , style:'tableHeader2' }  , 
                   {text:row.quantity  + row.quantityUOMName   , style:'tableHeader2' }  ,
                   {text: row.commission != '' ?   row.commission + '%'  : '' , style:'tableHeader2' }  ,
                   {text:   row.rateCurrencyName + row.commissionAmount  , style:'tableHeader2' }  ,
                ]
              ))
            ]
          }
        },
        // {text: "Total Comm Amount: " , bold: true , margin:[320 , 20,0,0] ,style:'totalAmount' },
        // {text: "13" , bold: true , margin:[420 , -9,0,0] ,style:'totalAmount' }
      ],
      styles: {
        heading: {
          fontSize: 13,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        },
        totalAmount:{
          fontSize:8
              },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 7},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 6},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }
  clickEvent(){
    this.status = !this.status;
}

}
