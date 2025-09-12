import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// Icons replaced with HTML symbols

export default function Show({ owner }) {
    const handleDelete = () => {
        if (confirm('Czy na pewno chcesz usunąć tego właściciela?')) {
            router.delete(route('owners.destroy', owner.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Właściciel - ${owner.first_name} ${owner.last_name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <Link
                                        href={route('owners.index')}
                                        className="mr-4 text-gray-600 hover:text-gray-900"
                                    >
                                        <span className="w-5 h-5 text-lg">←</span>
                                    </Link>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {owner.first_name} {owner.last_name}
                                    </h1>
                                </div>
                                <div className="flex space-x-2">
                                    <Link
                                        href={route('owners.edit', owner.id)}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <span className="w-4 h-4 mr-2">✏️</span>
                                        Edytuj
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <span className="w-4 h-4 mr-2">🗑️</span>
                                        Usuń
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Informacje podstawowe */}
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Informacje podstawowe</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <span className="w-5 h-5 text-gray-400 mt-1 mr-3">📧</span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Email</p>
                                                <p className="text-sm text-gray-900">{owner.email}</p>
                                            </div>
                                        </div>

                                        {owner.phone && (
                                            <div className="flex items-start">
                                                <span className="w-5 h-5 text-gray-400 mt-1 mr-3">📞</span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Telefon</p>
                                                    <p className="text-sm text-gray-900">{owner.phone}</p>
                                                </div>
                                            </div>
                                        )}

                                        {owner.address && (
                                            <div className="flex items-start">
                                                <span className="w-5 h-5 text-gray-400 mt-1 mr-3">📍</span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Adres</p>
                                                    <p className="text-sm text-gray-900 whitespace-pre-line">{owner.address}</p>
                                                </div>
                                            </div>
                                        )}

                                        {owner.notes && (
                                            <div className="flex items-start">
                                                <span className="w-5 h-5 text-gray-400 mt-1 mr-3">📄</span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Uwagi</p>
                                                    <p className="text-sm text-gray-900 whitespace-pre-line">{owner.notes}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Nieruchomości */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-medium text-gray-900">Nieruchomości</h2>
                                        <Link
                                            href={route('properties.create', { owner_id: owner.id })}
                                            className="inline-flex items-center px-3 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            <span className="w-4 h-4 mr-1">🏠</span>
                                            Dodaj nieruchomość
                                        </Link>
                                    </div>

                                    {owner.properties && owner.properties.length > 0 ? (
                                        <div className="space-y-3">
                                            {owner.properties.map((property) => (
                                                <div key={property.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-900">
                                                                <Link
                                                                    href={route('properties.show', property.id)}
                                                                    className="hover:text-blue-600"
                                                                >
                                                                    {property.name}
                                                                </Link>
                                                            </h3>
                                                            <p className="text-sm text-gray-500 mt-1">{property.address}</p>
                                                            <div className="flex items-center mt-2 space-x-4">
                                                                {property.area && (
                                                                    <span className="text-xs text-gray-500">
                                                                        {property.area} m²
                                                                    </span>
                                                                )}
                                                                {property.rooms && (
                                                                    <span className="text-xs text-gray-500">
                                                                        {property.rooms} pokoi
                                                                    </span>
                                                                )}
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                    property.status === 'available' ? 'bg-green-100 text-green-800' :
                                                                    property.status === 'rented' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {property.status_label}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <span className="w-12 h-12 text-gray-400 mx-auto mb-4 text-4xl">🏠</span>
                                            <p className="text-gray-500">Brak nieruchomości</p>
                                            <Link
                                                href={route('properties.create', { owner_id: owner.id })}
                                                className="text-blue-600 hover:text-blue-500 text-sm"
                                            >
                                                Dodaj pierwszą nieruchomość
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
