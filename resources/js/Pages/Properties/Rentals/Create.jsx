import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Create({ property, tenants }) {
    const { data, setData, post, processing, errors } = useForm({
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
        post(route('properties.rentals.store', property.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Dodaj najem - ${property.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <Link
                                            href={route('properties.show', property.id)}
                                            className="text-gray-600 hover:text-gray-900 mr-2"
                                        >
                                            <ArrowLeftIcon className="w-5 h-5" />
                                        </Link>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Dodaj najem - {property.name}
                                        </h2>
                                    </div>
                                    <p className="text-gray-600">{property.address}</p>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
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
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="billing_type"
                                                value="invoice"
                                                checked={data.billing_type === 'invoice'}
                                                onChange={(e) => setData('billing_type', e.target.value)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Faktura</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="billing_type"
                                                value="receipt"
                                                checked={data.billing_type === 'receipt'}
                                                onChange={(e) => setData('billing_type', e.target.value)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Paragon</span>
                                        </label>
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
                                        href={route('properties.show', property.id)}
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
