import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { 
    XMarkIcon, 
    PlusIcon, 
    PencilIcon, 
    TrashIcon, 
    EyeIcon,
    BoltIcon,
    CurrencyDollarIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import MeterEditModal from './MeterEditModal';
import MeterDeleteModal from './MeterDeleteModal';

export default function MeterManagementModal({ property, isOpen, onClose }) {
    const [editingMeter, setEditingMeter] = useState(null);
    const [deletingMeter, setDeletingMeter] = useState(null);
    const [isCreating, setIsCreating] = useState(true); // Domyślnie w trybie tworzenia

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        serial_number: '',
        provider: '',
        current_reading: '',
        unit: 'kWh',
        price_per_unit: '',
    });

    const handleCreate = () => {
        setIsCreating(true);
        setEditingMeter(null);
        clearErrors();
        reset();
    };

    const handleEdit = (meter) => {
        setEditingMeter(meter);
        setIsCreating(false);
        clearErrors();
        setData({
            name: meter.name,
            serial_number: meter.serial_number,
            provider: meter.provider || '',
            current_reading: meter.current_reading.toString(),
            unit: meter.unit,
            price_per_unit: meter.price_per_unit.toString(),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submitData = {
            ...data,
            property_id: property.id,
            current_reading: parseFloat(data.current_reading),
            price_per_unit: parseFloat(data.price_per_unit),
        };

        if (isCreating) {
            router.post(route('properties.meters.store', property.id), submitData, {
                onSuccess: () => {
                    setIsCreating(false);
                    reset();
                }
            });
        } else if (editingMeter) {
            router.post(route('property-meters.update', editingMeter.id), {
                ...submitData,
                _method: 'patch'
            }, {
                onSuccess: () => {
                    setEditingMeter(null);
                    reset();
                }
            });
        }
    };

    const handleDelete = (meter) => {
        setDeletingMeter(meter);
    };

    const handleClose = () => {
        setIsCreating(false);
        setEditingMeter(null);
        setDeletingMeter(null);
        clearErrors();
        reset();
        onClose();
    };

    if (!isOpen) return null;

    // Jeśli jest w trybie tworzenia, pokaż tylko modal edycji
    if (isCreating && !editingMeter) {
        return (
            <MeterEditModal
                meter={null}
                isOpen={true}
                onClose={() => {
                    setIsCreating(false);
                    onClose();
                }}
                isCreating={true}
                property={property}
            />
        );
    }

    return (
        <>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
                    <div className="mt-3">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <BoltIcon className="h-8 w-8 text-blue-600 mr-3" />
                                <h3 className="text-lg font-medium text-gray-900">
                                    Zarządzanie licznikami - {property.name}
                                </h3>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Add Button */}
                        <div className="mb-6">
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Dodaj licznik
                            </button>
                        </div>

                        {/* Meters Table */}
                        {property.meters && property.meters.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nazwa
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Numer seryjny
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Dostawca
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stan
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cena/jednostka
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Koszt całkowity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Akcje
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {property.meters.map((meter) => (
                                            <tr key={meter.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <BoltIcon className="h-5 w-5 text-blue-500 mr-2" />
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {meter.name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {meter.serial_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {meter.provider || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {meter.formatted_reading}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {meter.formatted_price_per_unit}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                    {meter.formatted_total_cost}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(meter)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="Edytuj"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(meter)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Usuń"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <BoltIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Brak liczników</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Zacznij od dodania pierwszego licznika.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal - tylko gdy edytujemy istniejący licznik */}
            {editingMeter && (
                <MeterEditModal
                    meter={editingMeter}
                    isOpen={!!editingMeter}
                    onClose={() => {
                        setEditingMeter(null);
                    }}
                    data={data}
                    setData={setData}
                    onSubmit={handleSubmit}
                    processing={processing}
                    errors={errors}
                    isCreating={false}
                />
            )}

            {/* Delete Modal */}
            {deletingMeter && (
                <MeterDeleteModal
                    meter={deletingMeter}
                    isOpen={!!deletingMeter}
                    onClose={() => setDeletingMeter(null)}
                />
            )}
        </>
    );
}
