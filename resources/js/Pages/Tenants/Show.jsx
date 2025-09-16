import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PencilIcon, TrashIcon, HomeIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function Show({ tenant, rentals = [] }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pl-PL');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN'
        }).format(amount);
    };

    const isRentalActive = (rental) => {
        const now = new Date();
        const endDate = rental.end_date ? new Date(rental.end_date) : null;
        
        // Jeśli nie ma daty zakończenia, wynajem jest bezterminowy (aktywny)
        if (!endDate) {
            return true;
        }
        
        // Sprawdź czy aktualna data jest przed datą zakończenia
        return now < endDate;
    };
    return (
        <AuthenticatedLayout>
            <Head title={`Najemca: ${tenant.first_name} ${tenant.last_name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {tenant.first_name} {tenant.last_name}
                                    </h2>
                                    <p className="text-gray-600">{tenant.email}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <Link
                                        href={route('tenants.edit', tenant.id)}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        Edytuj
                                    </Link>
                                    <Link
                                        href={route('tenants.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        ← Powrót
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Podstawowe informacje */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Podstawowe informacje</h3>
                                    <div className="space-y-4">
                                        {tenant.email && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Email</label>
                                                <p className="mt-1 text-sm text-gray-900">{tenant.email}</p>
                                            </div>
                                        )}
                                        
                                        {tenant.phone && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Telefon</label>
                                                <p className="mt-1 text-sm text-gray-900">{tenant.phone}</p>
                                            </div>
                                        )}
                                        
                                        {tenant.address && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Adres</label>
                                                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{tenant.address}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Dokumenty tożsamości */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Dokumenty tożsamości</h3>
                                    <div className="space-y-4">
                                        {tenant.pesel && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">PESEL</label>
                                                <p className="mt-1 text-sm text-gray-900">{tenant.pesel}</p>
                                            </div>
                                        )}
                                        
                                        {tenant.id_number && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Numer dowodu osobistego</label>
                                                <p className="mt-1 text-sm text-gray-900">{tenant.id_number}</p>
                                            </div>
                                        )}
                                        
                                        {tenant.other_id_document && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Inny dokument tożsamości</label>
                                                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{tenant.other_id_document}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Uwagi */}
                            {tenant.notes && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Uwagi</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-900 whitespace-pre-line">{tenant.notes}</p>
                                    </div>
                                </div>
                            )}

                            {/* Najmy */}
                            {rentals && rentals.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Najmy</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nieruchomość
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Data rozpoczęcia
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Data zakończenia
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Kwota czynszu
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Rola
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {rentals.map((rental) => (
                                                    <tr key={rental.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Link
                                                                href={route('properties.show', rental.property.id)}
                                                                className="text-sm font-medium text-blue-600 hover:text-blue-900"
                                                            >
                                                                {rental.property.name}
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatDate(rental.start_date)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {rental.end_date ? formatDate(rental.end_date) : 'Bezterminowy'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatCurrency(rental.rent_amount)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                rental.pivot.is_primary 
                                                                    ? 'bg-blue-100 text-blue-800' 
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {rental.pivot.is_primary ? 'Główny' : 'Dodatkowy'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                isRentalActive(rental) 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {isRentalActive(rental) ? 'Aktywny' : 'Zakończony'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
