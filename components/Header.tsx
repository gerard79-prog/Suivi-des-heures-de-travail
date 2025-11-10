import React from 'react';
import { SunIcon, MoonIcon, FilterIcon, SettingsIcon, HelpIcon } from './icons';

interface HeaderProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    onOpenFilterModal: () => void;
    onOpenSettingsModal: () => void;
    onOpenHelpModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onOpenFilterModal, onOpenSettingsModal, onOpenHelpModal }) => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
            <div className="container mx-auto p-4 flex justify-between items-center max-w-4xl">
                <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    🕒 Time Tracker
                </h1>
                <div className="flex items-center gap-2">
                    <button onClick={onToggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition" title="Toggle Theme">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                    <button onClick={onOpenFilterModal} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition" title="Filters">
                        <FilterIcon />
                    </button>
                    <button onClick={onOpenSettingsModal} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition" title="Settings">
                        <SettingsIcon />
                    </button>
                    <button onClick={onOpenHelpModal} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition" title="Help">
                        <HelpIcon />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
