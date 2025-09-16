import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function RentalCreateModal({ show, onClose, property, tenants, billingTypeOptions }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        tenant_id: '',
        start_date: '',
        end_date: '',
        rent_amount: '',
        deposit_amount: '',
        billing_type: '',
        invoice_data: '',
        notes: '',
    });

    // Ustaw domyślną datę na dzisiejszy dzień
    useEffect(() => {
        if (show) {
            const today = new Date().toISOString().split('T')[0];
            setData('start_date', today);
            clearErrors();
            reset();
        }
    }, [show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('properties.rentals.store', property.id), {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const handleClose = () => {
        onClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>

                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

                <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Dodaj najem - {property.name}
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-600"
                                    onClick={handleClose}
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="tenant_id" className="block text-sm font-medium text-gray-700">
                                        Najemca *
                                    </label>
                                    <select
                                        id="tenant_id"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.tenant_id}
                                        onChange={(e) => setData('tenant_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Wybierz najemcę</option>
                                        {tenants.map((tenant) => (
                                            <option key={tenant.id} value={tenant.id}>
                                                {tenant.first_name} {tenant.last_name}{tenant.email ? ` - ${tenant.email}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.tenant_id} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                                            Data rozpoczęcia *
                                        </label>
                                        <TextInput
                                            id="start_date"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.start_date} className="mt-2" />
                                    </div>

                                    <div>
                                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                                            Data zakończenia
                                        </label>
                                        <TextInput
                                            id="end_date"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                        />
                                        <InputError message={errors.end_date} className="mt-2" />
                                        <p className="mt-1 text-sm text-gray-500">Pozostaw puste dla najmu bezterminowego</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="rent_amount" className="block text-sm font-medium text-gray-700">
                                            Kwota czynszu (PLN) *
                                        </label>
                                        <TextInput
                                            id="rent_amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="mt-1 block w-full"
                                            value={data.rent_amount}
                                            onChange={(e) => setData('rent_amount', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.rent_amount} className="mt-2" />
                                    </div>

                                    <div>
                                        <label htmlFor="deposit_amount" className="block text-sm font-medium text-gray-700">
                                            Kwota kaucji (PLN)
                                        </label>
                                        <TextInput
                                            id="deposit_amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="mt-1 block w-full"
                                            value={data.deposit_amount}
                                            onChange={(e) => setData('deposit_amount', e.target.value)}
                                        />
                                        <InputError message={errors.deposit_amount} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Sposób rozliczania
                                    </label>
                                    <div className="space-y-2">
                                        {billingTypeOptions.map((option) => (
                                            <label key={option.value} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="billing_type"
                                                    value={option.value}
                                                    checked={data.billing_type === option.value}
                                                    onChange={(e) => setData('billing_type', e.target.value)}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.billing_type} className="mt-2" />
                                </div>

                                <div>
                                    <label htmlFor="invoice_data" className="block text-sm font-medium text-gray-700">
                                        Dane do faktury
                                    </label>
                                    <textarea
                                        id="invoice_data"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        value={data.invoice_data}
                                        onChange={(e) => setData('invoice_data', e.target.value)}
                                        placeholder="Dane firmy, adres, NIP, itp."
                                    />
                                    <InputError message={errors.invoice_data} className="mt-2" />
                                </div>

                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                        Uwagi
                                    </label>
                                    <textarea
                                        id="notes"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                    />
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <PrimaryButton
                                type="submit"
                                className="w-full sm:ml-3 sm:w-auto"
                                disabled={processing}
                            >
                                {processing ? 'Zapisywanie...' : 'Zapisz najem'}
                            </PrimaryButton>
                            <button
                                type="button"
                                className="mt-3 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto"
                                onClick={handleClose}
                            >
                                Anuluj
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
