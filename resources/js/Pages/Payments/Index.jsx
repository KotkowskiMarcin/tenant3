import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { PlusIcon, PencilIcon, EyeIcon, TrashIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function Index({ payments, feeTypes, filters, paymentMethodOptions, statusOptions, property, isPropertySpecific }) {
    const page = usePage();
    const pageProps = page?.props || {};
    const flash = pageProps?.flash || {};
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const handleDelete = (payment) => {
        setSelectedPayment(payment);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedPayment) {
            router.delete(route('payments.destroy', selectedPayment.id), {
                onSuccess: () => {
                    if (isPropertySpecific) {
                        router.visit(route('properties.payments.index', property.id));
                    }
                }
            });
        }
        setShowDeleteModal(false);
        setSelectedPayment(null);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {isPropertySpecific ? `Płatności - ${property?.name}` : 'Płatności'}
                    </h2>
                    <div className="flex space-x-2">
                        {isPropertySpecific && (
                            <Link
                                href={route('properties.show', property.id)}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                            >
                                ← Powrót do nieruchomości
                            </Link>
                        )}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            <FunnelIcon className="w-4 h-4 mr-2" />
                            Filtry
                        </button>
                        <Link
                            href={isPropertySpecific ? route('properties.payments.create', property.id) : route('payments.create')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Nowa Płatność
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={isPropertySpecific ? `Płatności - ${property?.name}` : "Płatności"} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {flash.success}
                        </div>
                    )}

                    {/* Filters */}
                    {showFilters && (
                        <div className="bg-white p-4 rounded-lg shadow mb-6">
                            <form method="GET" className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Data od</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        defaultValue={filters.start_date || ''}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Data do</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        defaultValue={filters.end_date || ''}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Typ opłaty</label>
                                    <select
                                        name="fee_type_id"
                                        defaultValue={filters.fee_type_id || ''}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">Wszystkie</option>
                                        {feeTypes.map((feeType) => (
                                            <option key={feeType.id} value={feeType.id}>
                                                {feeType.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        name="status"
                                        defaultValue={filters.status || ''}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">Wszystkie</option>
                                        {Object.entries(statusOptions).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Kwota min</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="min_amount"
                                        defaultValue={filters.min_amount || ''}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Kwota max</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="max_amount"
                                        defaultValue={filters.max_amount || ''}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="md:col-span-3 lg:col-span-6 flex space-x-2">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Zastosuj filtry
                                    </button>
                                    <a
                                        href={route('payments.index')}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Wyczyść
                                    </a>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {payments.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">Brak płatności.</p>
                                    <Link
                                        href={route('payments.create')}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Utwórz pierwszą płatność
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Data
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nieruchomość
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Opłata
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kwota
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Sposób płatności
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Akcje
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {payments.data.map((payment) => (
                                                <tr key={payment.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(payment.payment_date).toLocaleDateString('pl-PL')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {payment.property.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {payment.property.owner.full_name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {payment.fee_type ? payment.fee_type.name : 'Płatność ad-hoc'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {payment.amount.toLocaleString('pl-PL', {
                                                            style: 'currency',
                                                            currency: 'PLN'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {paymentMethodOptions[payment.payment_method]}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            payment.status === 'completed' 
                                                                ? 'bg-green-100 text-green-800'
                                                                : payment.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {statusOptions[payment.status]}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('payments.show', payment.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <EyeIcon className="w-4 h-4" />
                                                            </Link>
                                                            <Link
                                                                href={route('payments.edit', payment.id)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                <PencilIcon className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(payment)}
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
                            )}

                            {payments.links && (
                                <div className="mt-4">
                                    <nav className="flex items-center justify-between">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            {payments.links.prev && (
                                                <Link
                                                    href={payments.links.prev}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    Poprzednia
                                                </Link>
                                            )}
                                            {payments.links.next && (
                                                <Link
                                                    href={payments.links.next}
                                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    Następna
                                                </Link>
                                            )}
                                        </div>
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Pokazuję{' '}
                                                    <span className="font-medium">{payments.from}</span> do{' '}
                                                    <span className="font-medium">{payments.to}</span> z{' '}
                                                    <span className="font-medium">{payments.total}</span> wyników
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                    {payments.links.map((link, index) => (
                                                        <Link
                                                            key={index}
                                                            href={link.url || '#'}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                link.active
                                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    ))}
                                                </nav>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <TrashIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-4">
                                Potwierdź usunięcie
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Czy na pewno chcesz usunąć tę płatność? Ta akcja nie może zostać cofnięta.
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                                >
                                    Usuń
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Anuluj
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
