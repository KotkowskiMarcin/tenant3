import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
// Icons replaced with HTML symbols

export default function Edit({ property, owners, statusOptions }) {
    const { data, setData, put, processing, errors } = useForm({
        name: property.name || '',
        address: property.address || '',
        area: property.area || '',
        rooms: property.rooms || '',
        description: property.description || '',
        cooperative_info: property.cooperative_info || '',
        status: property.status || 'available',
        owner_id: property.owner_id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('properties.update', property.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edytuj nieruchomość" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex items-center mb-6">
                                <Link
                                    href={route('properties.index')}
                                    className="mr-4 text-gray-600 hover:text-gray-900"
                                >
                                    <span className="w-5 h-5 text-lg">←</span>
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-900">Edytuj nieruchomość</h1>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Nazwa nieruchomości" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
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
                                        required
                                    />
                                    <InputError message={errors.address} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="area" value="Powierzchnia (m²)" />
                                        <TextInput
                                            id="area"
                                            type="number"
                                            name="area"
                                            value={data.area}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('area', e.target.value)}
                                            step="0.01"
                                            min="0"
                                        />
                                        <InputError message={errors.area} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="rooms" value="Liczba pokoi" />
                                        <TextInput
                                            id="rooms"
                                            type="number"
                                            name="rooms"
                                            value={data.rooms}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('rooms', e.target.value)}
                                            min="0"
                                        />
                                        <InputError message={errors.rooms} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Opis" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={4}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="cooperative_info" value="Spółdzielnia/Wspólnota mieszkaniowa" />
                                    <textarea
                                        id="cooperative_info"
                                        name="cooperative_info"
                                        value={data.cooperative_info}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        onChange={(e) => setData('cooperative_info', e.target.value)}
                                        placeholder="Wprowadź informacje o spółdzielni lub wspólnocie mieszkaniowej..."
                                    />
                                    <InputError message={errors.cooperative_info} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="status" value="Status" />
                                        <select
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('status', e.target.value)}
                                            required
                                        >
                                            {Object.entries(statusOptions).map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="owner_id" value="Właściciel" />
                                        <select
                                            id="owner_id"
                                            name="owner_id"
                                            value={data.owner_id}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('owner_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Wybierz właściciela</option>
                                            {owners.map((owner) => (
                                                <option key={owner.id} value={owner.id}>
                                                    {owner.first_name} {owner.last_name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.owner_id} className="mt-2" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <Link
                                        href={route('properties.index')}
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
