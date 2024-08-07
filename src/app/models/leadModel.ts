export class LeadModel {
    leadUserKeys = [
        { label: "Demo Time", key: "demo_time" },
        { label: "Company", key: "company_name" },
        { label: "Client Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Contact", key: "contact" },
        { label: "Remark", key: "remarks" },
        { label: "Designation", key: "designation" },
        { label: "Department", key: "department" },
        { label: "Address", key: "address" },
        { label: "Location", key: "location" },
        { label: "GST Number", key: "gst_num" },
        { label: "PAN Number", key: "pan_num" },
        { label: "IEC Number", key: "iec_num" },
        { label: "Last Followup", key: "last_followup" },
        { label: "Next Followup", key: "next_followup" },
        { label: "Assigned From", key: "assigned_from" },
        { label: "Current Stage", key: "current_stage" },
        { label: "Created on", key: "transaction_time" },
        { label: "Source", key: "source" },
    ];

    commonKeys = [
        // { label: "Last Followup", key: "last_followup" },
        // { label: "Next Followup", key: "next_followup" },
        { label: "Remark", key: "remarks" },
        { label: "Company Name", key: "company_name" },
        { label: "Client Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Contact", key: "contact" },
        { label: "Location", key: "location" },
        { label: "Created on", key: "transaction_time" }
    ];
    
    leadKeys:any = {
        openLeadKey: [
            { label: "Last Followup", key: "last_followup" },
            { label: "Next Followup", key: "next_followup" },
            ...this.commonKeys
        ],
        followupLeadKey: [
            { label: "Last Followup", key: "last_followup" },
            { label: "Next Followup", key: "next_followup" },
            ...this.commonKeys
        ],
        rejectLeadKey: [
            { label: "Last Followup", key: "last_followup" },
            ...this.commonKeys
        ],
        closeLeadKey: [
            ...this.commonKeys,
            { label: "Closing time", key: "closingTime" }
        ],
        demoLeadKey: [
            { label: "Last Followup", key: "last_followup" },
            { label: "Next Followup", key: "next_followup" },
            { label: "Demo time", key: "demo_time" },
            { label: "Assigned from", key: "assigned_from" },
            ...this.commonKeys
        ],
        priceLeadKey: [
            { label: "Last Followup", key: "last_followup" },
            { label: "Next Followup", key: "next_followup" },
            { label: "Assigned from", key: "assigned_from" },
            ...this.commonKeys,
        ],
        invoiceLeadKey: [
            { label: "Order No.", key: "performa_num" },
            { label: "Assigned from", key: "assigned_from" },
            ...this.commonKeys
        ],
        adminLeadKey: [
            { label: "Last Followup", key: "last_followup" },
            { label: "Next Followup", key: "next_followup" },
            { label: "User", key: "user_name" },
            ...this.commonKeys
        ],
        statusLeadKey: [ //using as defaul angular excel modal keys
            { label: "Status", key: "status" },
            { label: "Owned By", key: "owned_by"},
            { label: "Remark", key: "updated_remark" },
            { label: "Company", key: "company" },
            { label: "Username", key: "username" },
            { label: "Email", key: "email" },
            { label: "Contact", key: "contact" },
            { label: "Location", key: "location" },
            { label: "GST number", key: "gst" },
            { label: "PAN number", key: "pan" },
            { label: "Time", key: "transaction_time" }
        ],
        taxLeadKey: [
            { label: "Invoice Date", key: "invoice_date" },
            { label: "Order No", key: "performa_num" },
            { label: "Invoice No", key: "tax_num" },
            { label: "company", key: "company_name" },
            { label: "username", key: "name" },
            { label: "plan name", key: "plan_name" },
            { label: "GST Number", key: "gst_num" },
            { label: "Report Type", key: "report_name" },
            { label: "Duration", key: "duration" },
            { label: "Shipping Address", key: "shipping_add" },
            { label: "Billing Address", key: "billing_add" },
            { label: "HSN/SAC", key: "HSN_SAC" },
            { label: "Quantity", key: "quantity" },
            { label: "Unit", key: "unit" },
            { label: "Initial Amount", key: "amountBeforeTax" },
            { label: "Taxable Amount", key: "amountAfterTax" },
            { label: "Tax Amount", key: "tax_amt" },
            { label: "CGST Percent", key: "CGST_taxPer" },
            { label: "SGST Percent", key: "SGST_taxPer" },
            { label: "IGST Percent", key: "IGST_taxPer" },
            { label: "Issued By", key: "issued_name" },
            { label: "Payment Status", key: "payment_status" },
            { label: "Transaction time", key: "transaction_time" }
        ]
    };

    getCurrentKeys(leadKey: string): any[] {
        const key = `${leadKey}LeadKey`.replace("-","");       
        return this.leadKeys[key];
    }
}

