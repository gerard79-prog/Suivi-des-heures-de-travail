import { createClient } from '@supabase/supabase-js';
import { WorkEntry, Company } from '../types';

const supabaseUrl = process.env.PARCEL_SUPABASE_URL;
const supabaseKey = process.env.PARCEL_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    // In a real app, you might want to show this to the user in a more friendly way
    throw new Error("Supabase URL and Key must be provided in .env file. They must start with PARCEL_");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Work Entries
export const getWorkEntries = async (): Promise<WorkEntry[]> => {
    const { data, error } = await supabase.from('work_entries').select('*').order('date', { ascending: false }).order('start_time', { ascending: false });
    if (error) throw error;
    return data || [];
};

export const addWorkEntry = async (entry: Omit<WorkEntry, 'id' | 'created_at'>): Promise<WorkEntry> => {
    const { data, error } = await supabase.from('work_entries').insert([entry]).select();
    if (error) throw error;
    return data[0];
};

export const updateWorkEntry = async (id: number, updates: Partial<Omit<WorkEntry, 'id' | 'created_at'>>): Promise<WorkEntry> => {
    const { data, error } = await supabase.from('work_entries').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
};

export const deleteWorkEntry = async (id: number): Promise<void> => {
    const { error } = await supabase.from('work_entries').delete().eq('id', id);
    if (error) throw error;
};

// Companies
export const getCompanies = async (): Promise<Company[]> => {
    const { data, error } = await supabase.from('companies').select('*').order('name', { ascending: true });
    if (error) throw error;
    return data || [];
};

export const addCompany = async (name: string): Promise<Company> => {
    const { data, error } = await supabase.from('companies').insert([{ name }]).select();
    if (error) throw error;
    return data[0];
};

export const deleteCompany = async (id: number): Promise<void> => {
    const { error } = await supabase.from('companies').delete().eq('id', id);
    if (error) throw error;
};

export default supabase;