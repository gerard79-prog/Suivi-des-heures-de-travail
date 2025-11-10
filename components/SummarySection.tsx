import React, { useMemo } from 'react';
import { WorkEntry } from '../types';
import { formatHours } from '../utils/time';
import { exportCompanyPDF } from '../utils/pdf';
import { PdfIcon } from './icons';

interface SummarySectionProps {
    entries: WorkEntry[];
}

const SummarySection: React.FC<SummarySectionProps> = ({ entries }) => {

    const summaryData = useMemo(() => {
        const data: { [key: string]: number } = {};
        entries.forEach(entry => {
            if (!data[entry.company]) {
                data[entry.company] = 0;
            }
            data[entry.company] += entry.minutes;
        });
        return Object.entries(data).sort((a, b) => b[1] - a[1]);
    }, [entries]);

    const totalMinutes = useMemo(() => {
        return entries.reduce((sum, entry) => sum + entry.minutes, 0);
    }, [entries]);


    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-full">
            <h2 className="text-xl font-bold mb-4">Résumé par Société</h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {summaryData.length > 0 ? (
                    summaryData.map(([company, minutes]) => (
                        <div key={company} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="font-medium text-gray-800 dark:text-gray-100">{company}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-600 dark:text-gray-300 font-mono text-sm">{formatHours(minutes)}</span>
                                <button
                                    onClick={() => exportCompanyPDF(company, entries)}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                    title={`Exporter le relevé pour ${company}`}
                                >
                                    <PdfIcon />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">Aucune donnée à afficher.</p>
                )}
            </div>
             {summaryData.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center font-bold text-lg">
                    <span>Total Général</span>
                    <span className="font-mono">{formatHours(totalMinutes)}</span>
                </div>
            )}
        </div>
    );
};

export default SummarySection;
