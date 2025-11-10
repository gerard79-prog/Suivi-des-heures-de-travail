
import React from 'react';
import { Filter, Company, WorkEntry } from '../../types';
import { exportFilteredPDF } from '../../utils/pdf';

interface FilterModalProps {
    filters: Filter;
    setFilters: React.Dispatch<React.SetStateAction<Filter>>;
    companies: Company[];
    filteredEntries: WorkEntry[];
    onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ filters, setFilters, companies, filteredEntries, onClose }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const clearFilters = () => {
        setFilters({ company: '', dateFrom: '', dateTo: '' });
    };

    const hasActiveFilters = !!filters.company || !!filters.dateFrom || !!filters.dateTo;
    const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 transition";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">&times;</button>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Filtrer les entrées</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Société</label>
                        <select name="company" value={filters.company} onChange={handleChange} className={inputClass}>
                            <option value="">-- Toutes les sociétés --</option>
                            {companies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Date du</label>
                            <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Date au</label>
                            <input type="date" name="dateTo" value={filters.dateTo} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <button onClick={clearFilters} disabled={!hasActiveFilters} className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition disabled:opacity-50">
                        Effacer
                    </button>
                    <button onClick={() => exportFilteredPDF(filteredEntries, filters)} disabled={filteredEntries.length === 0} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50">
                        Exporter PDF
                    </button>
                </div>
                <button onClick={onClose} className="w-full mt-2 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
                    Appliquer et Fermer
                </button>
            </div>
        </div>
    );
};

export default FilterModal;
