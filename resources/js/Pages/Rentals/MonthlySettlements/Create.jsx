import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';
import { 
    ArrowLeftIcon,
    PlusIcon,
    TrashIcon,
    CalculatorIcon,
    CurrencyDollarIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline';

export default function Create({ rental, meters, years, months }) {
    const [components, setComponents] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [collapsedComponents, setCollapsedComponents] = useState(new Set());

    const { data, setData, post, processing, errors, reset } = useForm({
        year: selectedYear,
        month: selectedMonth,
        components: [],
    });

    // Generuj domyślne składniki przy ładowaniu
    useEffect(() => {
        generateDefaultComponents();
    }, []);

    // Ustaw domyślnie zwinięte składniki po wygenerowaniu
    useEffect(() => {
        if (components.length > 0) {
            const allIndices = Array.from({ length: components.length }, (_, i) => i);
            setCollapsedComponents(new Set(allIndices));
        }
    }, [components.length]);

    // Aktualizuj dane formularza gdy zmieniają się składniki
    useEffect(() => {
        setData('components', components);
    }, [components]);

    const generateDefaultComponents = () => {
        const defaultComponents = [];

        // Dodaj czynsz jako domyślny składnik
        defaultComponents.push({
            name: 'Czynsz',
            amount: rental.rent_amount,
            type: 'rent',
            status: 'active',
            description: 'Czynsz miesięczny',
        });

        // Dodaj składniki dla liczników
        meters.forEach(meter => {
            defaultComponents.push({
                name: meter.name,
                amount: 0,
                type: 'meter',
                status: 'active',
                description: `Opłata za ${meter.name}`,
                meter_id: meter.id,
                unit: meter.unit,
                price_per_unit: meter.price_per_unit,
                previous_reading: meter.current_reading,
                current_reading: meter.current_reading,
                consumption: 0,
            });
        });

        setComponents(defaultComponents);
    };

    const addComponent = () => {
        const newComponent = {
            name: '',
            amount: 0,
            type: 'other',
            status: 'active',
            description: '',
        };
        const newComponents = [...components, newComponent];
        setComponents(newComponents);
        
        // Nowy składnik jest domyślnie zwinięty
        const newIndex = newComponents.length - 1;
        setCollapsedComponents(prev => new Set([...prev, newIndex]));
    };

    const updateComponent = (index, field, value) => {
        const updatedComponents = [...components];
        updatedComponents[index] = {
            ...updatedComponents[index],
            [field]: value,
        };

        // Jeśli to licznik, oblicz zużycie i kwotę
        if (field === 'current_reading' && updatedComponents[index].type === 'meter') {
            const previousReading = updatedComponents[index].previous_reading || 0;
            const currentReading = parseFloat(value) || 0;
            const consumption = Math.max(0, currentReading - previousReading);
            const unitPrice = updatedComponents[index].price_per_unit || 0;
            const amount = consumption * unitPrice;

            updatedComponents[index].consumption = consumption;
            updatedComponents[index].amount = amount;
        }

        setComponents(updatedComponents);
    };

    const removeComponent = (index) => {
        const updatedComponents = components.filter((_, i) => i !== index);
        setComponents(updatedComponents);
        
        // Aktualizuj indeksy w collapsedComponents
        const newCollapsed = new Set();
        collapsedComponents.forEach(collapsedIndex => {
            if (collapsedIndex < index) {
                newCollapsed.add(collapsedIndex);
            } else if (collapsedIndex > index) {
                newCollapsed.add(collapsedIndex - 1);
            }
        });
        setCollapsedComponents(newCollapsed);
    };

    const toggleComponentCollapse = (index) => {
        const newCollapsed = new Set(collapsedComponents);
        if (newCollapsed.has(index)) {
            newCollapsed.delete(index);
        } else {
            newCollapsed.add(index);
        }
        setCollapsedComponents(newCollapsed);
    };

    const calculateTotalAmount = () => {
        return components
            .filter(component => component.status === 'active')
            .reduce((total, component) => total + (parseFloat(component.amount) || 0), 0);
    };

    const getComponentTypeLabel = (type) => {
        switch (type) {
            case 'rent':
                return 'Czynsz';
            case 'meter':
                return 'Opłata licznikowa';
            case 'other':
                return 'Inna opłata';
            default:
                return 'Nieznany';
        }
    };

    const getStatusLabel = (status) => {
        return status === 'active' ? 'Aktywny' : 'Nieaktywny';
    };

    const isMeterIncomplete = (component) => {
        if (component.type !== 'meter') return false;
        return !component.current_reading || component.current_reading === component.previous_reading;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('rentals.monthly-settlements.store', rental.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Generuj nowe rozliczenie" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Link
                                        href={route('rentals.monthly-settlements.index', rental.id)}
                                        className="mr-4 text-gray-400 hover:text-gray-600"
                                    >
                                        <ArrowLeftIcon className="w-6 h-6" />
                                    </Link>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Generuj nowe rozliczenie
                                        </h1>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Najem: {rental.property?.address || 'Brak adresu'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Okres rozliczenia */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Okres rozliczenia</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                                            Rok
                                        </label>
                                        <select
                                            id="year"
                                            value={selectedYear}
                                            onChange={(e) => {
                                                setSelectedYear(parseInt(e.target.value));
                                                setData('year', parseInt(e.target.value));
                                            }}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                                            Miesiąc
                                        </label>
                                        <select
                                            id="month"
                                            value={selectedMonth}
                                            onChange={(e) => {
                                                setSelectedMonth(parseInt(e.target.value));
                                                setData('month', parseInt(e.target.value));
                                            }}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            {Object.entries(months).map(([value, label]) => (
                                                <option key={value} value={parseInt(value)}>{label}</option>
                                            ))}
                                        </select>
                                        {errors.month && <p className="mt-1 text-sm text-red-600">{errors.month}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Składniki rozliczenia */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">Składniki rozliczenia</h2>
                                    <button
                                        type="button"
                                        onClick={addComponent}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Dodaj składnik
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {components.map((component, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleComponentCollapse(index)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        {collapsedComponents.has(index) ? (
                                                            <ChevronDownIcon className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronUpIcon className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <h3 className="text-sm font-medium text-gray-900">
                                                        Składnik {index + 1}: {component.name || 'Bez nazwy'}
                                                    </h3>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        component.status === 'active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {getStatusLabel(component.status)}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {getComponentTypeLabel(component.type)}
                                                    </span>
                                                    {isMeterIncomplete(component) && (
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            Do uzupełnienia
                                                        </span>
                                                    )}
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {Number(component.amount).toLocaleString('pl-PL', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        })} zł
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeComponent(index)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {!collapsedComponents.has(index) && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Nazwa składnika
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={component.name}
                                                        onChange={(e) => updateComponent(index, 'name', e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Typ składnika
                                                    </label>
                                                    <select
                                                        value={component.type}
                                                        onChange={(e) => updateComponent(index, 'type', e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    >
                                                        <option value="rent">Czynsz</option>
                                                        <option value="meter">Opłata licznikowa</option>
                                                        <option value="other">Inna opłata</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Status
                                                    </label>
                                                    <select
                                                        value={component.status}
                                                        onChange={(e) => updateComponent(index, 'status', e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    >
                                                        <option value="active">Aktywny</option>
                                                        <option value="inactive">Nieaktywny</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Kwota (zł)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={component.amount}
                                                        onChange={(e) => updateComponent(index, 'amount', parseFloat(e.target.value) || 0)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        required
                                                    />
                                                </div>

                                                {component.type === 'meter' && (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Poprzedni stan
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                value={component.previous_reading}
                                                                onChange={(e) => updateComponent(index, 'previous_reading', parseFloat(e.target.value) || 0)}
                                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Aktualny stan
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                value={component.current_reading}
                                                                onChange={(e) => updateComponent(index, 'current_reading', parseFloat(e.target.value) || 0)}
                                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Zużycie ({component.unit})
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                value={component.consumption}
                                                                readOnly
                                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Cena za jednostkę (zł)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                value={component.price_per_unit}
                                                                onChange={(e) => updateComponent(index, 'price_per_unit', parseFloat(e.target.value) || 0)}
                                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            />
                                                        </div>
                                                    </>
                                                )}

                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Opis (opcjonalny)
                                                    </label>
                                                    <textarea
                                                        value={component.description}
                                                        onChange={(e) => updateComponent(index, 'description', e.target.value)}
                                                        rows={2}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Podsumowanie */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CalculatorIcon className="w-6 h-6 text-gray-400 mr-2" />
                                        <h2 className="text-lg font-medium text-gray-900">Podsumowanie</h2>
                                    </div>
                                    <div className="flex items-center">
                                        <CurrencyDollarIcon className="w-6 h-6 text-gray-400 mr-2" />
                                        <span className="text-2xl font-bold text-gray-900">
                                            {calculateTotalAmount().toLocaleString('pl-PL', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })} zł
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Przyciski */}
                        <div className="flex items-center justify-end space-x-4">
                            <Link
                                href={route('rentals.monthly-settlements.index', rental.id)}
                                className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Anuluj
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-25"
                            >
                                {processing ? 'Generowanie...' : 'Generuj rozliczenie'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
