import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ properties, tenants, billingTypeOptions }) {
    const { data, setData, post, processing, errors } = useForm({
        property_id: '',
        primary_tenant_id: '',
        start_date: '',
        end_date: '',
        rent_amount: '',
        deposit_amount: '',
        billing_type: '',
        invoice_data: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('rentals.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dodaj najem" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Dodaj najem</h2>
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
                                        <label htmlFor="primary_tenant_id" className="block text-sm font-medium text-gray-700">
                                            Najemca główny *
                                        </label>
                                        <select
                                            id="primary_tenant_id"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.primary_tenant_id}
                                            onChange={(e) => setData('primary_tenant_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Wybierz najemcę głównego</option>
                                        {tenants.map((tenant) => (
                                            <option key={tenant.id} value={tenant.id}>
                                                {tenant.first_name} {tenant.last_name}{tenant.email ? ` - ${tenant.email}` : ''}
                                            </option>
                                        ))}
                                        </select>
                                        <InputError message={errors.primary_tenant_id} className="mt-2" />
                                        <p className="mt-1 text-sm text-gray-500">Najemca główny będzie odpowiedzialny za najem. Dodatkowych najemców można dodać później w panelu edycji.</p>
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

                                <div className="flex items-center justify-end space-x-4">
                                    <Link
                                        href={route('rentals.index')}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Anuluj
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Zapisywanie...' : 'Zapisz najem'}
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
