import React, { useState, useEffect, useMemo } from 'react';
import { WorkEntry, Company, Filter } from './types';
import * as api from './services/supabase';

import Header from './components/Header';
import EntryForm from './components/EntryForm';
import SummarySection from './components/SummarySection';
import HistorySection from './components/HistorySection';
import SettingsModal from './components/modals/SettingsModal';
import FilterModal from './components/modals/FilterModal';
import HelpModal from './components/modals/HelpModal';
import { formatHours } from './utils/time';

const App: React.FC = () => {
    // State
    const [workEntries, setWorkEntries] = useState<WorkEntry[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null);

    // Modals
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    // Filters
    const [filters, setFilters] = useState<Filter>({
        company: '',
        dateFrom: '',
        dateTo: '',
    });

    // Theme
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                return 'dark';
            }
        }
        return 'light';
    });

    // Effects
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const showHelp = localStorage.getItem('showHelpModal') !== 'false';
        if (showHelp) {
            setIsHelpModalOpen(true);
        }
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [entriesData, companiesData] = await Promise.all([
                    api.getWorkEntries(),
                    api.getCompanies()
                ]);
                setWorkEntries(entriesData);
                setCompanies(companiesData);
            } catch (err: any) {
                setError(`Failed to fetch data: ${err.message}`);
                alert(`Failed to fetch data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleCloseHelpForever = () => {
        localStorage.setItem('showHelpModal', 'false');
        setIsHelpModalOpen(false);
    };

    // CRUD Operations for Work Entries
    const handleAddWorkEntry = async (newEntry: Omit<WorkEntry, 'id' | 'created_at'>) => {
        try {
            const addedEntry = await api.addWorkEntry(newEntry);
            setWorkEntries(prev => [addedEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.start_time.localeCompare(a.start_time)));
        } catch (err: any) {
            setError(`Failed to add entry: ${err.message}`);
            alert(`Failed to add entry: ${err.message}`);
        }
    };

    const handleUpdateWorkEntry = async (id: number, updates: Partial<Omit<WorkEntry, 'id' | 'created_at'>>) => {
        try {
            const updatedEntry = await api.updateWorkEntry(id, updates);
            setWorkEntries(prev => prev.map(e => e.id === id ? updatedEntry : e));
            setEditingEntry(null);
        } catch (err: any) {
            setError(`Failed to update entry: ${err.message}`);
            alert(`Failed to update entry: ${err.message}`);
        }
    };
    
    const handleDeleteWorkEntry = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            try {
                await api.deleteWorkEntry(id);
                setWorkEntries(prev => prev.filter(e => e.id !== id));
            } catch (err: any) {
                setError(`Failed to delete entry: ${err.message}`);
                alert(`Failed to delete entry: ${err.message}`);
            }
        }
    };

    // CRUD Operations for Companies
    const handleAddCompany = async (name: string) => {
         if (companies.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            alert("This company already exists.");
            return;
        }
        try {
            const newCompany = await api.addCompany(name);
            setCompanies(prev => [...prev, newCompany].sort((a,b) => a.name.localeCompare(b.name)));
        } catch (err: any) {
            setError(`Failed to add company: ${err.message}`);
            alert(`Failed to add company: ${err.message}`);
        }
    };

    const handleDeleteCompany = async (id: number) => {
        try {
            // This needs to also delete associated work entries, which should be handled by DB cascade or here.
            // For now, let's assume cascade delete is set up on Supabase.
            await api.deleteCompany(id);
            const deletedCompany = companies.find(c => c.id === id);
            setCompanies(prev => prev.filter(c => c.id !== id));
            if (deletedCompany) {
                setWorkEntries(prev => prev.filter(e => e.company !== deletedCompany.name));
            }
        } catch (err: any) {
            setError(`Failed to delete company: ${err.message}`);
            alert(`Failed to delete company: ${err.message}`);
        }
    };

    // Filtering logic
    const filteredEntries = useMemo(() => {
        return workEntries.filter(entry => {
            const companyMatch = filters.company ? entry.company === filters.company : true;
            const dateFromMatch = filters.dateFrom ? entry.date >= filters.dateFrom : true;
            const dateToMatch = filters.dateTo ? entry.date <= filters.dateTo : true;
            return companyMatch && dateFromMatch && dateToMatch;
        });
    }, [workEntries, filters]);

    const totalMinutesFiltered = useMemo(() => {
        return filteredEntries.reduce((total, entry) => total + entry.minutes, 0);
    }, [filteredEntries]);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 transition-colors duration-300">
            <Header
                theme={theme}
                onToggleTheme={toggleTheme}
                onOpenFilterModal={() => setIsFilterModalOpen(true)}
                onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
                onOpenHelpModal={() => setIsHelpModalOpen(true)}
            />

            <main className="container mx-auto p-4 max-w-4xl">
                {error && <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">{error}</div>}

                <EntryForm
                    companies={companies}
                    onAddEntry={handleAddWorkEntry}
                    onUpdateEntry={handleUpdateWorkEntry}
                    editingEntry={editingEntry}
                    onCancelEdit={() => setEditingEntry(null)}
                />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <SummarySection entries={workEntries} />
                    </div>
                    <div className="md:col-span-2">
                         <HistorySection
                            entries={filteredEntries}
                            onEdit={setEditingEntry}
                            onDelete={handleDeleteWorkEntry}
                            isLoading={loading}
                            totalMinutes={totalMinutesFiltered}
                            filtersActive={!!filters.company || !!filters.dateFrom || !!filters.dateTo}
                         />
                    </div>
                </div>
            </main>

            {isSettingsModalOpen && (
                <SettingsModal
                    companies={companies}
                    onAddCompany={handleAddCompany}
                    onDeleteCompany={handleDeleteCompany}
                    onClose={() => setIsSettingsModalOpen(false)}
                />
            )}
            {isFilterModalOpen && (
                <FilterModal
                    filters={filters}
                    setFilters={setFilters}
                    companies={companies}
                    filteredEntries={filteredEntries}
                    onClose={() => setIsFilterModalOpen(false)}
                />
            )}
            {isHelpModalOpen && (
                <HelpModal
                    onClose={() => setIsHelpModalOpen(false)}
                    onCloseForever={handleCloseHelpForever}
                />
            )}
        </div>
    );
};

export default App;
