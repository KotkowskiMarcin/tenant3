import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { UserIcon, PlusIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Edit({ rental, properties, tenants, billingTypeOptions }) {
    const [showAddTenant, setShowAddTenant] = useState(false);
    const [newTenantId, setNewTenantId] = useState('');
    
    const { data, setData, patch, processing, errors } = useForm({
        property_id: rental.property_id || '',
        tenant_id: rental.tenants?.find(t => t.pivot?.is_primary)?.id || '',
        start_date: rental.start_date || '',
        end_date: rental.end_date || '',
        rent_amount: rental.rent_amount || '',
        deposit_amount: rental.deposit_amount || '',
        billing_type: rental.billing_type || '',
        invoice_data: rental.invoice_data || '',
        notes: rental.notes || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('rentals.update', rental.id));
    };

    const addTenant = (e) => {
        e.preventDefault();
        if (newTenantId) {
            router.post(route('rentals.tenants.add', rental.id), {
                tenant_id: newTenantId
            }, {
                onSuccess: () => {
                    setNewTenantId('');
                    setShowAddTenant(false);
                }
            });
        }
    };

    const removeTenant = (tenantId) => {
        if (confirm('Czy na pewno chcesz usunąć tego najemcę z najmu?')) {
            router.delete(route('rentals.tenants.remove', [rental.id, tenantId]));
        }
    };

    const setPrimaryTenant = (tenantId) => {
        if (confirm('Czy na pewno chcesz ustawić tego najemcę jako głównego?')) {
            router.patch(route('rentals.tenants.set-primary', [rental.id, tenantId]));
        }
    };

    // Filtruj najemców, którzy nie są już przypisani do tego najmu
    const availableTenants = tenants.filter(tenant => 
        !rental.tenants?.some(rentalTenant => rentalTenant.id === tenant.id)
    );

    return (
        <AuthenticatedLayout>
            <Head title="Edytuj najem" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Edytuj najem: {rental.property?.name} - {rental.tenants?.find(t => t.pivot?.is_primary)?.first_name || ''} {rental.tenants?.find(t => t.pivot?.is_primary)?.last_name || ''}
                                </h2>
                                <Link
                                    href={route('rentals.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Powrót do listy
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="property_id" className="block text-sm font-medium text-gray-700">
                                            Nieruchomość *
                                        </label>
                                        <select
                                            id="property_id"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.property_id}
                                            onChange={(e) => setData('property_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Wybierz nieruchomość</option>
                                            {properties.map((property) => (
                                                <option key={property.id} value={property.id}>
                                                    {property.name} - {property.address}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.property_id} className="mt-2" />
                                    </div>

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
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        rows={4}
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

                                {/* Panel zarządzania najemcami */}
                                <div className="border-t pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                            <UserIcon className="w-5 h-5 mr-2" />
                                            Najemcy ({rental.tenants?.length || 0})
                                        </h3>
                                        {availableTenants.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setShowAddTenant(!showAddTenant)}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <PlusIcon className="w-4 h-4 mr-1" />
                                                Dodaj najemcę
                                            </button>
                                        )}
                                    </div>

                                    {/* Lista najemców */}
                                    <div className="space-y-3">
                                        {rental.tenants?.map((tenant) => (
                                            <div key={tenant.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="flex items-center">
                                                            <span className="font-medium text-gray-900">
                                                                {tenant.first_name} {tenant.last_name}
                                                            </span>
                                                            {tenant.pivot?.is_primary && (
                                                                <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                                    Główny
                                                                </span>
                                                            )}
                                                        </div>
                                                        {tenant.email && (
                                                            <p className="text-sm text-gray-600">{tenant.email}</p>
                                                        )}
                                                        {tenant.phone && (
                                                            <p className="text-sm text-gray-600">{tenant.phone}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    {!tenant.pivot?.is_primary && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setPrimaryTenant(tenant.id)}
                                                            className="text-yellow-600 hover:text-yellow-900"
                                                            title="Ustaw jako głównego"
                                                        >
                                                            <StarIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {!tenant.pivot?.is_primary && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTenant(tenant.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Usuń z najmu"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Formularz dodawania najemcy */}
                                    {showAddTenant && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-900 mb-3">Dodaj nowego najemcę</h4>
                                            <form onSubmit={addTenant} className="flex space-x-3">
                                                <select
                                                    value={newTenantId}
                                                    onChange={(e) => setNewTenantId(e.target.value)}
                                                    className="flex-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    required
                                                >
                                                    <option value="">Wybierz najemcę</option>
                                                    {availableTenants.map((tenant) => (
                                                        <option key={tenant.id} value={tenant.id}>
                                                            {tenant.first_name} {tenant.last_name}{tenant.email ? ` - ${tenant.email}` : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                                >
                                                    Dodaj
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowAddTenant(false);
                                                        setNewTenantId('');
                                                    }}
                                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                                >
                                                    Anuluj
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <Link
                                        href={route('rentals.index')}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Anuluj
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Zapisywanie...' : 'Zapisz zmiany'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
