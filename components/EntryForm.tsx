import React, { useState, useEffect } from 'react';
import { WorkEntry, Company } from '../types';
import { calculateMinutes } from '../utils/time';

interface EntryFormProps {
    companies: Company[];
    onAddEntry: (entry: Omit<WorkEntry, 'id' | 'created_at'>) => Promise<void>;
    onUpdateEntry: (id: number, updates: Partial<Omit<WorkEntry, 'id' | 'created_at'>>) => Promise<void>;
    editingEntry: WorkEntry | null;
    onCancelEdit: () => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ companies, onAddEntry, onUpdateEntry, editingEntry, onCancelEdit }) => {
    const getTodayDate = () => new Date().toISOString().split('T')[0];

    const [date, setDate] = useState(getTodayDate());
    const [company, setCompany] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [breakTime, setBreakTime] = useState('0');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingEntry) {
            setDate(editingEntry.date);
            setCompany(editingEntry.company);
            setStartTime(editingEntry.start_time);
            setEndTime(editingEntry.end_time);
            setBreakTime(String(editingEntry.break_time));
        } else {
            resetForm();
        }
    }, [editingEntry]);

    useEffect(() => {
        if (!editingEntry && companies.length > 0 && !company) {
             setCompany(companies[0].name);
        }
    }, [companies, editingEntry, company]);

    const resetForm = () => {
        setDate(getTodayDate());
        setCompany(companies.length > 0 ? companies[0].name : '');
        setStartTime('');
        setEndTime('');
        setBreakTime('0');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!company || !date || !startTime || !endTime) {
            alert("Please fill all required fields.");
            return;
        }

        setIsSubmitting(true);
        const minutes = calculateMinutes(startTime, endTime, Number(breakTime));
        const entryData = {
            date,
            company,
            start_time: startTime,
            end_time: endTime,
            break_time: Number(breakTime),
            minutes,
        };

        try {
            if (editingEntry) {
                await onUpdateEntry(editingEntry.id, entryData);
            } else {
                await onAddEntry(entryData);
                resetForm();
            }
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 transition";

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">{editingEntry ? 'Modifier une saisie' : 'Ajouter une saisie'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Société</label>
                    <select value={company} onChange={e => setCompany(e.target.value)} className={inputClass} required>
                        <option value="" disabled>Choisir...</option>
                        {companies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                     <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Début</label>
                        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={inputClass} required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Fin</label>
                        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className={inputClass} required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Pause (min)</label>
                    <input type="number" value={breakTime} onChange={e => setBreakTime(e.target.value)} min="0" className={inputClass} required />
                </div>
                <div className="sm:col-span-2 md:col-span-2 flex flex-col sm:flex-row gap-2">
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50" disabled={isSubmitting || companies.length === 0}>
                        {isSubmitting ? '...' : (editingEntry ? 'Mettre à jour' : 'Ajouter')}
                    </button>
                    {editingEntry && (
                        <button type="button" onClick={onCancelEdit} className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                            Annuler
                        </button>
                    )}
                </div>
            </form>
             {companies.length === 0 && <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-3">Veuillez d'abord ajouter une société dans les paramètres ⚙️.</p>}
        </div>
    );
};

export default EntryForm;
