import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function Index({ tenants }) {
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Czy na pewno chcesz usunąć tego najemcę?')) {
            router.delete(route('tenants.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Najemcy" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Najemcy</h2>
                                <Link
                                    href={route('tenants.create')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Dodaj najemcę
                                </Link>
                            </div>

                            {tenants.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">Brak najemców w systemie.</p>
                                    <Link
                                        href={route('tenants.create')}
                                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Dodaj pierwszego najemcę
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Imię i nazwisko
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Email
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Telefon
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Adres
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Akcje
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {tenants.data.map((tenant) => (
                                                    <tr key={tenant.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {tenant.first_name} {tenant.last_name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{tenant.email || '-'}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{tenant.phone || '-'}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                                {tenant.address || '-'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex justify-end space-x-2">
                                                                <Link
                                                                    href={route('tenants.show', tenant.id)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                >
                                                                    <EyeIcon className="w-4 h-4" />
                                                                </Link>
                                                                <Link
                                                                    href={route('tenants.edit', tenant.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    <PencilIcon className="w-4 h-4" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(tenant.id)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {tenants.links && (
                                        <div className="mt-6">
                                            <nav className="flex items-center justify-between">
                                                <div className="flex-1 flex justify-between sm:hidden">
                                                    {tenants.links.prev && (
                                                        <Link
                                                            href={tenants.links.prev}
                                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                        >
                                                            Poprzednia
                                                        </Link>
                                                    )}
                                                    {tenants.links.next && (
                                                        <Link
                                                            href={tenants.links.next}
                                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                        >
                                                            Następna
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-700">
                                                            Pokazuję <span className="font-medium">{tenants.from}</span> do{' '}
                                                            <span className="font-medium">{tenants.to}</span> z{' '}
                                                            <span className="font-medium">{tenants.total}</span> wyników
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                            {tenants.links.map((link, index) => (
                                                                <Link
                                                                    key={index}
                                                                    href={link.url || '#'}
                                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                        link.active
                                                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                                />
                                                            ))}
                                                        </nav>
                                                    </div>
                                                </div>
                                            </nav>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
