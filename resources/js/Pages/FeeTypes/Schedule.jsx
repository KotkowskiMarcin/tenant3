import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function Schedule({ feeType, schedule, year }) {
    const getMonthName = (month) => {
        const months = [
            'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
            'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
        ];
        return months[month - 1] || '';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href={route('fee-types.show', feeType.id)}
                            className="text-gray-500 hover:text-gray-700 mr-4"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Harmonogram płatności - {feeType.name}
                        </h2>
                    </div>
                    <div className="text-sm text-gray-500">
                        Rok {year}
                    </div>
                </div>
            }
        >
            <Head title={`Harmonogram - ${feeType.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Informacje o szablonie */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Informacje o szablonie</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-500">Nazwa:</span>
                                        <p className="text-gray-900">{feeType.name}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">Kwota:</span>
                                        <p className="text-gray-900">
                                            {feeType.amount.toLocaleString('pl-PL', {
                                                style: 'currency',
                                                currency: 'PLN'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">Nieruchomość:</span>
                                        <p className="text-gray-900">{feeType.property.name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Harmonogram */}
                            {schedule && schedule.length > 0 ? (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <CalendarDaysIcon className="w-5 h-5 mr-2" />
                                        Harmonogram płatności na rok {year}
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {schedule.map((monthData, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                                <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {monthData.month_name} {year}
                                                    </h4>
                                                </div>
                                                <div className="p-4">
                                                    <div className="space-y-3">
                                                        {monthData.payments.map((payment, paymentIndex) => (
                                                            <div key={paymentIndex} className="flex justify-between items-center bg-white p-3 rounded border">
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{payment.fee_type_name}</p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {payment.frequency_type === 'monthly' ? 'Miesięcznie' :
                                                                         payment.frequency_type === 'quarterly' ? `Co ${payment.frequency_value} miesięcy` :
                                                                         payment.frequency_type === 'biannual' ? 'Co pół roku' :
                                                                         payment.frequency_type === 'annual' ? 'Rocznie' :
                                                                         `Miesiąc ${payment.frequency_value}`}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-semibold text-gray-900">
                                                                        {payment.amount.toLocaleString('pl-PL', {
                                                                            style: 'currency',
                                                                            currency: 'PLN'
                                                                        })}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        Wymagana płatność
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Podsumowanie */}
                                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-green-900 mb-2">Podsumowanie roku {year}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-green-700">Miesięcy z płatnościami:</span>
                                                <p className="text-green-900 font-semibold">{schedule.length}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-green-700">Łączna kwota:</span>
                                                <p className="text-green-900 font-semibold">
                                                    {schedule.reduce((total, month) => 
                                                        total + month.payments.reduce((monthTotal, payment) => 
                                                            monthTotal + payment.amount, 0
                                                        ), 0
                                                    ).toLocaleString('pl-PL', {
                                                        style: 'currency',
                                                        currency: 'PLN'
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-green-700">Średnia miesięczna:</span>
                                                <p className="text-green-900 font-semibold">
                                                    {(schedule.reduce((total, month) => 
                                                        total + month.payments.reduce((monthTotal, payment) => 
                                                            monthTotal + payment.amount, 0
                                                        ), 0
                                                    ) / Math.max(schedule.length, 1)).toLocaleString('pl-PL', {
                                                        style: 'currency',
                                                        currency: 'PLN'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Brak płatności w tym roku</h3>
                                    <p className="text-gray-500">
                                        Ten szablon opłaty nie generuje płatności w roku {year}.
                                    </p>
                                </div>
                            )}

                            {/* Linki do innych lat */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Zobacz inne lata:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {[year - 2, year - 1, year + 1, year + 2].map((otherYear) => (
                                        <Link
                                            key={otherYear}
                                            href={route('fee-types.schedule', { feeType: feeType.id, year: otherYear })}
                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"
                                        >
                                            {otherYear}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
