import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
// Icons replaced with HTML symbols

export default function Edit({ owner }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: owner.first_name || '',
        last_name: owner.last_name || '',
        email: owner.email || '',
        phone: owner.phone || '',
        address: owner.address || '',
        notes: owner.notes || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('owners.update', owner.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edytuj właściciela" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex items-center mb-6">
                                <Link
                                    href={route('owners.index')}
                                    className="mr-4 text-gray-600 hover:text-gray-900"
                                >
                                    <span className="w-5 h-5 text-lg">←</span>
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-900">Edytuj właściciela</h1>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="first_name" value="Imię" />
                                        <TextInput
                                            id="first_name"
                                            type="text"
                                            name="first_name"
                                            value={data.first_name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.first_name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="last_name" value="Nazwisko" />
                                        <TextInput
                                            id="last_name"
                                            type="text"
                                            name="last_name"
                                            value={data.last_name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.last_name} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="phone" value="Telefon" />
                                    <TextInput
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        value={data.phone}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    <InputError message={errors.phone} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="address" value="Adres" />
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={data.address}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        onChange={(e) => setData('address', e.target.value)}
                                    />
                                    <InputError message={errors.address} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="notes" value="Uwagi" />
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={data.notes}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={4}
                                        onChange={(e) => setData('notes', e.target.value)}
                                    />
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <Link
                                        href={route('owners.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Anuluj
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Zapisywanie...' : 'Zapisz'}
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
