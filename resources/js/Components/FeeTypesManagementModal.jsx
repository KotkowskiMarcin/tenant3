import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { 
    XMarkIcon, 
    PlusIcon, 
    PencilIcon
} from '@heroicons/react/24/outline';

export default function FeeTypesManagementModal({ 
    isOpen, 
    onClose, 
    property, 
    feeTypes = [], 
    frequencyTypeOptions = [],
    onRefresh
}) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedFeeType, setSelectedFeeType] = useState(null);
    const [showFrequencyValue, setShowFrequencyValue] = useState(false);
    const [localFeeTypes, setLocalFeeTypes] = useState(feeTypes);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        property_id: property?.id || '',
        name: '',
        description: '',
        amount: '',
        frequency_type: 'monthly',
        frequency_value: null,
        is_active: true,
    });

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            reset();
            setShowCreateForm(false);
            setShowEditForm(false);
            setSelectedFeeType(null);
        }
    }, [isOpen]);

    // Synchronizuj lokalny stan z props
    useEffect(() => {
        setLocalFeeTypes(feeTypes);
    }, [feeTypes]);


    const handleFrequencyTypeChange = (e) => {
        const value = e.target.value;
        setData('frequency_type', value);
        setShowFrequencyValue(['quarterly', 'specific_month'].includes(value));
        if (!['quarterly', 'specific_month'].includes(value)) {
            setData('frequency_value', null);
        }
    };

    const handleCreate = () => {
        setShowCreateForm(true);
        setShowEditForm(false);
        reset();
    };

    const handleEdit = (feeType) => {
        setSelectedFeeType(feeType);
        setData({
            property_id: property?.id || '',
            name: feeType.name,
            description: feeType.description || '',
            amount: feeType.amount.toString(),
            frequency_type: feeType.frequency_type,
            frequency_value: feeType.frequency_value,
            is_active: feeType.is_active,
        });
        setShowFrequencyValue(['quarterly', 'specific_month'].includes(feeType.frequency_type));
        setShowEditForm(true);
        setShowCreateForm(false);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (showCreateForm) {
            post(route('properties.fee-types.store', property.id), {
                onSuccess: (page) => {
                    setShowCreateForm(false);
                    reset();
                    // Zaktualizuj lokalny stan z nowymi danymi
                    if (page.props.feeTypes) {
                        setLocalFeeTypes(page.props.feeTypes);
                    } else if (onRefresh) {
                        onRefresh();
                    }
                }
            });
        } else if (showEditForm) {
            put(route('fee-types.update', selectedFeeType.id), {
                onSuccess: (page) => {
                    setShowEditForm(false);
                    setSelectedFeeType(null);
                    reset();
                    // Zaktualizuj lokalny stan z nowymi danymi
                    if (page.props.feeTypes) {
                        setLocalFeeTypes(page.props.feeTypes);
                    } else if (onRefresh) {
                        onRefresh();
                    }
                }
            });
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Zarządzanie szablonami opłat - {property?.name}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {!showCreateForm && !showEditForm && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-600">
                                        Zarządzaj szablonami opłat dla tej nieruchomości
                                    </p>
                                    <button
                                        onClick={handleCreate}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Nowy szablon
                                    </button>
                                </div>

                                {localFeeTypes.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 mb-4">Brak szablonów opłat.</p>
                                        <button
                                            onClick={handleCreate}
                                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                                        >
                                            <PlusIcon className="w-4 h-4 mr-2" />
                                            Utwórz pierwszy szablon
                                        </button>
                                    </div>
                                ) : (
                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nazwa
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Kwota
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Częstotliwość
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Akcje
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {localFeeTypes.map((feeType) => (
                                                    <tr key={feeType.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {feeType.name}
                                                                </div>
                                                                {feeType.description && (
                                                                    <div className="text-sm text-gray-500">
                                                                        {feeType.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {feeType.amount} zł
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {frequencyTypeOptions.find(opt => opt.value === feeType.frequency_type)?.label}
                                                            {feeType.frequency_value && (
                                                                <span className="text-gray-500"> ({feeType.frequency_value})</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                feeType.is_active 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {feeType.is_active ? 'Aktywny' : 'Nieaktywny'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                onClick={() => handleEdit(feeType)}
                                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                title="Edytuj szablon opłat"
                                                            >
                                                                <PencilIcon className="w-4 h-4 mr-1" />
                                                                Edytuj
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {(showCreateForm || showEditForm) && (
                            <div className="space-y-6">
                                <div className="border-b border-gray-200 pb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {showCreateForm ? 'Nowy szablon opłat' : 'Edytuj szablon opłat'}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {showCreateForm 
                                            ? 'Wypełnij poniższe pola, aby utworzyć nowy szablon opłat.' 
                                            : 'Wprowadź zmiany w szablonie opłat.'
                                        }
                                    </p>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Ukryte pole property_id */}
                                    <input type="hidden" name="property_id" value={data.property_id} />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Nazwa opłaty *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                            Kwota *
                                        </label>
                                        <input
                                            type="number"
                                            id="amount"
                                            step="0.01"
                                            min="0"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="frequency_type" className="block text-sm font-medium text-gray-700">
                                            Częstotliwość *
                                        </label>
                                        <select
                                            id="frequency_type"
                                            value={data.frequency_type}
                                            onChange={handleFrequencyTypeChange}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        >
                                            {frequencyTypeOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.frequency_type && <p className="mt-1 text-sm text-red-600">{errors.frequency_type}</p>}
                                    </div>

                                    {showFrequencyValue && (
                                        <div>
                                            <label htmlFor="frequency_value" className="block text-sm font-medium text-gray-700">
                                                Wartość częstotliwości *
                                            </label>
                                            <input
                                                type="number"
                                                id="frequency_value"
                                                min="1"
                                                max="12"
                                                value={data.frequency_value || ''}
                                                onChange={(e) => setData('frequency_value', parseInt(e.target.value))}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                required
                                            />
                                            {errors.frequency_value && <p className="mt-1 text-sm text-red-600">{errors.frequency_value}</p>}
                                        </div>
                                    )}

                                    <div className="md:col-span-2">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Opis
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={3}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex items-center">
                                            <input
                                                id="is_active"
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                                Aktywny
                                            </label>
                                        </div>
                                        {errors.is_active && <p className="mt-1 text-sm text-red-600">{errors.is_active}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateForm(false);
                                            setShowEditForm(false);
                                            reset();
                                        }}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    >
                                        Anuluj
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {processing ? 'Zapisywanie...' : (showEditForm ? 'Zaktualizuj' : 'Utwórz')}
                                    </button>
                                </div>
                            </form>
                            
                            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setShowEditForm(false);
                                        setSelectedFeeType(null);
                                        reset();
                                    }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                >
                                    Anuluj
                                </button>
                            </div>
                        </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
