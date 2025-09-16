import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { 
    PlusIcon, 
    EyeIcon, 
    PencilIcon, 
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    CalendarIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function Index({ rental, settlements }) {
    const [expandedRows, setExpandedRows] = useState(new Set());

    const toggleRow = (settlementId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(settlementId)) {
            newExpanded.delete(settlementId);
        } else {
            newExpanded.add(settlementId);
        }
        setExpandedRows(newExpanded);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid':
                return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
            case 'issued':
                return <ClockIcon className="w-5 h-5 text-yellow-500" />;
            case 'unpaid':
                return <XCircleIcon className="w-5 h-5 text-red-500" />;
            default:
                return <ClockIcon className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'issued':
                return 'bg-yellow-100 text-yellow-800';
            case 'unpaid':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'paid':
                return 'Zapłacony';
            case 'issued':
                return 'Wystawiony';
            case 'unpaid':
                return 'Niezapłacony';
            default:
                return 'Nieznany';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pl-PL');
    };

    const handleMarkAsPaid = (settlement) => {
        if (confirm('Czy na pewno chcesz oznaczyć to rozliczenie jako opłacone?')) {
            router.post(route('rentals.monthly-settlements.mark-paid', [rental.id, settlement.id]), {}, {
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (settlement) => {
        if (confirm('Czy na pewno chcesz usunąć to rozliczenie? Ta operacja nie może zostać cofnięta.')) {
            router.delete(route('rentals.monthly-settlements.destroy', [rental.id, settlement.id]), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Rozliczenia miesięczne - ${rental.property?.address || 'Najem'}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Rozliczenia miesięczne
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Najem: {rental.property?.address || 'Brak adresu'}
                                    </p>
                                    {rental.tenants && rental.tenants.length > 0 && (
                                        <p className="text-sm text-gray-500">
                                            Najemca: {rental.tenants[0].first_name} {rental.tenants[0].last_name}
                                        </p>
                                    )}
                                </div>
                                <Link
                                    href={route('rentals.monthly-settlements.create', rental.id)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Generuj nowe rozliczenie
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Settlements Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {settlements.length === 0 ? (
                                <div className="text-center py-12">
                                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Brak rozliczeń</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Zacznij od utworzenia pierwszego rozliczenia miesięcznego.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('rentals.monthly-settlements.create', rental.id)}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            <PlusIcon className="w-4 h-4 mr-2" />
                                            Generuj nowe rozliczenie
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Okres
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kwota
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Data wystawienia
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Data zapłaty
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Akcje
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {settlements.map((settlement) => (
                                                <>
                                                    <tr key={settlement.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {settlement.formatted_date}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <CurrencyDollarIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {settlement.formatted_amount}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {getStatusIcon(settlement.status)}
                                                                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(settlement.status)}`}>
                                                                    {getStatusLabel(settlement.status)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {settlement.issued_at ? formatDate(settlement.issued_at) : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {settlement.paid_at ? formatDate(settlement.paid_at) : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => toggleRow(settlement.id)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                    title="Pokaż/ukryj składniki"
                                                                >
                                                                    <EyeIcon className="w-4 h-4" />
                                                                </button>
                                                                <Link
                                                                    href={route('rentals.monthly-settlements.edit', [rental.id, settlement.id])}
                                                                    className="text-yellow-600 hover:text-yellow-900"
                                                                    title="Edytuj"
                                                                >
                                                                    <PencilIcon className="w-4 h-4" />
                                                                </Link>
                                                                {settlement.status !== 'paid' && (
                                                                    <button
                                                                        onClick={() => handleMarkAsPaid(settlement)}
                                                                        className="text-green-600 hover:text-green-900"
                                                                        title="Oznacz jako opłacone"
                                                                    >
                                                                        <CheckCircleIcon className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleDelete(settlement)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                    title="Usuń"
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {expandedRows.has(settlement.id) && (
                                                        <tr className="bg-gray-50">
                                                            <td colSpan="6" className="px-6 py-4">
                                                                <div className="space-y-2">
                                                                    <h4 className="text-sm font-medium text-gray-900">Składniki rozliczenia:</h4>
                                                                    {settlement.components && settlement.components.length > 0 ? (
                                                                        <div className="space-y-1">
                                                                            {settlement.components.map((component, index) => (
                                                                                <div key={index} className="flex justify-between items-center py-1 px-3 bg-white rounded border">
                                                                                    <div>
                                                                                        <span className="text-sm font-medium text-gray-900">
                                                                                            {component.name}
                                                                                        </span>
                                                                                        {component.description && (
                                                                                            <p className="text-xs text-gray-500">
                                                                                                {component.description}
                                                                                            </p>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <span className="text-sm font-medium text-gray-900">
                                                                                            {Number(component.amount).toLocaleString('pl-PL', {
                                                                                                minimumFractionDigits: 2,
                                                                                                maximumFractionDigits: 2
                                                                                            })} zł
                                                                                        </span>
                                                                                        <div className="flex items-center space-x-2">
                                                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                                                component.status === 'active' 
                                                                                                    ? 'bg-green-100 text-green-800' 
                                                                                                    : 'bg-gray-100 text-gray-800'
                                                                                            }`}>
                                                                                                {component.status === 'active' ? 'Aktywny' : 'Nieaktywny'}
                                                                                            </span>
                                                                                            <span className="text-xs text-gray-500">
                                                                                                {component.type === 'rent' ? 'Czynsz' : 
                                                                                                 component.type === 'meter' ? 'Licznik' : 'Inne'}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-sm text-gray-500">Brak składników</p>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
