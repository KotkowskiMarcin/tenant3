import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Create({ properties, feeTypes, selectedPropertyId, paymentMethodOptions, statusOptions }) {
    const { data, setData, post, processing, errors } = useForm({
        property_id: selectedPropertyId || '',
        fee_type_id: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        due_date: '',
        description: '',
        payment_method: 'bank_transfer',
        status: 'completed',
        reference_number: '',
        notes: '',
    });

    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedFeeType, setSelectedFeeType] = useState(null);

    useEffect(() => {
        if (data.property_id) {
            const property = properties.find(p => p.id == data.property_id);
            setSelectedProperty(property);
        } else {
            setSelectedProperty(null);
        }
    }, [data.property_id, properties]);

    useEffect(() => {
        if (data.fee_type_id) {
            const feeType = feeTypes.find(ft => ft.id == data.fee_type_id);
            setSelectedFeeType(feeType);
            if (feeType) {
                setData('amount', feeType.amount);
                setData('description', feeType.description || feeType.name);
            }
        } else {
            setSelectedFeeType(null);
        }
    }, [data.fee_type_id, feeTypes]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payments.store'));
    };

    const filteredFeeTypes = selectedProperty 
        ? feeTypes.filter(ft => ft.property_id == selectedProperty.id)
        : feeTypes;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center">
                    <a
                        href={route('payments.index')}
                        className="text-gray-500 hover:text-gray-700 mr-4"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </a>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Nowa Płatność
                    </h2>
                </div>
            }
        >
            <Head title="Nowa Płatność" />

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
                                        <label htmlFor="fee_type_id" className="block text-sm font-medium text-gray-700">
                                            Typ opłaty
                                        </label>
                                        <select
                                            id="fee_type_id"
                                            value={data.fee_type_id}
                                            onChange={(e) => setData('fee_type_id', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            disabled={!selectedProperty}
                                        >
                                            <option value="">Płatność ad-hoc</option>
                                            {filteredFeeTypes.map((feeType) => (
                                                <option key={feeType.id} value={feeType.id}>
                                                    {feeType.name} - {feeType.amount.toLocaleString('pl-PL', {
                                                        style: 'currency',
                                                        currency: 'PLN'
                                                    })}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.fee_type_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.fee_type_id}</p>
                                        )}
                                        {!selectedProperty && (
                                            <p className="mt-1 text-sm text-gray-500">Wybierz najpierw nieruchomość</p>
                                        )}
                                    </div>
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
                                        <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700">
                                            Data płatności *
                                        </label>
                                        <input
                                            type="date"
                                            id="payment_date"
                                            value={data.payment_date}
                                            onChange={(e) => setData('payment_date', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.payment_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.payment_date}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                                            Termin płatności
                                        </label>
                                        <input
                                            type="date"
                                            id="due_date"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.due_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                                            Sposób płatności *
                                        </label>
                                        <select
                                            id="payment_method"
                                            value={data.payment_method}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            {Object.entries(paymentMethodOptions).map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.payment_method && (
                                            <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                            Status *
                                        </label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            {Object.entries(statusOptions).map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700">
                                            Numer referencyjny
                                        </label>
                                        <input
                                            type="text"
                                            id="reference_number"
                                            value={data.reference_number}
                                            onChange={(e) => setData('reference_number', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="np. 123456789"
                                        />
                                        {errors.reference_number && (
                                            <p className="mt-1 text-sm text-red-600">{errors.reference_number}</p>
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
                                        placeholder="Opis płatności..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                        Notatki
                                    </label>
                                    <textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Dodatkowe notatki..."
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                    )}
                                </div>

                                {/* Podgląd wybranego typu opłaty */}
                                {selectedFeeType && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="font-medium text-blue-900 mb-2">Wybrany typ opłaty:</h4>
                                        <div className="text-sm text-blue-800">
                                            <p><strong>Nazwa:</strong> {selectedFeeType.name}</p>
                                            <p><strong>Kwota:</strong> {selectedFeeType.amount.toLocaleString('pl-PL', {
                                                style: 'currency',
                                                currency: 'PLN'
                                            })}</p>
                                            <p><strong>Cykliczność:</strong> {selectedFeeType.frequency_type_label}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-end space-x-4">
                                    <a
                                        href={route('payments.index')}
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
