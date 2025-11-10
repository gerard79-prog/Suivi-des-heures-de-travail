import React from 'react';
import { WorkEntry } from '../types';
import { formatHours, formatDate } from '../utils/time';
import { EditIcon, DeleteIcon } from './icons';

interface HistorySectionProps {
    entries: WorkEntry[];
    onEdit: (entry: WorkEntry) => void;
    onDelete: (id: number) => void;
    isLoading: boolean;
    totalMinutes: number;
    filtersActive: boolean;
}

const HistorySection: React.FC<HistorySectionProps> = ({ entries, onEdit, onDelete, isLoading, totalMinutes, filtersActive }) => {
    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Historique</h2>
                {filtersActive && <span className="text-sm font-mono bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded">Total filtré: {formatHours(totalMinutes)}</span>}
            </div>

            <div className="overflow-x-auto max-h-[60vh]">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-3">Date</th>
                            <th scope="col" className="px-4 py-3">Société</th>
                            <th scope="col" className="px-4 py-3 text-center">Heures</th>
                            <th scope="col" className="px-4 py-3 text-center">Pause</th>
                            <th scope="col" className="px-4 py-3 text-right">Total</th>
                            <th scope="col" className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10">Chargement...</td>
                            </tr>
                        ) : entries.length > 0 ? (
                            entries.map(entry => (
                                <tr key={entry.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                                    <td className="px-4 py-2 font-medium">{formatDate(entry.date)}</td>
                                    <td className="px-4 py-2">{entry.company}</td>
                                    <td className="px-4 py-2 text-center font-mono">{entry.start_time} - {entry.end_time}</td>
                                    <td className="px-4 py-2 text-center font-mono">{entry.break_time}m</td>
                                    <td className="px-4 py-2 text-right font-mono font-bold">{formatHours(entry.minutes)}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-center items-center gap-2">
                                            <button onClick={() => onEdit(entry)} className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300" title="Modifier">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => onDelete(entry.id)} className="p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300" title="Supprimer">
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">
                                    Aucune saisie à afficher.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistorySection;
