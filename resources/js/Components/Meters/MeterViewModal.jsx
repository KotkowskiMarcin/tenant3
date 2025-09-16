import { XMarkIcon, BoltIcon } from '@heroicons/react/24/outline';

export default function MeterViewModal({ meter, isOpen, onClose }) {
    if (!isOpen || !meter) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[60]">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <BoltIcon className="h-6 w-6 text-blue-600 mr-3" />
                            <h3 className="text-lg font-medium text-gray-900">
                                Szczegóły licznika
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        {/* Podstawowe informacje */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Podstawowe informacje</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nazwa licznika
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{meter.name}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Numer seryjny
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 font-mono">{meter.serial_number}</p>
                                </div>
                            </div>
                        </div>

                        {/* Dostawca */}
                        {meter.provider && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Dostawca usług</h4>
                                <p className="text-sm text-gray-900 whitespace-pre-wrap">{meter.provider}</p>
                            </div>
                        )}

                        {/* Dane pomiarowe */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-900 mb-3">Dane pomiarowe</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-blue-700 uppercase tracking-wider">
                                        Aktualny stan
                                    </label>
                                    <p className="mt-1 text-lg font-semibold text-blue-900">
                                        {meter.formatted_reading}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-blue-700 uppercase tracking-wider">
                                        Jednostka
                                    </label>
                                    <p className="mt-1 text-lg font-semibold text-blue-900">
                                        {meter.unit}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-blue-700 uppercase tracking-wider">
                                        Cena za jednostkę
                                    </label>
                                    <p className="mt-1 text-lg font-semibold text-blue-900">
                                        {meter.formatted_price_per_unit}
                                    </p>
                                </div>
                            </div>
                        </div>


                        {/* Informacje o nieruchomości */}
                        {meter.property && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Nieruchomość</h4>
                                <p className="text-sm text-gray-900">
                                    {meter.property.address}
                                </p>
                            </div>
                        )}

                        {/* Daty */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Informacje o dacie</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Utworzono
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(meter.created_at).toLocaleDateString('pl-PL', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ostatnia aktualizacja
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(meter.updated_at).toLocaleDateString('pl-PL', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Zamknij
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