export class StatusLead {
    leadData: string = "";
    assigners: string = "";
    status: string = "";
}

export interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

export const infoModalStatusKeyVal:any = {
    status: "Status",
    assignedFrom: "Assigned From",
    remark: "Remark",
    username: "Client Name",
    company: "Company Name",
    contact: "Contact Number",
    email: "Email",
    department: "Department",
    designation: "Designation",
    address: "Address",
    location: "Location",
    lastFollow: "Last Followup",
    nextFollow: "Next Followup",
    followupTracker: "Followup History",
    pan: "PAN Number",
    gst: "GST Number",
    iec: "IEC Number",
    plan_name: "Plan Name",
    plan_price: "Plan Price",
    source: "Source",
    reference: "Reference",
    currentStage: "Current Stage",
    leadTracker: "Lead History",
};

export const infoModalProformaKeyVal:any = {
    performa_num: "Proforma Number",
    plan_name: "Plan Name",
    plan_price: "Plan Price",
    remarks: "Remark",
    name: "Client Name",
    company_name: "Company Name",
    contact: "Contact",
    email: "Email",
    department: "Department",
    designation: "Designation",
    assigned_from: "Assigned From",
    address: "Address",
    location: "Location",
    gst_num: "GST Number",
    iec_num: "IEC Number",
    pan_num: "PAN Number",
    last_followup: "Last Followup",
    next_followup: "Next Followup",
    followup_tracker: "Followup History",
    source: "Source",
    source_detail: "Refrence Details",
    transaction_time: "PI Transaction Time"
}

export const infoModalTaxKeyVal:any = {
    invoice_date: "Invoice Date",
    performa_num: "Proforma Number",
    tax_num: "Tax Number",
    issued_name: "Issued By",
    payment_status: "Payment Status",
    name: "Client Name",
    company_name: "Company Name",
    email: "Email",
    contact: "Contact",
    designation: "Designation",
    department: "Department",
    address: "Address",
    location: "Location",
    plan_name: "Plan Name",
    gst_num: "GST Number",
    pan_num: "PAN Number",
    iec_num: "IEc Number",
    report_name: "Report Name",
    shipping_add: "Shipping Address",
    billing_add: "Billing Address",
    duration: "Duration",
    HSN_SAC: "HSN SAC",
    quantity: "Quantity",
    unit: "Unit",
    amountBeforeTax: "Rate",
    amountAfterTax: "Grand Total",
    tax_amt: "Taxable",
    CGST_taxPer: "CGST Tax%",
    SGST_taxPer: "SGST Tax%",
    IGST_taxPer: "IGST Tax%",
    transaction_time: "Transaction Time",
    // bank_data: "",
}



export const permissionModel = [
    {label: "Add User", key: "add_user", flag: false},
    {label: "Edit User", key: "edit_user", flag: false},
    {label: "Delete User", key: "delete_user", flag: false},
    {label: "Add Lead", key: "add_lead", flag: false},
    {label: "Edit Lead", key: "edit_lead", flag: false},
    {label: "Dashboard", key: "has_dashboard", flag: false},
    {label: "Admin Panel", key: "has_admin", flag: false},
    {label: "Lead Panel", key: "has_lead", flag: false},
    {label: "Demo Panel", key: "has_demo", flag: false},
    {label: "Price Panel", key: "has_pricing", flag: false},
    {label: "Invoice Panel", key: "has_invoice", flag: false},
    {label: "Group Chat", key: "has_chat", flag: false},
    {label: "Lead Assignment", key: "has_assignment", flag: false},
];

export const adminPermissionModel = [
    {label: "Attendance", key: "attendance", flag: true},
    {label: "Add User", key: "add_new_user", flag: true},
    {label: "All Leads", key: "see_leads", flag: true},
    {label: "Website Leads", key: "see_web_leads", flag: true},
];
