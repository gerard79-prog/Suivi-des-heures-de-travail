
import React from 'react';

interface HelpModalProps {
    onClose: () => void;
    onCloseForever: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose, onCloseForever }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">&times;</button>
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">👋</span>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Guide de démarrage</h2>
                </div>
                
                <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm max-h-[60vh] overflow-y-auto pr-2">
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">🎯 En 3 étapes simples</h4>
                        <ol className="space-y-3 list-decimal list-inside">
                            <li>
                                <span className="font-semibold">Configurez vos sociétés :</span>
                                <ul className="text-xs text-gray-500 dark:text-gray-400 list-disc list-inside ml-4 mt-1">
                                    <li>Cliquez sur l'icône ⚙️ en haut à droite.</li>
                                    <li>Tapez le nom d'une société et cliquez sur ➕.</li>
                                </ul>
                            </li>
                            <li>
                                <span className="font-semibold">Saisissez vos heures :</span>
                                <ul className="text-xs text-gray-500 dark:text-gray-400 list-disc list-inside ml-4 mt-1">
                                    <li>Remplissez les champs date, société, début, fin, et pause.</li>
                                    <li>Cliquez sur 'Ajouter'. Le total est calculé automatiquement !</li>
                                </ul>
                            </li>
                            <li>
                                <span className="font-semibold">Exportez vos relevés :</span>
                                 <ul className="text-xs text-gray-500 dark:text-gray-400 list-disc list-inside ml-4 mt-1">
                                    <li>Allez dans "Résumé par Société".</li>
                                    <li>Cliquez sur l'icône 📄 à côté d'une société.</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">💡 Bon à savoir</h4>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>✅ Vos données sont automatiquement sauvegardées en ligne.</li>
                            <li>🌙 Le mode sombre est disponible avec le bouton lune/soleil.</li>
                            <li>✏️ Vous pouvez modifier ou 🗑️ supprimer vos saisies.</li>
                            <li>🔍 Utilisez les filtres pour affiner votre historique.</li>
                            <li>📱 Ajoutez l'app à votre écran d'accueil pour un accès rapide.</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={onCloseForever} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
                        ✓ Ne plus afficher au démarrage
                    </button>
                    <button onClick={onClose} className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
