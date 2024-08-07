export class CSVModel {
    username: string = "";
    company: string = "";
    designation: string = "";
    department: string = "";
    remark: string = "";
    source: string = "";
    address: string = "";
    location: string = "";
    email: string = "";
    contact: string = "";
    gst: string = "";
    pan: string = "";
    iec: string = "";
    lastFollow: string = "";
    nextFollow: string = "";
    assignedFrom: string = "";
    demoTime: string = "";
    userId: string|number = "";
    leadId: string|number = "";
    currentStage: string = "";
    leadTracker: string = "";
    followupTracker: string = "";
    transTime: string = "";
    plan_name: string = "";
    plan_price: string = "";
    performa_num:string = "";
    reference:{
        name: string,
        company: string,
        contact: string,
        designation: string
    } = {name: "", company: "", contact: "", designation: ""}
}
// export type CSVModel = Omit<CSVObject, "lastFollow"|"nextFollow"|"assignedBy"|"currentStage"|"transTime">


