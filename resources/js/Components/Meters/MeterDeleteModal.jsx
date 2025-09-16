import { useForm } from '@inertiajs/react';
import { 
    XMarkIcon, 
    ExclamationTriangleIcon,
    BoltIcon
} from '@heroicons/react/24/outline';

export default function MeterDeleteModal({ meter, isOpen, onClose }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('property-meters.destroy', meter.id), {
            onSuccess: () => {
                onClose();
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[70]">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
                            <h3 className="text-lg font-medium text-gray-900">
                                Usuń licznik
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
                    <div className="mb-6">
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                            <div className="flex">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                                <div className="text-sm text-red-800">
                                    <p className="font-medium">Czy na pewno chcesz usunąć ten licznik?</p>
                                    <p className="mt-1">Ta operacja jest nieodwracalna.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                            <div className="flex items-center mb-2">
                                <BoltIcon className="h-5 w-5 text-blue-500 mr-2" />
                                <span className="font-medium text-gray-900">{meter.name}</span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><span className="font-medium">Numer seryjny:</span> {meter.serial_number}</p>
                                <p><span className="font-medium">Stan:</span> {meter.formatted_reading}</p>
                                <p><span className="font-medium">Cena/jednostka:</span> {meter.formatted_price_per_unit}</p>
                                {meter.provider && (
                                    <p><span className="font-medium">Dostawca:</span> {meter.provider}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Anuluj
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={processing}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                            {processing ? 'Usuwanie...' : 'Usuń licznik'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
