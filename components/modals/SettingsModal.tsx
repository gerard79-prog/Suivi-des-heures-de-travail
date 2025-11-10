import React, { useState } from 'react';
import { Company } from '../../types';
import { DeleteIcon, PlusIcon } from '../icons';

interface SettingsModalProps {
    companies: Company[];
    onAddCompany: (name: string) => Promise<void>;
    onDeleteCompany: (id: number) => Promise<void>;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ companies, onAddCompany, onDeleteCompany, onClose }) => {
    const [newCompanyName, setNewCompanyName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCompanyName.trim()) return;
        setIsAdding(true);
        try {
            await onAddCompany(newCompanyName.trim());
            setNewCompanyName('');
        } catch (error) {
            console.error("Failed to add company", error);
            // Error is alerted in App.tsx
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteCompany = async (id: number, name: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer la société "${name}" ? Cette action est irréversible et supprimera toutes les entrées associées.`)) {
            try {
                await onDeleteCompany(id);
            } catch (error) {
                console.error("Failed to delete company", error);
                // Error is alerted in App.tsx
            }
        }
    };

    const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 transition";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">&times;</button>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">⚙️ Gérer les sociétés</h2>

                <form onSubmit={handleAddCompany} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        placeholder="Nom de la société..."
                        className={inputClass}
                        disabled={isAdding}
                    />
                    <button type="submit" className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex-shrink-0" disabled={!newCompanyName.trim() || isAdding}>
                        <PlusIcon />
                    </button>
                </form>

                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                    {companies.length > 0 ? (
                        companies.map(company => (
                            <div key={company.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-gray-800 dark:text-gray-100">{company.name}</span>
                                <button
                                    onClick={() => handleDeleteCompany(company.id, company.name)}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                    title="Supprimer la société"
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">Aucune société configurée.</p>
                    )}
                </div>

                 <button onClick={onClose} className="w-full mt-6 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                    Fermer
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;
