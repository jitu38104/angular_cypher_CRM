export type ApiMsgRes = {
    error: boolean;
    status: number;
    code: number;
    msg: string;
    result: any[];
}

export type UpdateCompanyRequestType = {
    id: number;
    datetime: string|null;
    crmUserId: number;
    companyId: number;
}

export class NewCompanyDetails {
    id:number = 0;
    iec:string = "";
    company_name:string = "";
    person_name:string = "";
    contact:string = "";
    email:string = "";
    location:string = "";
    address:string = "";
}
