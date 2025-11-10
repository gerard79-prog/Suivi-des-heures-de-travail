
export interface WorkEntry {
    id: number;
    created_at: string;
    date: string;
    company: string;
    start_time: string;
    end_time: string;
    break_time: number;
    minutes: number;
}

export interface Company {
    id: number;
    name: string;
    created_at: string;
}

export interface Filter {
    company: string;
    dateFrom: string;
    dateTo: string;
}
