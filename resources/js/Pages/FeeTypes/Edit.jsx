import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ feeType, properties, frequencyTypeOptions }) {
    const { data, setData, put, processing, errors } = useForm({
        property_id: feeType.property_id,
        name: feeType.name,
        description: feeType.description || '',
        amount: feeType.amount,
        frequency_type: feeType.frequency_type,
        frequency_value: feeType.frequency_value,
        is_active: feeType.is_active,
    });

    const [showFrequencyValue, setShowFrequencyValue] = useState(false);

    useEffect(() => {
        setShowFrequencyValue(['quarterly', 'specific_month'].includes(data.frequency_type));
    }, [data.frequency_type]);

    const handleFrequencyTypeChange = (e) => {
        const value = e.target.value;
        setData('frequency_type', value);
        
        // Show frequency_value field for specific types
        setShowFrequencyValue(['quarterly', 'specific_month'].includes(value));
        
        // Clear frequency_value when not needed
        if (!['quarterly', 'specific_month'].includes(value)) {
            setData('frequency_value', null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('fee-types.update', feeType.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center">
                    <a
                        href={route('fee-types.index')}
                        className="text-gray-500 hover:text-gray-700 mr-4"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </a>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edytuj Szablon Opłaty
                    </h2>
                </div>
            }
        >
            <Head title="Edytuj Szablon Opłaty" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="property_id" className="block text-sm font-medium text-gray-700">
                                            Nieruchomość *
                                        </label>
                                        <select
                                            id="property_id"
                                            value={data.property_id}
                                            onChange={(e) => setData('property_id', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">Wybierz nieruchomość</option>
                                            {properties.map((property) => (
                                                <option key={property.id} value={property.id}>
                                                    {property.name} - {property.owner.full_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.property_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.property_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Nazwa opłaty *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="np. Czynsz spółdzielni"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Opis
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Szczegółowy opis opłaty..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                            Kwota (PLN) *
                                        </label>
                                        <input
                                            type="number"
                                            id="amount"
                                            step="0.01"
                                            min="0"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="0.00"
                                        />
                                        {errors.amount && (
                                            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="frequency_type" className="block text-sm font-medium text-gray-700">
                                            Typ cykliczności *
                                        </label>
                                        <select
                                            id="frequency_type"
                                            value={data.frequency_type}
                                            onChange={handleFrequencyTypeChange}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            {Object.entries(frequencyTypeOptions).map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.frequency_type && (
                                            <p className="mt-1 text-sm text-red-600">{errors.frequency_type}</p>
                                        )}
                                    </div>
                                </div>

                                {showFrequencyValue && (
                                    <div>
                                        <label htmlFor="frequency_value" className="block text-sm font-medium text-gray-700">
                                            {data.frequency_type === 'quarterly' ? 'Co ile miesięcy' : 'Miesiąc'} *
                                        </label>
                                        <input
                                            type="number"
                                            id="frequency_value"
                                            min="1"
                                            max="12"
                                            value={data.frequency_value || ''}
                                            onChange={(e) => setData('frequency_value', parseInt(e.target.value))}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder={data.frequency_type === 'quarterly' ? '3' : '1'}
                                        />
                                        {errors.frequency_value && (
                                            <p className="mt-1 text-sm text-red-600">{errors.frequency_value}</p>
                                        )}
                                        <p className="mt-1 text-sm text-gray-500">
                                            {data.frequency_type === 'quarterly' 
                                                ? 'Wprowadź liczbę miesięcy (1-12)'
                                                : 'Wprowadź numer miesiąca (1-12)'
                                            }
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center">
                                    <input
                                        id="is_active"
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                        Szablon aktywny
                                    </label>
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <a
                                        href={route('fee-types.index')}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    >
                                        Anuluj
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {processing ? 'Zapisywanie...' : 'Zapisz'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
