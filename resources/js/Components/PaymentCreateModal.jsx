import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { 
    XMarkIcon, 
    PlusIcon
} from '@heroicons/react/24/outline';

export default function PaymentCreateModal({ 
    isOpen, 
    onClose, 
    property, 
    feeTypes = [], 
    paymentMethodOptions = [],
    statusOptions = [],
    prefilledData = null,
    onSuccess
}) {
    const [selectedFeeType, setSelectedFeeType] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        property_id: property?.id || '',
        fee_type_id: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
        description: '',
        payment_method: 'bank_transfer',
        status: 'completed',
        reference_number: '',
        notes: '',
    });

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            reset();
            setSelectedFeeType(null);
            
            if (prefilledData) {
                // Użyj pre-wypełnionych danych
                setData({
                    property_id: property?.id || '',
                    fee_type_id: prefilledData.fee_type_id || '',
                    amount: prefilledData.amount || '',
                    payment_date: prefilledData.payment_date || new Date().toISOString().split('T')[0],
                    due_date: prefilledData.due_date || new Date().toISOString().split('T')[0],
                    description: prefilledData.description || '',
                    payment_method: prefilledData.payment_method || 'bank_transfer',
                    status: prefilledData.status || 'completed',
                    reference_number: prefilledData.reference_number || '',
                    notes: prefilledData.notes || '',
                });
            } else {
                // Ustaw aktualną datę dla due_date
                setData('due_date', new Date().toISOString().split('T')[0]);
            }
        }
    }, [isOpen, prefilledData]);

    // Update selected fee type when fee_type_id changes
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
        post(route('properties.payments.store', property.id), {
            onSuccess: () => {
                reset();
                setSelectedFeeType(null);
                onClose(); // Zamknij modal
                if (onSuccess) {
                    onSuccess();
                }
            }
        });
    };

    const filteredFeeTypes = feeTypes.filter(ft => ft.property_id == property?.id);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Nowa płatność - {property?.name}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="fee_type_id" className="block text-sm font-medium text-gray-700">
                                        Szablon opłaty *
                                    </label>
                                    <select
                                        id="fee_type_id"
                                        value={data.fee_type_id}
                                        onChange={(e) => setData('fee_type_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Wybierz szablon opłaty</option>
                                        {filteredFeeTypes.map((feeType) => (
                                            <option key={feeType.id} value={feeType.id}>
                                                {feeType.name} - {feeType.amount} zł
                                            </option>
                                        ))}
                                    </select>
                                    {errors.fee_type_id && <p className="mt-1 text-sm text-red-600">{errors.fee_type_id}</p>}
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
                                    <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700">
                                        Data płatności *
                                    </label>
                                    <input
                                        type="date"
                                        id="payment_date"
                                        value={data.payment_date}
                                        onChange={(e) => setData('payment_date', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.payment_date && <p className="mt-1 text-sm text-red-600">{errors.payment_date}</p>}
                                </div>

                                <div>
                                    <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                                        Termin płatności
                                    </label>
                                    <input
                                        type="date"
                                        id="due_date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>}
                                </div>

                                <div>
                                    <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                                        Sposób płatności *
                                    </label>
                                    <select
                                        id="payment_method"
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    >
                                        {paymentMethodOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.payment_method && <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>}
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                        Status *
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                </div>

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

                                <div>
                                    <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700">
                                        Numer referencyjny
                                    </label>
                                    <input
                                        type="text"
                                        id="reference_number"
                                        value={data.reference_number}
                                        onChange={(e) => setData('reference_number', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.reference_number && <p className="mt-1 text-sm text-red-600">{errors.reference_number}</p>}
                                </div>

                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                        Notatki
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                >
                                    {processing ? 'Zapisywanie...' : 'Utwórz płatność'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
