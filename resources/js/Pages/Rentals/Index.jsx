import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function Index({ rentals }) {
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
        if (!rental.end_date) return true;
        return new Date(rental.end_date) > new Date();
    };

    const handleDelete = (id) => {
        if (confirm('Czy na pewno chcesz usunąć ten najem?')) {
            router.delete(route('rentals.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Najmy" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Najmy</h2>
                                <Link
                                    href={route('rentals.create')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Dodaj najem
                                </Link>
                            </div>

                            {rentals.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">Brak najmów w systemie.</p>
                                    <Link
                                        href={route('rentals.create')}
                                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Dodaj pierwszy najem
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nieruchomość
                                                    </th>
                                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Najemcy
                                                    </th> */}
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
                                                        Rozliczenie
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Akcje
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {rentals.data.map((rental) => (
                                                    <tr key={rental.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Link
                                                                href={route('properties.show', rental.property.id)}
                                                                className="text-sm font-medium text-blue-600 hover:text-blue-900"
                                                            >
                                                                {rental.property.name}
                                                            </Link>
                                                        </td>
                                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="space-y-1">
                                                                {rental.tenants?.map((tenant, index) => (
                                                                    <div key={tenant.id} className="flex items-center">
                                                                        <Link
                                                                            href={route('tenants.show', tenant.id)}
                                                                            className="text-sm text-blue-600 hover:text-blue-900"
                                                                        >
                                                                            {tenant.first_name} {tenant.last_name}
                                                                            {tenant.pivot?.is_primary && (
                                                                                <span className="ml-1 text-xs text-green-600 font-semibold">(Główny)</span>
                                                                            )}
                                                                        </Link>
                                                                        {index < rental.tenants.length - 1 && (
                                                                            <span className="text-gray-400 mx-1">,</span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                                {rental.tenants?.length > 1 && (
                                                                    <p className="text-xs text-gray-500">
                                                                        {rental.tenants.length} najemców
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </td> */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatDate(rental.start_date)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {rental.end_date ? formatDate(rental.end_date) : 'Bezterminowy'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatCurrency(rental.rent_amount)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {rental.billing_type ? (
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    rental.billing_type === 'invoice' 
                                                                        ? 'bg-blue-100 text-blue-800' 
                                                                        : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                    {rental.billing_type === 'invoice' ? 'Faktura' : 'Paragon'}
                                                                </span>
                                                            ) : '-'}
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
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex justify-end space-x-2">
                                                                <Link
                                                                    href={route('rentals.show', rental.id)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                >
                                                                    <EyeIcon className="w-4 h-4" />
                                                                </Link>
                                                                <Link
                                                                    href={route('rentals.edit', rental.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    <PencilIcon className="w-4 h-4" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(rental.id)}
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

                                    {rentals.links && (
                                        <div className="mt-6">
                                            <nav className="flex items-center justify-between">
                                                <div className="flex-1 flex justify-between sm:hidden">
                                                    {rentals.links.prev && (
                                                        <Link
                                                            href={rentals.links.prev}
                                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                        >
                                                            Poprzednia
                                                        </Link>
                                                    )}
                                                    {rentals.links.next && (
                                                        <Link
                                                            href={rentals.links.next}
                                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                        >
                                                            Następna
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-700">
                                                            Pokazuję <span className="font-medium">{rentals.from}</span> do{' '}
                                                            <span className="font-medium">{rentals.to}</span> z{' '}
                                                            <span className="font-medium">{rentals.total}</span> wyników
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                            {rentals.links.map((link, index) => (
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
