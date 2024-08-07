import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelCreatorService {
  sheetObj: any = {};
  newJsonFormat: any[] = [];

  constructor(private datePipe: DatePipe) { }

  exportAsExcelFile(json: any[], excelFileName: string, callBy: string) {
    this.newJsonFormat = [];
    this.getFormattedDataArr(callBy, json);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.newJsonFormat);
    this.sheetObj[excelFileName] = worksheet;
    const range = XLSX.utils.decode_range(<string>worksheet['!ref']);

    const workbook: XLSX.WorkBook = {
      Sheets: this.sheetObj,
      SheetNames: [excelFileName]
    };

    worksheet['!cols'] = this.getEditedColWidth(range, this.newJsonFormat);
    worksheet["!margins"] = { left: 1.0, right: 1.0, top: 1.0, bottom: 1.0, header: 0.5, footer: 0.5 };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  //to adjust excel sheet cell as per the longest value
  getEditedColWidth(range: any, data: any[]): any[] {
    const keysArr = Object.keys(data[0]); //all keys 
    const valuesArr: number[] = [];

    //this loop helps to get all column largest values
    for (let i = 0; i < keysArr.length; i++) {
      const tempArr: number[] = [];
      for (let j = 0; j < data.length; j++) {
        tempArr.push(`${data[j][keysArr[i]]}`.length);

        if (j == data.length - 1) valuesArr.push(Math.max(...tempArr));
      }
    }

    const widthByChArr = [];

    //this loop help to create the array of workbook cell width
    for (let i = range.s.r; i <= range.e.c; i++) {
      if (keysArr[i].length > valuesArr[i]) {
        widthByChArr.push({ wch: (keysArr[i].length) });
      } else {
        widthByChArr.push({ wch: valuesArr[i] + 1 });
      }
    }

    return widthByChArr;
  }

  isGSTfromDelhi(GSTIN: string): boolean {
    const firstTwoDigit = GSTIN.substring(0, 2);
    return firstTwoDigit == "07";
  }

  getFormattedDataArr(type: string, json: any[]) {
    const funcObj: any = {
      attandence: () => {
        for (let i = 0; i < json.length; i++) {
          const newJsonObj = {
            Date: this.datePipe.transform(json[i]["Date"], "dd/MM/YYYY"),
            Name: (json[i]["name"]).toUpperCase(),
            Email: json[i]["email"],
            Day: this.datePipe.transform(json[i]["Date"], "EEEE"),
            "Login Time": json[i]["login_time"],
            "Logout Time": json[i]["logout_time"],
            "Total Time": json[i]["total_minutes"]
          };
          this.newJsonFormat.push(newJsonObj);
        }
      },
      taxInvoiceCA: () => {
        for (let i = 0; i < json.length; i++) {
          const { company_name, name, tax_num, invoice_date, amountBeforeTax, amountAfterTax, gst_num, CGST_taxPer, SGST_taxPer, IGST_taxPer } = json[i];
          const newJsonObj = {
            Customer: (company_name).toUpperCase(),
            "Billed to": (name).toUpperCase(),
            "Invoice No.": tax_num,
            "Invoice Date": this.datePipe.transform(invoice_date, "dd-MM-YYYY"),
            "Taxable (Rs.)": amountBeforeTax,
            "Amount": amountAfterTax,
            "GSTIN": gst_num,
            "CGST Amount": this.isGSTfromDelhi(gst_num) ? (CGST_taxPer * amountBeforeTax) / 100 : 0,
            "SGST Amount": this.isGSTfromDelhi(gst_num) ? (SGST_taxPer * amountBeforeTax) / 100 : 0,
            "IGST Amount": !this.isGSTfromDelhi(gst_num) ? (IGST_taxPer * amountBeforeTax) / 100 : 0
          };
          this.newJsonFormat.push(newJsonObj);
        }
      }
    };

    funcObj[type]();
  }
}


