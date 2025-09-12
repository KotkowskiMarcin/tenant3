import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function PaymentEditModal({ 
    isOpen, 
    onClose, 
    payment, 
    property,
    feeTypes = [], 
    paymentMethodOptions = [], 
    statusOptions = [],
    onSuccess 
}) {
    const { data, setData, patch, processing, errors, reset, clearErrors } = useForm({
        property_id: '',
        fee_type_id: '',
        amount: '',
        payment_date: '',
        payment_method: '',
        status: '',
        description: ''
    });

    useEffect(() => {
        if (payment && isOpen) {
            clearErrors();
            reset();
            setData({
                property_id: property?.id || payment.property_id || '',
                fee_type_id: payment.fee_type_id || '',
                amount: payment.amount || '',
                payment_date: payment.payment_date ? payment.payment_date.split('T')[0] : '',
                payment_method: payment.payment_method || '',
                status: payment.status || '',
                description: payment.description || ''
            });
        }
    }, [payment, property, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        patch(route('payments.update', payment.id), {
            onSuccess: () => {
                onSuccess && onSuccess();
                onClose();
            }
        });
    };

    const handleClose = () => {
        clearErrors();
        onClose();
    };

    return (
        <Modal show={isOpen} onClose={handleClose}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">
                        Edytuj płatność
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Ukryte pole property_id */}
                    <input type="hidden" name="property_id" value={data.property_id} />
                    
                    <div className="space-y-4">
                        {/* Typ opłaty */}
                        <div>
                            <InputLabel htmlFor="fee_type_id" value="Typ opłaty" />
                            <select
                                id="fee_type_id"
                                value={data.fee_type_id}
                                onChange={(e) => setData('fee_type_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">Wybierz typ opłaty</option>
                                {feeTypes.map((feeType) => (
                                    <option key={feeType.id} value={feeType.id}>
                                        {feeType.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.fee_type_id} className="mt-2" />
                        </div>

                        {/* Kwota */}
                        <div>
                            <InputLabel htmlFor="amount" value="Kwota" />
                            <TextInput
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="0.00"
                            />
                            <InputError message={errors.amount} className="mt-2" />
                        </div>

                        {/* Data płatności */}
                        <div>
                            <InputLabel htmlFor="payment_date" value="Data płatności" />
                            <TextInput
                                id="payment_date"
                                type="date"
                                value={data.payment_date}
                                onChange={(e) => setData('payment_date', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.payment_date} className="mt-2" />
                        </div>

                        {/* Sposób płatności */}
                        <div>
                            <InputLabel htmlFor="payment_method" value="Sposób płatności" />
                            <select
                                id="payment_method"
                                value={data.payment_method}
                                onChange={(e) => setData('payment_method', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">Wybierz sposób płatności</option>
                                {paymentMethodOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.payment_method} className="mt-2" />
                        </div>

                        {/* Status */}
                        <div>
                            <InputLabel htmlFor="status" value="Status" />
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">Wybierz status</option>
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.status} className="mt-2" />
                        </div>

                        {/* Opis */}
                        <div>
                            <InputLabel htmlFor="description" value="Opis" />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows={3}
                                placeholder="Opcjonalny opis płatności"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Anuluj
                        </button>
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Zapisywanie...' : 'Zapisz zmiany'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
