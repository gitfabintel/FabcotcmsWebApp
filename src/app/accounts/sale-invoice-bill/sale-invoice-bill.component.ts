import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import pdfMake from "pdfmake/build/pdfmake";
import { ToWords } from 'to-words';
import { NgxSpinnerService } from 'ngx-spinner'
import { NgxNumToWordsService, SUPPORTED_LANGUAGE } from 'ngx-num-to-words';
import { BillBreakupComponent } from '../bill-breakup/bill-breakup.component';

@Component({
  selector: 'app-sale-invoice-bill',
  templateUrl: './sale-invoice-bill.component.html',
  styleUrls: ['./sale-invoice-bill.component.css']
})
export class SaleInvoiceBillComponent implements OnInit {
  rows: any = [];
  queryParems: any = {};
  data: any = {};
  invoicedata: any;
  response: any;
  lang: SUPPORTED_LANGUAGE = 'en';
  image2: any;
  image: any;
  billName:any;
  bNameDisplay:any;
  loggedInDepartmentName: string;
invNo : any
  amountInWorda: string;
  constructor(private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    public spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private ngxNumToWordsService: NgxNumToWordsService,
  ) { }

  ngOnInit(): void {
    this.http.get('/assets/fabcot.png', { responseType: 'blob' })
      .subscribe(res => {
        const reader = new FileReader();
        reader.onloadend = () => {
          var base64data = reader.result;
          console.log(base64data);
          this.image2 = base64data;
        }

        reader.readAsDataURL(res);
        console.log(res);
        this.image = res;

      });
      this.loggedInDepartmentName=localStorage.getItem('department');
    this.queryParems = this.route.snapshot.queryParams;
    this.data = this.queryParems.contractId;
    this.invNo = this.queryParems.invNo;
    this.billName =this.queryParems.billname;
      if(this.billName == "Cbill" || this.billName == "CFbill"){
        this.bNameDisplay ='SALES TAX INVOICE';
      }
      else if(this.billName == "Qbill"){
        this.bNameDisplay='QUALITY CLAIM BILL';
      }
      else{
        this.bNameDisplay ='SALES TAX INVOICE';
      }
    if (this.billName == "Cbill" || this.billName == "Qbill") {
this.getDataBreakup();
    }
    else {
      this.getData();
      
    }
  }
  getData() {
    this.spinner.show();
    this.http
      .get(`${environment.apiUrl}/api/BillingPayments/GetContractInvoiceBillById/` + this.queryParems.contractId +'/'+this.queryParems.billNumber +'/'+ this.queryParems.billfor)
      .subscribe(res => {
        this.response = res;

        if (this.response.success == true) {
          this.data = this.response.data;
          this.data.invoiceTaxAmountTotal=parseFloat(this.data.invoiceTaxAmountTotal).toFixed(2);
          //this.data.invoiceTaxAmountTotal=this.data.invoiceTaxAmountTotal.toFixed(2)
          this.amountInWorda = this.ngxNumToWordsService.inWords(this.data.invoiceTotalAmount, this.lang);

          // this.data.billAmount.toLocaleString('en-US');
          // this.data.invoiceTotalAmount.toLocaleString('en-US')
          console.log(this.data)
          this.spinner.hide();

        }
        else {
          this.toastr.error(this.response.message, 'Message.');
          this.spinner.hide();

        }

      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');
          this.spinner.hide();

        }
      });
  }
  getDataBreakup() {
    this.spinner.show();
    this.http
      .get(`${environment.apiUrl}/api/BillingPayments/BillBreakUpbyId/` + this.queryParems.contractId+'/'+this.queryParems.billNumber +'/'+this.billName)
      .subscribe(res => {
        this.response = res;

        if (this.response.success == true) {
          this.data = this.response.data;
          this.data.invoiceTaxAmountTotal=parseFloat(this.data.invoiceTaxAmountTotal).toFixed(2);
          //this.data.invoiceTaxAmountTotal=this.data.invoiceTaxAmountTotal.toFixed(2)
          this.amountInWorda = this.ngxNumToWordsService.inWords(this.data.invoiceTotalAmount, this.lang);
          // this.data.billAmount.toLocaleString('en-US');
          // this.data.invoiceTotalAmount.toLocaleString('en-US')
          console.log(this.data)
          this.spinner.hide();

        }
        else {
          this.toastr.error(this.response.message, 'Message.');
          this.spinner.hide();

        }

      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');
          this.spinner.hide();

        }
      });
  }
  billBreakup() {
    const modalRef = this.modalService.open(BillBreakupComponent, { centered: true });
    modalRef.componentInstance.contractId =this.queryParems.contractId;
    // modalRef.componentInstance.contractId = rows.billPaymentId;
    modalRef.result.then((data) => {

      if (data == true) {
      
      }

     
    }, (reason) => {
    });
  }
   formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

  print() {
    this.data.billAmount=Math.round(this.data.billAmount);
    this.data.billAmount=parseFloat(this.data.billAmount);
    this.data.billAmount=this.formatNumber(this.data.billAmount)
    this.data.invoiceTotalAmount=this.formatNumber(this.data.invoiceTotalAmount)
    this.data.invoiceTotalAmount.toLocaleString('en-US')
    this.data.invoiceTaxAmountTotal= Math.round(this.data.invoiceTaxAmountTotal)
    this.data.invoiceTaxAmountTotal=this.formatNumber(this.data.invoiceTaxAmountTotal)
    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [20, 30, 30, 10],
      pageOrientation: 'letter',

      info: {
        title: 'Bill generated'
      },
      content: [
        {
          "image": this.image2,
          fit: [140, 140]

        },
        {

          text: 'FABCOT INTERNATIONAL', style: 'heading', margin: [0, -30, 0, 0]

        },
        {
          margin: [0, 3, 0, 0],
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [
              [{ text: '133-Aurangzeb Block New Garden Town Lahore', style: 'headingC' }],]
          }
        },
        {
          margin: [0, 2, 0, 0],
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [
              [{ text:this.bNameDisplay, style: 'headingC' }],]
          }
        },
        {
          margin: [0, 1, 0, 0],
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [
              [{ text: 'PNTN No. P-1300724-6', style: 'headingC' }],]
          }
        },
        {
          margin: [0, 1, 0, 20],
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [
              [{ text: 'STRN: 3277876195292', style: 'headingC' }],]
          }
        },
        //   {
        //     layout:'noBorders',

        //     table:{headerRows:1 ,  widths:['18%' , '67%' , '5%' , '12%'],
        //   body:[ [
        //     {text: 'Seller :' , margin: [63 , 30 , 0 , 0] , bold:true , style:'common' } , {text: this.data['sellerName'] ,  margin: [0 , 30 , 0 , 0] , style:'common'},


        // ]]
        //   }
        //   },
        //   {

        //     layout:'noBorders',
        //     table:{headerRows:1 ,  widths:['18%' , '65%' , '10%' , '15%'],
        //   body:[ [{text: 'Buyer :' , margin: [63 , 4 , 0 , 0] , bold:true , style:'common'} , {text: this.data['buyerName'] , margin: [0 , 4 , 0 , 0] , bold:true  , style:'common'},

        // ]]
        //   }
        //   },
        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['8%', '50%', '8%', '50%'],
            body: [[{ text: 'Seller :', margin: [0, 0, 10, 0], bold: true, style: 'headingF' }, { text: this.data['sellerName'], margin: [-20, 0, 10, 0], style: 'headingF' },
            { text: 'Buyer :', bold: true, style: 'headingE' }, { text: this.data['buyerName'],margin:[-60,0,0,0] , style: 'headingF' }

            ]]
          }
        },
        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['8%', '50%', '8%', '40%'],
            body: [[{ text: 'Address :', margin: [0, 0, 0, 0], bold: true, style: 'headingF' }, { text: this.data['sellerBillingAddress'], margin: [-15, 0, 0, 0], style: 'headingF' },
            { text: 'Address :', bold: true,   style: 'headingE' }, { text: this.data['buyerBillingAddress'], style: 'headinG' }

            ]]
          }
        },

        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['20%', '38%', '20%', '50%'],
            body: [[{ text: 'Sales Tax Resgitration No :', bold:true, margin: [0, 0, 0, 0], style: 'headingF' }, { text: this.data['sellerGST'], margin: [-10, 0, 0, 0], bold: false, style: 'headingF' },
            { text: 'Sales Tax Resgitration No :', bold: true, style: 'headingE' }, { text: this.data['buyerGST'], margin:[-48,0,0,0]  ,  style: 'headingF' }

            ]]
          }
        },



        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['8%', '50%', '8%', '50%'],
            body: [[{ text: 'NTN No :', margin: [0, 0, 0, 0], bold: true, style: 'headingF' }, { text: this.data['sellerNTN'], margin: [-13, 0, 0, 0], bold: false, style: 'headingF' },
            { text: 'NTN No :', bold: true, style: 'headingE' }, { text: this.data['buyerNTN'], margin:[-50,0,0,0] ,  style: 'headingF' }

            ]]
          }
        },

          {


            layout:'noBorders',
            table:{headerRows:1 ,  widths:['15%' , '60%' ],
          body:[ [{text: 'Supplier Contract# :' , margin: [0 , 0 , 0 , 0] , bold:true , style:'headingF'} , {text: this.data['supplierContractNumber'] , margin: [-13 , 0 , 0 , 0]  , bold:false , style:'headingF'}

        ]]
          }
          },
        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['15%', '60%', '30%', '12%'],
            body: [[{ text: 'Fabcot Contract No :', margin: [0, 4, 0, 0], bold: true, style: 'headingF' }, { text: this.data['contractNumber'], margin: [-10, 4, 0, 0], style: 'headingF' },
            { text:this.billName == "Cbill" || this.billName == "CFbill"? 'Sales Tax Invoice No:':'', margin: [0, 4, 0, 0], bold: true, style: 'headingF' }, { text:this.billName == "Cbill" || this.billName == "CFbill"? this.data['billInvoiceNumber']:'', margin: [-85, 4, 0, 0], bold: true, style: 'headingF' },




            ]]
          }
        },

        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['15%', '65%', '33%', '12%'],
            body: [[{ text: 'Contract Date :', margin: [0, 2, 0, 0], bold: true, style: 'headingF' }, { text: this.data['contractDate'], margin: [-25, 4, 0, 0], style: 'headingF' },
            { text: 'Bill No#:', margin: [15, 2, 0, 0], bold: true, style: 'headingF' }, { text: this.data['billNumber'], margin: [-125, 4, 0, 0], style: 'headingF' }




            ]]
          }
        },

        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['90%', '15%'],
            body: [[{ text: 'Invoice Date :', margin: [428, 0, 0, 0], bold: true, style: 'headingF' }, { text: this.data['billInvoiceDate'], margin: [-13, 0, 0, 0], style: 'headingF' },


            ]]
          }
        },


        {
          margin: [0, 20, 0, 0],
          table: {
            headerRows: 1,
            widths: ['15%', '8.5%', '15%', '8.75%', '9.75%', '11.75%', '11.75%', '9%', '13%'],
            body: [

              [
                { text: 'Description', style: 'tableHeader' },
                { text: 'Sale Invoice#', style: 'tableHeader' }
                , { text: 'Sale Invoice Date', style: 'tableHeader' },
                { text: 'Quantity', style: 'tableHeader' },
                { text: 'Rate' + '(' + this.data.currencyName + ')', style: 'tableHeader' },

                { text: 'Commission  %age', style: 'tableHeader' },
                { text: 'Amount Excl. Tax', style: 'tableHeader' },
                { text: 'TAX'  + '(' + this.data.invoiceTaxPercentage + ')', style: 'tableHeader' },

                { text: this.billName == 'Qbill'? 'Amount Excl. Tax' : 'Amount Incl. Tax' , style: 'tableHeader' }],

              ...this.data['contractSaleInvoices'].map(row => (
                [
                  { text: row.description, style: 'tableHeader2' },

                  { text: row.saleInvoiceNo, style: 'tableHeader2' },
                  { text: row.saleInvoiceDateToDisplay, style: 'tableHeader2' },
                  { text: row.quantity + " " + row.quanityUOM, style: 'tableHeader2' },
                  { text: row.rate, style: 'tableHeader2' },

                  {
                    text: row.commission
                    , style: 'tableHeader2'
                  },
                  { text: row.sellerCommissionAmount, style: 'tableHeader2' },
             
                  { text: Math.round(row.taxAmount), style: 'tableHeader2' },

                  { text: Math.round(row.totalAmount), style: 'tableHeader2' }]
              ))
            ]
          }
        },

        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['10%', '20%'],
            body: [[
              { text: 'Quantity :', margin: [0, 20, 0, 0], bold: true, style: 'common' },
              { text: this.data['quantitySum'] + ' ' + this.data['quanityUOM'], margin: [-10, 20, 0, 0], bold: true, style: 'common' },


            ]]
          }
        },

        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['20%', '50%', '30%', '10%'],
            body: [[
              { text: 'Amount in Words :', margin: [0, 20, 0, 0], bold: true, style: 'common' },
              { text: this.amountInWorda, margin: [-30, 20, 0, 0], bold: true, decoration: 'underline', style: 'common' },
              { text: 'Sub Total :', margin: [50, 20, 0, 0], bold: true, style: 'common' },
              { text: this.data['currencyName'] + ' ' + this.data.billAmount, margin: [-60, 20, 0, 0], decoration: 'underline', style: 'common' }

            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['90%', '10%'],
            body: [[
              { text: 'TAX:', margin: [455, 5, 0, 0], bold: true, style: 'common' },
              { text:
                //  parseFloat(this.data['invoiceTaxAmountTotal']).toFixed(2) 
              this.data.invoiceTaxAmountTotal
              , margin: [0, 5, 0, 0], decoration: 'underline', style: 'common' },

              
            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['90%', '10%'],
            body: [[
              { text: 'Total:', margin: [455, 5, 0, 0], bold: true, style: 'common' },
              { text: this.data['currencyName'] + ' ' + this.data.invoiceTotalAmount, margin: [-10, 5, 0, 0], decoration: 'underline', bold: true, style: 'common' },


            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [[
              { text: 'Your prompt action in this regard would be highly appreciated', margin: [0, -25, 0, 0], style: 'common' },
            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [[
              { text: 'Thanking You', margin: [0, -5, 0, 0], style: 'common' },
            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['20%', '40%', '30%', '10%'],
            body: [[
              { text: 'Checked By:', margin: [0, 10, 0, 0], style: 'common' },
              { text: ' ------------------------------', margin: [-60, 20, 0, 0], style: 'common' },
              { text: 'Aurthorized Signatory:', margin: [60, 10, 0, 0], style: 'common' },
              { text: '  --------------------------', margin: [-15, 20, 0, 0], style: 'common' }

            ]]
          }
        },

      ],
      styles: {
        heading: {
          fontSize: 18,
          bold: true, alignment: 'center',
        },
        headingC: {
          fontSize: 8,
          alignment: 'center',
        },
        headingF: {
          fontSize: 8,
        },
        headingE: {
          fontSize: 8,
          margin: [-40, 0, 0, 0]
        },
        headinG: {
          fontSize: 8,
          margin: [-50, 0, 0, 0]
        },
        common: { fontSize: 9 },
        heading2: {
          fontSize: 9,
          bold: true, alignment: 'center'
        },
        tableHeader: { fillColor: '#f3f3f4', bold: true, margin: 4, alignment: 'center', fontSize: 8 },
        tableHeader2: { margin: 3, alignment: 'center', fontSize: 8 },

      },


    };
    pdfMake.createPdf(docDefinition).print();
  }



  breakUpprint() {

    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [20, 30, 30, 10],
      pageOrientation: 'letter',

      info: {
        title: 'Bill generated'
      },
      content: [
        {
          "image": this.image2,
          fit: [140, 140]

        },
        {

          text: 'FABCOT INTERNATIONAL', style: 'heading', margin: [0, -30, 0, 0]

        },
        {
          margin: [0, 3, 0, 0],
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [
              [{ text: '133-Aurangzeb Block New Garden Town Lahore', style: 'headingC' }],]
          }
        },
        {
          margin: [0, 2, 0, 0],
          layout: 'noBorders',
          table: {  
            headerRows: 1, widths: ['100%'],
            body: [
              [{ text: this.billName == "Cbill"?'SALES TAX INVOICE':'Quality Claim TAX INVOICE', style: 'headingC' }],]
          }
        },
        {
          margin: [0, 1, 0, 0],
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [
              [{ text: 'PNTN No. P-1300724-6', style: 'headingC' }],]
          }
        },
        {
          margin: [0, 1, 0, 20],
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [
              [{ text: 'STRN: 3277876195292', style: 'headingC' }],]
          }
        },
        //   {
        //     layout:'noBorders',

        //     table:{headerRows:1 ,  widths:['18%' , '67%' , '5%' , '12%'],
        //   body:[ [
        //     {text: 'Seller :' , margin: [63 , 30 , 0 , 0] , bold:true , style:'common' } , {text: this.data['sellerName'] ,  margin: [0 , 30 , 0 , 0] , style:'common'},


        // ]]
        //   }
        //   },
        //   {

        //     layout:'noBorders',
        //     table:{headerRows:1 ,  widths:['18%' , '65%' , '10%' , '15%'],
        //   body:[ [{text: 'Buyer :' , margin: [63 , 4 , 0 , 0] , bold:true , style:'common'} , {text: this.data['buyerName'] , margin: [0 , 4 , 0 , 0] , bold:true  , style:'common'},

        // ]]
        //   }
        //   },
        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['8%', '50%', '8%', '50%'],
            body: [[{ text: 'Seller :', margin: [0, 0, 10, 0], bold: true, style: 'headingF' }, { text: this.data['sellerName'], margin: [-20, 0, 10, 0], style: 'headingF' },
            { text: 'Buyer :', bold: true, style: 'headingE' }, { text: this.data['buyerName'],margin:[-60,0,0,0] , style: 'headingF' }

            ]]
          }
        },
        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['8%', '50%', '8%', '40%'],
            body: [[{ text: 'Address :', margin: [0, 0, 0, 0], bold: true, style: 'headingF' }, { text: this.data['sellerBillingAddress'], margin: [-15, 0, 0, 0], style: 'headingF' },
            { text: 'Address :', bold: true,   style: 'headingE' }, { text: this.data['buyerBillingAddress'], style: 'headinG' }

            ]]
          }
        },

        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['20%', '38%', '20%', '50%'],
            body: [[{ text: 'Sales Tax Resgitration No :', bold:true, margin: [0, 0, 0, 0], style: 'headingF' }, { text: this.data['sellerGST'], margin: [-10, 0, 0, 0], bold: false, style: 'headingF' },
            { text: 'Sales Tax Resgitration No :', bold: true, style: 'headingE' }, { text: this.data['buyerGST'], margin:[-48,0,0,0]  ,  style: 'headingF' }

            ]]
          }
        },



        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['8%', '50%', '8%', '50%'],
            body: [[{ text: 'NTN No :', margin: [0, 0, 0, 0], bold: true, style: 'headingF' }, { text: this.data['sellerNTN'], margin: [-13, 0, 0, 0], bold: false, style: 'headingF' },
            { text: 'NTN No :', bold: true, style: 'headingE' }, { text: this.data['buyerrNTN'], margin:[-50,0,0,0] ,  style: 'headingF' }

            ]]
          }
        },

        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['15%', '60%'],
            body: [[{ text: 'Supplier Contract#', margin: [0, 0, 0, 0], bold: true, style: 'headingF' }, { text: this.data['supplierContractNumber'], margin: [-13, 0, 0, 0], bold: false, style: 'headingF' },
           

            ]]
          }
        },

        //   {


        //     layout:'noBorders',
        //     table:{headerRows:1 ,  widths:['20%' , '80%' ],
        //   body:[ [{text: 'Supplier Contract# :' , margin: [15 , 4 , 0 , 0] , bold:true , style:'common'} , {text: this.rows['supplierContractNumber'] , margin: [-12 , 4 , 0 , 0]  , bold:true  , decoration:'underline' , style:'common'}

        // ]]
        //   }
        //   },
        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['15%', '60%', '30%', '12%'],
            body: [[{ text: 'Fabcot Contract No :', margin: [0, 4, 0, 0], bold: true, style: 'headingF' }, { text: this.data['contractNumber'], margin: [-10, 4, 0, 0], style: 'headingF' },
            { text: 'Sales Tax Invoice No:', margin: [0, 4, 0, 0], bold: true, style: 'headingF' }, { text: this.invNo, margin: [-85, 4, 0, 0], bold: true, style: 'headingF' },




            ]]
          }
        },

        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['15%', '65%', '33%', '12%'],
            body: [[{ text: 'Contract Date :', margin: [0, 2, 0, 0], bold: true, style: 'headingF' }, { text: this.data['contractDate'], margin: [-25, 4, 0, 0], style: 'headingF' },
            { text: 'Bill No#:', margin: [15, 2, 0, 0], bold: true, style: 'headingF' }, { text: this.data['billNumber'], margin: [-125, 4, 0, 0], style: 'headingF' }




            ]]
          }
        },

        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['90%', '15%'],
            body: [[{ text: 'Invoice Date :', margin: [428, 0, 0, 0], bold: true, style: 'headingF' }, { text: this.data['billInvoiceDate'], margin: [-13, 0, 0, 0], style: 'headingF' },


            ]]
          }
        },


        {
          margin: [0, 20, 0, 0],
          table: {
            headerRows: 1,
            widths: ['15%', '9%', '15%', '8.75%', '9.65%', '12.75%', '11.75%', '7.15%', '13%'],
            body: [

              [
                { text: 'Description', style: 'tableHeader' },
                { text: 'Sale Invoice#', style: 'tableHeader' }
                , { text: 'Sale Invoice Date', style: 'tableHeader' },
                { text: 'Quantity', style: 'tableHeader' },
                { text: 'Rate' + '(' + this.data.currencyName + ')', style: 'tableHeader' },

                { text: 'Commission  %age', style: 'tableHeader' },
                { text: 'Amount Excl. Tax', style: 'tableHeader' },
                { text: 'TAX'  + '(' + this.data.invoiceTaxPercentage + ')', style: 'tableHeader' },

                { text: 'Amount Incl. Tax' , style: 'tableHeader' }],

              ...this.data['contractSaleInvoices'].map(row => (
                [
                  { text: row.description, style: 'tableHeader2' },

                  { text: row.saleInvoiceNo, style: 'tableHeader2' },
                  { text: row.saleInvoiceDateToDisplay, style: 'tableHeader2' },
                  { text: row.quantity + " " + row.quanityUOM, style: 'tableHeader2' },
                  { text: row.rate, style: 'tableHeader2' },

                  {
                    text: row.commission
                    , style: 'tableHeader2'
                  },
                  { text: row.sellerCommissionAmount, style: 'tableHeader2' },
             
                  { text: Math.round(row.taxAmount), style: 'tableHeader2' },

                  { text: Math.round(row.totalAmount), style: 'tableHeader2' }]
              ))
            ]
          }
        },

        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['10%', '20%'],
            body: [[
              { text: 'Quantity :', margin: [0, 30, 0, 0], bold: true, style: 'common' },
              { text: this.data['quantitySum'] + ' ' + this.data['quanityUOM'], margin: [-10, 30, 0, 0], bold: true, style: 'common' },


            ]]
          }
        },

        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['20%', '50%', '30%', '10%'],
            body: [[
              { text: 'Amount in Words :', margin: [0, 20, 0, 0], bold: true, style: 'common' },
              { text: this.amountInWorda, margin: [-30, 20, 0, 0], bold: true, decoration: 'underline', style: 'common' },
              { text: 'Sub Total :', margin: [50, 20, 0, 0], bold: true, style: 'common' },
              { text: this.data['currencyName'] + ' ' + Math.round(this.data.billAmount), margin: [-60, 20, 0, 0], decoration: 'underline', style: 'common' }

            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['90%', '10%'],
            body: [[
              { text: 'TAX:', margin: [455, 5, 0, 0], bold: true, style: 'common' },
              { text:
                //  parseFloat(this.data['invoiceTaxAmountTotal']).toFixed(2) 
              Math.round(this.data['invoiceTaxAmountTotal'])
              , margin: [0, 5, 0, 0], decoration: 'underline', style: 'common' },

              
            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['90%', '10%'],
            body: [[
              { text: 'Total:', margin: [455, 5, 0, 0], bold: true, style: 'common' },
              { text: this.data['currencyName'] + ' ' + this.data.invoiceTotalAmount, margin: [-10, 5, 0, 0], decoration: 'underline', bold: true, style: 'common' },


            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [[
              { text: 'Your prompt action in this regard would be highly appreciated', margin: [0, 50, 0, 0], style: 'common' },
            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [[
              { text: 'Thanking You', margin: [0, 5, 0, 0], style: 'common' },
            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['20%', '40%', '30%', '10%'],
            body: [[
              { text: 'Checked By:', margin: [0, 20, 0, 0], style: 'common' },
              { text: ' ------------------------------', margin: [-60, 20, 0, 0], style: 'common' },
              { text: 'Aurthorized Signatory:', margin: [60, 20, 0, 0], style: 'common' },
              { text: '  --------------------------', margin: [-15, 20, 0, 0], style: 'common' }

            ]]
          }
        },

      ],
      styles: {
        heading: {
          fontSize: 18,
          bold: true, alignment: 'center',
        },
        headingC: {
          fontSize: 8,
          alignment: 'center',
        },
        headingF: {
          fontSize: 8,
        },
        headingE: {
          fontSize: 8,
          margin: [-40, 0, 0, 0]
        },
        headinG: {
          fontSize: 8,
          margin: [-50, 0, 0, 0]
        },
        common: { fontSize: 9 },
        heading2: {
          fontSize: 9,
          bold: true, alignment: 'center'
        },
        tableHeader: { fillColor: '#f3f3f4', bold: true, margin: 4, alignment: 'center', fontSize: 7 },
        tableHeader2: { margin: 3, alignment: 'center', fontSize: 6 },

      },


    };
    pdfMake.createPdf(docDefinition).print();
  }


}
