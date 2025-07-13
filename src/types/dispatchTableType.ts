export type dispatchTable = {
    dispatches:
        {
            name: string;
            invoice_number: string;
            invoice_date: string; // ISO date string format (YYYY-MM-DD)
            invoice_amount: string; // Can be changed to number if it's always numeric
            owner: string;
            status: string;
            purchase_numbers: string[];
        }[]
    ,
    total_count:string
} 