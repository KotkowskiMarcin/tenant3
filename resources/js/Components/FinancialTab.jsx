import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { 
    BanknotesIcon, 
    ChartBarIcon, 
    CalendarIcon,
    CurrencyDollarIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

// Komponent wykresu liniowego
const LineChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    // Sortuj dane chronologicznie
    const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.year, a.month - 1);
        const dateB = new Date(b.year, b.month - 1);
        return dateA - dateB;
    });

    const width = 800;
    const height = 200;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Znajdź min i max wartości
    const amounts = sortedData.map(d => d.amount);
    const minAmount = Math.min(...amounts);
    const maxAmount = Math.max(...amounts);
    const range = maxAmount - minAmount || 1;

    // Funkcja do konwersji wartości na współrzędne
    const getX = (index) => padding + (index / (sortedData.length - 1)) * chartWidth;
    const getY = (amount) => padding + chartHeight - ((amount - minAmount) / range) * chartHeight;

    // Generuj punkty dla linii
    const points = sortedData.map((item, index) => 
        `${getX(index)},${getY(item.amount)}`
    ).join(' ');

    // Generuj etykiety osi X
    const xLabels = sortedData.map((item, index) => ({
        x: getX(index),
        y: height - 10,
        text: `${item.month}/${item.year.toString().slice(-2)}`
    }));

    return (
        <div className="w-full overflow-x-auto">
            <svg width={width} height={height} className="w-full">
                {/* Linie pomocnicze */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                    const y = padding + ratio * chartHeight;
                    const value = minAmount + ratio * range;
                    return (
                        <g key={index}>
                            <line
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="#e5e7eb"
                                strokeWidth="1"
                            />
                            <text
                                x={padding - 10}
                                y={y + 4}
                                textAnchor="end"
                                className="text-xs fill-gray-500"
                            >
                                {new Intl.NumberFormat('pl-PL', {
                                    style: 'currency',
                                    currency: 'PLN',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(value)}
                            </text>
                        </g>
                    );
                })}

                {/* Linia wykresu */}
                <polyline
                    points={points}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Punkty na linii */}
                {sortedData.map((item, index) => (
                    <circle
                        key={index}
                        cx={getX(index)}
                        cy={getY(item.amount)}
                        r="4"
                        fill={item.status === 'paid' ? '#10b981' : '#ef4444'}
                        stroke="white"
                        strokeWidth="2"
                    />
                ))}

                {/* Etykiety osi X */}
                {xLabels.map((label, index) => (
                    <text
                        key={index}
                        x={label.x}
                        y={label.y}
                        textAnchor="middle"
                        className="text-xs fill-gray-600"
                    >
                        {label.text}
                    </text>
                ))}
            </svg>
        </div>
    );
};

