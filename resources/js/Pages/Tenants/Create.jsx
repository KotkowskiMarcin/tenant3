import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        pesel: '',
        id_number: '',
        other_id_document: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tenants.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dodaj najemcę" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Dodaj najemcę</h2>
                                <Link
                                    href={route('tenants.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Powrót do listy
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                            Imię *
                                        </label>
                                        <TextInput
                                            id="first_name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.first_name} className="mt-2" />
                                    </div>

                                    <div>
                                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                            Nazwisko *
                                        </label>
                                        <TextInput
                                            id="last_name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.last_name} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Telefon
                                        </label>
                                        <TextInput
                                            id="phone"
                                            type="tel"
                                            className="mt-1 block w-full"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                        <InputError message={errors.phone} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Adres
                                    </label>
                                    <textarea
                                        id="address"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                    />
                                    <InputError message={errors.address} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="pesel" className="block text-sm font-medium text-gray-700">
                                            PESEL
                                        </label>
                                        <TextInput
                                            id="pesel"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.pesel}
                                            onChange={(e) => setData('pesel', e.target.value)}
                                            maxLength={11}
                                        />
                                        <InputError message={errors.pesel} className="mt-2" />
                                    </div>

                                    <div>
                                        <label htmlFor="id_number" className="block text-sm font-medium text-gray-700">
                                            Numer dowodu osobistego
                                        </label>
                                        <TextInput
                                            id="id_number"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.id_number}
                                            onChange={(e) => setData('id_number', e.target.value)}
                                        />
                                        <InputError message={errors.id_number} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="other_id_document" className="block text-sm font-medium text-gray-700">
                                        Inny dokument tożsamości
                                    </label>
                                    <textarea
                                        id="other_id_document"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        value={data.other_id_document}
                                        onChange={(e) => setData('other_id_document', e.target.value)}
                                    />
                                    <InputError message={errors.other_id_document} className="mt-2" />
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
                                        href={route('tenants.index')}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Anuluj
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Zapisywanie...' : 'Zapisz najemcę'}
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
