import { 
    XMarkIcon, 
    BoltIcon,
    DocumentTextIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function MeterEditModal({ 
    meter, 
    isOpen, 
    onClose, 
    isCreating = false,
    property = null,
}) {
    const { data, setData, processing, errors, reset, clearErrors } = useForm({
        name: '',
        serial_number: '',
        provider: '',
        current_reading: '',
        unit: '',
        price_per_unit: ''
    });

    // Reset form when modal opens with meter data
    useEffect(() => {
        if (isOpen && meter && !isCreating) {
            clearErrors();
            reset();
            setData({
                name: meter.name || '',
                serial_number: meter.serial_number || '',
                provider: meter.provider || '',
                current_reading: meter.current_reading || '',
                unit: meter.unit || '',
                price_per_unit: meter.price_per_unit || ''
            });
        } else if (isOpen && isCreating) {
            clearErrors();
            reset();
        }
    }, [isOpen, meter, isCreating, clearErrors, reset, setData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submitData = {
            ...data,
            property_id: property?.id,
            current_reading: parseFloat(data.current_reading),
            price_per_unit: parseFloat(data.price_per_unit),
        };

        if (isCreating && property) {
            router.post(route('properties.meters.store', property.id), submitData, {
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    console.error('Error creating meter:', errors);
                }
            });
        } else if (meter) {
            router.post(route('property-meters.update', meter.id), {
                ...submitData,
                _method: 'patch'
            }, {
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    console.error('Error updating meter:', errors);
                }
            });
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[60]">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <BoltIcon className="h-8 w-8 text-blue-600 mr-3" />
                            <h3 className="text-lg font-medium text-gray-900">
                                {isCreating ? 'Dodaj nowy licznik' : 'Edytuj licznik'}
                            </h3>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nazwa licznika */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nazwa licznika *
                                </label>
                                <div className="relative">
                                    <BoltIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="np. Licznik prądu, Licznik gazu"
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Numer seryjny */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Numer seryjny *
                                </label>
                                <input
                                    type="text"
                                    value={data.serial_number}
                                    onChange={(e) => setData('serial_number', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Numer seryjny licznika"
                                    required
                                />
                                {errors.serial_number && (
                                    <p className="mt-1 text-sm text-red-600">{errors.serial_number}</p>
                                )}
                            </div>

                            {/* Jednostka */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jednostka pomiarowa *
                                </label>
                                <select
                                    value={data.unit}
                                    onChange={(e) => setData('unit', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="kWh">kWh (kilowatogodziny)</option>
                                    <option value="m³">m³ (metry sześcienne)</option>
                                    <option value="GJ">GJ (gigadżule)</option>
                                    <option value="MWh">MWh (megawatogodziny)</option>
                                    <option value="l">l (litry)</option>
                                    <option value="kg">kg (kilogramy)</option>
                                    <option value="t">t (tony)</option>
                                </select>
                                {errors.unit && (
                                    <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                                )}
                            </div>

                            {/* Aktualny stan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Aktualny stan licznika *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.current_reading}
                                    onChange={(e) => setData('current_reading', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="0.00"
                                    required
                                />
                                {errors.current_reading && (
                                    <p className="mt-1 text-sm text-red-600">{errors.current_reading}</p>
                                )}
                            </div>

                            {/* Cena za jednostkę */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cena za jednostkę (zł) *
                                </label>
                                <div className="relative">
                                    <CurrencyDollarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="number"
                                        step="0.0001"
                                        min="0"
                                        value={data.price_per_unit}
                                        onChange={(e) => setData('price_per_unit', e.target.value)}
                                        className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="0.0000"
                                        required
                                    />
                                </div>
                                {errors.price_per_unit && (
                                    <p className="mt-1 text-sm text-red-600">{errors.price_per_unit}</p>
                                )}
                            </div>
                        </div>

                        {/* Dostawca usług */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dostawca usług
                            </label>
                            <div className="relative">
                                <DocumentTextIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <textarea
                                    value={data.provider}
                                    onChange={(e) => setData('provider', e.target.value)}
                                    rows={3}
                                    className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Nazwa firmy dostarczającej usługi (np. Tauron, PGNiG, Veolia)"
                                />
                            </div>
                            {errors.provider && (
                                <p className="mt-1 text-sm text-red-600">{errors.provider}</p>
                            )}
                        </div>


                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Anuluj
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {processing ? 'Zapisywanie...' : (isCreating ? 'Dodaj licznik' : 'Zapisz zmiany')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