export default function FinancialTab({ rental, financialData: initialFinancialData }) {
    console.log('FinancialTab props:', { rental, financialData: initialFinancialData });
    
    // Debug - sprawdź co otrzymujemy z backendu
    console.log('FinancialData from backend:', initialFinancialData);
    console.log('Rental data:', rental);
    
    const [activeFinancialTab, setActiveFinancialTab] = useState('revenue');
    const [financialData, setFinancialData] = useState(initialFinancialData);
    const [dateRange, setDateRange] = useState({
        startDate: initialFinancialData?.filters?.start_date || '',
        endDate: initialFinancialData?.filters?.end_date || ''
    });
    const [isLoading, setIsLoading] = useState(false);
    
    // Stan dla paginacji
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN'
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pl-PL');
    };

    const getMonthName = (monthNumber) => {
        const months = [
            'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
            'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
        ];
        return months[monthNumber - 1] || '';
    };

    const handleDateRangeChange = (field, value) => {
        setDateRange(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const applyFilters = () => {
        if (!dateRange.startDate || !dateRange.endDate) {
            alert('Proszę wybrać datę początkową i końcową');
            return;
        }
        
        setIsLoading(true);
        
        // Wywołaj endpoint do pobrania danych finansowych z filtrami
        router.get(route('rentals.financial-data', rental.id), {
            start_date: dateRange.startDate,
            end_date: dateRange.endDate,
            tab: 'financial' // Zawsze otwieraj zakładkę Finanse po zastosowaniu filtrów
        }, {
            onSuccess: (page) => {
                if (page.props.financialData) {
                    setFinancialData(page.props.financialData);
                }
                setIsLoading(false);
            },
            onError: (errors) => {
                console.error('Error loading financial data:', errors);
                setIsLoading(false);
            }
        });
    };

    const resetFilters = () => {
        console.log('Reset filters clicked');
        console.log('Rental data:', rental);
        
        // Ustaw datę początkową na datę rozpoczęcia wynajmu
        const startDate = rental.start_date ? new Date(rental.start_date).toISOString().split('T')[0] : '';
        // Ustaw datę końcową na aktualną datę
        const endDate = new Date().toISOString().split('T')[0];
        
        console.log('Reset dates:', { startDate, endDate });
        
        setDateRange({
            startDate: startDate,
            endDate: endDate
        });
        
        // Zastosuj filtry z nowymi datami
        if (startDate && endDate) {
            console.log('Applying reset filters...');
            setIsLoading(true);
            
            router.get(route('rentals.financial-data', rental.id), {
                start_date: startDate,
                end_date: endDate,
                tab: 'financial'
            }, {
                onSuccess: (page) => {
                    console.log('Reset filters success:', page.props.financialData);
                    if (page.props.financialData) {
                        setFinancialData(page.props.financialData);
                    }
                    setIsLoading(false);
                },
                onError: (errors) => {
                    console.error('Error loading financial data:', errors);
                    setIsLoading(false);
                }
            });
        } else {
            console.log('No valid dates available for reset');
        }
    };

    // Definicja zakładek finansowych
    const financialTabs = [
        { id: 'revenue', name: 'Przychody miesięczne', icon: CurrencyDollarIcon },
        { id: 'expenses', name: 'Podsumowanie opłat', icon: BanknotesIcon },
        { id: 'chart', name: 'Rozliczenia w czasie', icon: ChartBarIcon }
    ];

    if (!financialData) {
        return (
            <div className="space-y-6">
                <div className="text-center py-8">
                    <BanknotesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Ładowanie danych finansowych...</p>
                    <p className="text-sm text-gray-400 mt-2">Sprawdź konsolę przeglądarki dla debugowania</p>
                </div>
            </div>
        );
    }

    const { 
        summary = { total_revenue: 0, paid_revenue: 0, unpaid_revenue: 0, settlements_count: 0 }, 
        expense_breakdown = { rent: 0, meters: {}, other: 0 }, 
        chart_data = [], 
        monthly_stats = [] 
    } = financialData;
    
    console.log('Destructured data:', { summary, expense_breakdown, chart_data, monthly_stats });
    console.log('Summary details:', summary);
    console.log('Monthly stats details:', monthly_stats);
    console.log('Chart data details:', chart_data);
    console.log('Expense breakdown details:', expense_breakdown);
    
    // Sprawdź czy mamy jakiekolwiek dane
    const hasData = monthly_stats.length > 0 || chart_data.length > 0 || summary.settlements_count > 0;
    
    // Sortowanie malejące według daty (najnowsze pierwsze)
    const sortedMonthlyStats = [...monthly_stats].sort((a, b) => {
        const dateA = new Date(a.year, a.month - 1);
        const dateB = new Date(b.year, b.month - 1);
        return dateB - dateA;
    });
    
    // Paginacja
    const totalPages = Math.ceil(sortedMonthlyStats.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedStats = sortedMonthlyStats.slice(startIndex, endIndex);
    
    // Resetuj stronę gdy zmienia się zakładka
    const handleTabChange = (tabId) => {
        setActiveFinancialTab(tabId);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <BanknotesIcon className="w-5 h-5 mr-2" />
                    Finanse
                </h2>
            </div>

            {/* Filtry czasowe */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    Filtry czasowe
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data początkowa
                        </label>
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data końcowa
                        </label>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-end gap-2">
                        <button
                            onClick={applyFilters}
                            disabled={isLoading}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Ładowanie...' : 'Zastosuj filtry'}
                        </button>
                        <button
                            onClick={resetFilters}
                            disabled={isLoading}
                            className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            Resetuj
                        </button>
                    </div>
                </div>
            </div>

            {/* Podsumowanie przychodów */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center">
                        <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-green-600">Całkowite przychody</p>
                            <p className="text-2xl font-bold text-green-900">
                                {formatCurrency(summary.total_revenue)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-8 h-8 text-blue-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-blue-600">Zapłacone</p>
                            <p className="text-2xl font-bold text-blue-900">
                                {formatCurrency(summary.paid_revenue)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <div className="flex items-center">
                        <XCircleIcon className="w-8 h-8 text-red-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-red-600">Niezapłacone</p>
                            <p className="text-2xl font-bold text-red-900">
                                {formatCurrency(summary.unpaid_revenue)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Komunikat gdy brak danych */}
            {!hasData && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <BanknotesIcon className="w-8 h-8 text-yellow-600" />
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-yellow-800">Brak danych finansowych</h3>
                            <p className="text-yellow-700">
                                Dla tego najmu nie znaleziono żadnych rozliczeń miesięcznych. 
                                Wygeneruj pierwsze rozliczenie w zakładce "Rozliczenia".
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Zakładki finansowe */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                        {financialTabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`${
                                        activeFinancialTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                                >
                                    <Icon className="w-5 h-5 mr-2" />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>
                
                <div className="p-6">
                    {/* Zawartość zakładek */}
                    {activeFinancialTab === 'revenue' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Okres
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Łączna kwota
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Zapłacone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedStats && paginatedStats.length > 0 ? paginatedStats.map((month, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {getMonthName(month.month)} {month.year}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(month.total_amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(month.paid_amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    month.unpaid_amount === 0 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {month.unpaid_amount === 0 ? 'Zapłacone' : 'Częściowo zapłacone'}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                                Brak danych do wyświetlenia
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            
                            {/* Paginacja */}
                            {totalPages > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Poprzednia
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Następna
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Pokazuję <span className="font-medium">{startIndex + 1}</span> do{' '}
                                            <span className="font-medium">{Math.min(endIndex, sortedMonthlyStats.length)}</span> z{' '}
                                            <span className="font-medium">{sortedMonthlyStats.length}</span> wyników
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="sr-only">Poprzednia</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            
                                            {/* Numery stron */}
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        page === currentPage
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            
                                            <button
                                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage === totalPages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="sr-only">Następna</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>
                    )}

                    {/* Podsumowanie opłat */}
                    {activeFinancialTab === 'expenses' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Czynsz</span>
                                <span className="font-semibold text-gray-900">
                                    {formatCurrency(expense_breakdown.rent)}
                                </span>
                            </div>
                            
                            {expense_breakdown.meters && Object.entries(expense_breakdown.meters).map(([meterName, amount]) => (
                                <div key={meterName} className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">{meterName}</span>
                                    <span className="font-semibold text-gray-900">
                                        {formatCurrency(amount)}
                                    </span>
                                </div>
                            ))}
                            
                            {expense_breakdown.other > 0 && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Inne opłaty</span>
                                    <span className="font-semibold text-gray-900">
                                        {formatCurrency(expense_breakdown.other)}
                                    </span>
                                </div>
                            )}
                            
                            <div className="flex justify-between items-center py-2 font-bold text-lg border-t-2 border-gray-200">
                                <span className="text-gray-900">Razem</span>
                                <span className="text-gray-900">
                                    {formatCurrency(
                                        expense_breakdown.rent + 
                                        (expense_breakdown.meters ? Object.values(expense_breakdown.meters).reduce((sum, amount) => sum + amount, 0) : 0) + 
                                        expense_breakdown.other
                                    )}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Wykres rozliczeń w czasie */}
                    {activeFinancialTab === 'chart' && (
                        <div>
                            {chart_data && chart_data.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="bg-white p-6 rounded-lg border">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Rozliczenia w czasie</h3>
                                        <div className="h-64">
                                            <LineChart data={chart_data} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Brak danych do wyświetlenia</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
