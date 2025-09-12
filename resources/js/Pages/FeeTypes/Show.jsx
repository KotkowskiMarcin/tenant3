import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeftIcon, PencilIcon, TrashIcon, CalendarDaysIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function Show({ feeType }) {
    const { flash } = usePage().props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('fee-types.destroy', feeType.id));
        setShowDeleteModal(false);
    };

    const getFrequencyDescription = () => {
        switch (feeType.frequency_type) {
            case 'monthly':
                return 'Co miesiąc';
            case 'quarterly':
                return `Co ${feeType.frequency_value} miesięcy`;
            case 'biannual':
                return 'Co pół roku (styczeń i lipiec)';
            case 'annual':
                return 'Raz w roku (styczeń)';
            case 'specific_month':
                return `W miesiącu ${feeType.frequency_value}`;
            default:
                return feeType.frequency_type;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href={route('fee-types.index')}
                            className="text-gray-500 hover:text-gray-700 mr-4"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            {feeType.name}
                        </h2>
                    </div>
                    <div className="flex space-x-2">
                        <Link
                            href={route('fee-types.schedule', feeType.id)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            <CalendarDaysIcon className="w-4 h-4 mr-2" />
                            Harmonogram
                        </Link>
                        <Link
                            href={route('fee-types.edit', feeType.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edytuj
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Usuń
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Szablon Opłaty - ${feeType.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Informacje podstawowe */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informacje podstawowe</h3>
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Nazwa</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{feeType.name}</dd>
                                        </div>
                                        
                                        {feeType.description && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Opis</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{feeType.description}</dd>
                                            </div>
                                        )}
                                        
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Kwota</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {feeType.amount.toLocaleString('pl-PL', {
                                                    style: 'currency',
                                                    currency: 'PLN'
                                                })}
                                            </dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Cykliczność</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{getFrequencyDescription()}</dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    feeType.is_active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {feeType.is_active ? 'Aktywny' : 'Nieaktywny'}
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Informacje o nieruchomości */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Nieruchomość</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900">{feeType.property.name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Właściciel: {feeType.property.owner.full_name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Email: {feeType.property.owner.email}
                                        </p>
                                        <div className="mt-3">
                                            <Link
                                                href={route('properties.show', feeType.property.id)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                                            >
                                                <EyeIcon className="w-4 h-4 mr-1" />
                                                Zobacz nieruchomość
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Historia płatności */}
                            {feeType.payments && feeType.payments.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Historia płatności</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Data
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Kwota
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Sposób płatności
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {feeType.payments.map((payment) => (
                                                    <tr key={payment.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {new Date(payment.payment_date).toLocaleDateString('pl-PL')}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {payment.amount.toLocaleString('pl-PL', {
                                                                style: 'currency',
                                                                currency: 'PLN'
                                                            })}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                payment.status === 'completed' 
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : payment.status === 'pending'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {payment.status === 'completed' ? 'Zakończone' :
                                                                 payment.status === 'pending' ? 'Oczekujące' : 'Nieudane'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {payment.payment_method === 'bank_transfer' ? 'Przelew bankowy' :
                                                             payment.payment_method === 'cash' ? 'Gotówka' :
                                                             payment.payment_method === 'card' ? 'Karta płatnicza' : 'Inne'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Informacje o dacie utworzenia */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-500">
                                    <p>Utworzono: {new Date(feeType.created_at).toLocaleDateString('pl-PL', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</p>
                                    <p>Ostatnia aktualizacja: {new Date(feeType.updated_at).toLocaleDateString('pl-PL', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</p>
                                </div>
                            </div>
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
                                    Czy na pewno chcesz dezaktywować szablon opłaty "{feeType.name}"?
                                    Ta akcja nie może zostać cofnięta.
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
