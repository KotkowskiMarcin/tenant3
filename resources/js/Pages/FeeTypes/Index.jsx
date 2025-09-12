import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { PlusIcon, PencilIcon, EyeIcon, TrashIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function Index({ feeTypes, frequencyTypeOptions, property, isPropertySpecific }) {
    const page = usePage();
    
    const pageProps = page?.props || {};
    const flash = pageProps?.flash || {};
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedFeeType, setSelectedFeeType] = useState(null);


    // Zabezpieczenia przed undefined
    if (!feeTypes || !frequencyTypeOptions) {
        return (
            <AuthenticatedLayout
                header={
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            {isPropertySpecific ? `Szablony Opłat - ${property?.name}` : 'Szablony Opłat'}
                        </h2>
                    </div>
                }
            >
                <Head title={isPropertySpecific ? `Szablony Opłat - ${property?.name}` : "Szablony Opłat"} />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Ładowanie...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const handleDelete = (feeType) => {
        setSelectedFeeType(feeType);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedFeeType) {
            router.delete(route('fee-types.destroy', selectedFeeType.id), {
                onSuccess: () => {
                    if (isPropertySpecific) {
                        router.visit(route('properties.fee-types.index', property.id));
                    }
                }
            });
        }
        setShowDeleteModal(false);
        setSelectedFeeType(null);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {isPropertySpecific ? `Szablony Opłat - ${property?.name}` : 'Szablony Opłat'}
                    </h2>
                    <div className="flex space-x-3">
                        {isPropertySpecific && (
                            <Link
                                href={route('properties.show', property.id)}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                            >
                                ← Powrót do nieruchomości
                            </Link>
                        )}
                        <Link
                            href={isPropertySpecific ? route('properties.fee-types.create', property.id) : route('fee-types.create')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Nowy Szablon
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={isPropertySpecific ? `Szablony Opłat - ${property?.name}` : "Szablony Opłat"} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {(!feeTypes.data || feeTypes.data.length === 0) ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">Brak szablonów opłat.</p>
                                    <Link
                                        href={route('fee-types.create')}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Utwórz pierwszy szablon
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nazwa
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nieruchomość
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kwota
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Cykliczność
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
                                            {feeTypes.data.map((feeType) => (
                                                <tr key={feeType.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {feeType.name}
                                                            </div>
                                                            {feeType.description && (
                                                                <div className="text-sm text-gray-500">
                                                                    {feeType.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {feeType.property.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {feeType.property.owner.full_name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {feeType.amount.toLocaleString('pl-PL', {
                                                            style: 'currency',
                                                            currency: 'PLN'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {frequencyTypeOptions[feeType.frequency_type]}
                                                        </div>
                                                        {feeType.frequency_value && (
                                                            <div className="text-sm text-gray-500">
                                                                {feeType.frequency_value} miesięcy
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            feeType.is_active 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {feeType.is_active ? 'Aktywny' : 'Nieaktywny'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('fee-types.show', feeType.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <EyeIcon className="w-4 h-4" />
                                                            </Link>
                                                            <Link
                                                                href={isPropertySpecific ? route('fee-types.edit', feeType.id) : route('fee-types.edit', feeType.id)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                <PencilIcon className="w-4 h-4" />
                                                            </Link>
                                                            <Link
                                                                href={route('fee-types.schedule', feeType.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                <CalendarDaysIcon className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(feeType)}
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

                            {feeTypes.links && feeTypes.links.length > 0 && (
                                <div className="mt-4">
                                    <nav className="flex items-center justify-between">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            {feeTypes.links.prev && (
                                                <Link
                                                    href={feeTypes.links.prev}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    Poprzednia
                                                </Link>
                                            )}
                                            {feeTypes.links.next && (
                                                <Link
                                                    href={feeTypes.links.next}
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
                                                    <span className="font-medium">{feeTypes.from || 0}</span> do{' '}
                                                    <span className="font-medium">{feeTypes.to || 0}</span> z{' '}
                                                    <span className="font-medium">{feeTypes.total || 0}</span> wyników
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                    {feeTypes.links && feeTypes.links.length > 0 && feeTypes.links.map((link, index) => (
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
                                    Czy na pewno chcesz dezaktywować szablon opłaty "{selectedFeeType?.name}"?
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
