import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';
import { 
    PencilIcon, 
    TrashIcon, 
    HomeIcon, 
    UserIcon, 
    CalendarIcon, 
    CurrencyDollarIcon,
    ArrowLeftIcon,
    DocumentTextIcon,
    BanknotesIcon,
    ClockIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    InformationCircleIcon,
    ClipboardDocumentListIcon,
    PlusIcon,
    StarIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import RentalAttachmentManagementModal from '@/Components/RentalAttachmentManagementModal';
import SettlementCreateModal from '@/Components/Settlements/SettlementCreateModal';
import SettlementEditModal from '@/Components/Settlements/SettlementEditModal';
import FinancialTab from '@/Components/FinancialTab';

export default function Show({ rental, allTenants, settlements, financialData }) {
    const { props } = usePage();
    const [activeTab, setActiveTab] = useState('basic');
    
    // Odczytywanie parametru tab z sesji Inertia.js
    useEffect(() => {
        if (props.tab && ['basic', 'tenants', 'financial', 'attachments', 'events', 'settlements'].includes(props.tab)) {
            setActiveTab(props.tab);
        }
    }, [props.tab]);
    const [showAddTenant, setShowAddTenant] = useState(false);
    const [newTenantId, setNewTenantId] = useState('');
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [editingAttachment, setEditingAttachment] = useState(null);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [showSettlementCreateModal, setShowSettlementCreateModal] = useState(false);
    const [showSettlementEditModal, setShowSettlementEditModal] = useState(false);
    const [editingSettlement, setEditingSettlement] = useState(null);
    console.log({ rental, allTenants, settlements, financialData });
    
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pl-PL');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN'
        }).format(amount);
    };

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

    const handleMarkAsPaid = (settlement) => {
        if (confirm('Czy na pewno chcesz oznaczyć to rozliczenie jako opłacone?')) {
            router.post(route('rentals.monthly-settlements.mark-paid', [rental.id, settlement.id]), {}, {
                onSuccess: () => {
                    // Kontroler przekieruje do panelu najmu
                }
            });
        }
    };

    const handleDelete = (settlement) => {
        if (confirm('Czy na pewno chcesz usunąć to rozliczenie? Ta operacja nie może zostać cofnięta.')) {
            router.delete(route('rentals.monthly-settlements.destroy', [rental.id, settlement.id]), {
                onSuccess: () => {
                    // Kontroler przekieruje do panelu najmu
                }
            });
        }
    };

    const handleCreateSettlement = () => {
        setShowSettlementCreateModal(true);
    };

    const handleEditSettlement = (settlement) => {
        setEditingSettlement(settlement);
        setShowSettlementEditModal(true);
    };

    const closeSettlementCreateModal = () => {
        setShowSettlementCreateModal(false);
    };

    const closeSettlementEditModal = () => {
        setShowSettlementEditModal(false);
        setEditingSettlement(null);
    };

    const tabs = [
        { id: 'basic', name: 'Podstawowe', icon: InformationCircleIcon },
        { id: 'tenants', name: 'Najemcy', icon: UserIcon },
        { id: 'financial', name: 'Finanse', icon: BanknotesIcon },
        { id: 'settlements', name: 'Rozliczenia', icon: DocumentTextIcon },
        { id: 'attachments', name: 'Załączniki', icon: ClipboardDocumentListIcon }
    ];

    const addTenant = (e) => {
        e.preventDefault();
        if (newTenantId) {
            router.post(route('rentals.tenants.add', rental.id), {
                tenant_id: newTenantId
            }, {
                onSuccess: () => {
                    setNewTenantId('');
                    setShowAddTenant(false);
                }
            });
        }
    };

    const removeTenant = (tenantId) => {
        if (confirm('Czy na pewno chcesz usunąć tego najemcę z najmu?')) {
            router.delete(route('rentals.tenants.remove', [rental.id, tenantId]));
        }
    };

    const setPrimaryTenant = (tenantId) => {
        if (confirm('Czy na pewno chcesz ustawić tego najemcę jako głównego?')) {
            router.patch(route('rentals.tenants.set-primary', [rental.id, tenantId]));
        }
    };

    // Filtruj najemców, którzy nie są już przypisani do tego najmu
    const availableTenants = allTenants?.filter(tenant => 
        !rental.tenants?.some(rentalTenant => rentalTenant.id === tenant.id)
    ) || [];

    // Mapowanie typów zdarzeń
    const getEventTypeLabel = (eventType) => {
        const labels = {
            'added': 'Dodano do najmu',
            'removed': 'Usunięto z najmu',
            'set_primary': 'Ustawiono jako głównego',
            'unset_primary': 'Odebrano status głównego'
        };
        return labels[eventType] || eventType;
    };

    // Pobierz wszystkie zdarzenia i posortuj według daty
    const getAllEvents = () => {
        const events = [];
        rental.tenants?.forEach(tenant => {
            tenant.events?.forEach(event => {
                events.push({
                    ...event,
                    tenant_name: `${tenant.first_name} ${tenant.last_name}`
                });
            });
        });
        return events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    };

    return (
        <AuthenticatedLayout>
            {/* <Head title={`Najem: ${rental.property?.name} - ${rental.tenants?.find(t => t.pivot?.is_primary)?.first_name || ''} ${rental.tenants?.find(t => t.pivot?.is_primary)?.last_name || ''}`} /> */}

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white shadow-sm rounded-lg mb-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Link
                                        href={route('rentals.index')}
                                        className="text-gray-600 hover:text-gray-900 mr-4"
                                    >
                                        <ArrowLeftIcon className="w-5 h-5" />
                                    </Link>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Najem: {rental.property?.name}
                                        </h1>
                                        <p className="text-gray-600">
                                            Najemca główny: {rental.tenants?.find(t => t.pivot?.is_primary)?.first_name || ''} {rental.tenants?.find(t => t.pivot?.is_primary)?.last_name || ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Link
                                        href={route('rentals.edit', rental.id)}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        Edytuj
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (confirm('Czy na pewno chcesz usunąć ten najem?')) {
                                                router.delete(route('rentals.destroy', rental.id));
                                            }
                                        }}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        Usuń
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="px-6">
                            <nav className="flex space-x-8" aria-label="Tabs">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`${
                                                activeTab === tab.id
                                                    ? 'border-indigo-500 text-indigo-600'
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
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white shadow-sm rounded-lg">
                        <div className="p-6">
                            {/* Basic Information Tab */}
                            {activeTab === 'basic' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Left column - Basic Information */}
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                    <HomeIcon className="w-5 h-5 mr-2" />
                                                    Nieruchomość
                                                </h3>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <Link
                                                        href={route('properties.show', rental.property.id)}
                                                        className="text-lg font-medium text-blue-600 hover:text-blue-900"
                                                    >
                                                        {rental.property.name}
                                                    </Link>
                                                    <p className="text-sm text-gray-600 mt-1">{rental.property.address}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                    <CalendarIcon className="w-5 h-5 mr-2" />
                                                    Okres najmu
                                                </h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-500">Data rozpoczęcia</label>
                                                        <p className="mt-1 text-sm text-gray-900">{formatDate(rental.start_date)}</p>
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-500">Data zakończenia</label>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {rental.end_date ? formatDate(rental.end_date) : 'Bezterminowy'}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-500">Status</label>
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            rental.is_active
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {rental.is_active ? 'Aktywny' : 'Zakończony'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right column - Financial Information */}
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                    <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                                                    Informacje finansowe
                                                </h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-500">Kwota czynszu</label>
                                                        <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(rental.rent_amount)}</p>
                                                    </div>
                                                    
                                                    {rental.deposit_amount && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-500">Kaucja</label>
                                                            <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(rental.deposit_amount)}</p>
                                                        </div>
                                                    )}

                                                    {rental.billing_type && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-500">Sposób rozliczania</label>
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                rental.billing_type === 'invoice' 
                                                                    ? 'bg-blue-100 text-blue-800' 
                                                                    : 'bg-green-100 text-green-800'
                                                            }`}>
                                                                {rental.billing_type === 'invoice' ? 'Faktura' : 'Paragon'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {rental.invoice_data && (
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Dane do faktury</h3>
                                                    <div className="bg-gray-50 p-4 rounded-lg">
                                                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{rental.invoice_data}</pre>
                                                    </div>
                                                </div>
                                            )}

                                            {rental.notes && (
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Uwagi</h3>
                                                    <div className="bg-gray-50 p-4 rounded-lg">
                                                        <p className="text-sm text-gray-700">{rental.notes}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tenants Tab */}
                            {activeTab === 'tenants' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                            <UserIcon className="w-5 h-5 mr-2" />
                                            Najemcy ({rental.tenants?.length || 0})
                                        </h2>
                                        {availableTenants.length > 0 && (
                                            <button
                                                onClick={() => setShowAddTenant(!showAddTenant)}
                                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                <PlusIcon className="w-4 h-4 mr-2" />
                                                Dodaj najemcę
                                            </button>
                                        )}
                                    </div>

                                    {/* Lista najemców */}
                                    <div className="space-y-4">
                                        {rental.tenants?.map((tenant) => (
                                            <div key={tenant.id} className="bg-gray-50 p-6 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <Link
                                                                href={route('tenants.show', tenant.id)}
                                                                className="text-xl font-medium text-blue-600 hover:text-blue-900"
                                                            >
                                                                {tenant.first_name} {tenant.last_name}
                                                            </Link>
                                                            {tenant.pivot?.is_primary ? (
                                                                <span className="ml-3 inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                                                                    Główny
                                                                </span>
                                                            ) : <></>}
                                                        </div>
                                                        
                                                        <div className="mt-2 space-y-1">
                                                            {tenant.email && (
                                                                <p className="text-sm text-gray-600 flex items-center">
                                                                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                                                                    {tenant.email}
                                                                </p>
                                                            )}
                                                            {tenant.phone && (
                                                                <p className="text-sm text-gray-600 flex items-center">
                                                                    <ClockIcon className="w-4 h-4 mr-2" />
                                                                    {tenant.phone}
                                                                </p>
                                                            )}
                                                            {tenant.address && (
                                                                <p className="text-sm text-gray-600 flex items-center">
                                                                    <MapPinIcon className="w-4 h-4 mr-2" />
                                                                    {tenant.address}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2 ml-4">
                                                        {!tenant.pivot?.is_primary && (
                                                            <button
                                                                onClick={() => setPrimaryTenant(tenant.id)}
                                                                className="text-yellow-600 hover:text-yellow-900 p-2 rounded-md hover:bg-yellow-50"
                                                                title="Ustaw jako głównego"
                                                            >
                                                                <StarIcon className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                        {!tenant.pivot?.is_primary && (
                                                            <button
                                                                onClick={() => removeTenant(tenant.id)}
                                                                className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50"
                                                                title="Usuń z najmu"
                                                            >
                                                                <TrashIcon className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Formularz dodawania najemcy */}
                                    {showAddTenant && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-900 mb-3">Dodaj nowego najemcę</h4>
                                            <form onSubmit={addTenant} className="flex space-x-3">
                                                <select
                                                    value={newTenantId}
                                                    onChange={(e) => setNewTenantId(e.target.value)}
                                                    className="flex-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    required
                                                >
                                                    <option value="">Wybierz najemcę</option>
                                                    {availableTenants.map((tenant) => (
                                                        <option key={tenant.id} value={tenant.id}>
                                                            {tenant.first_name} {tenant.last_name}{tenant.email ? ` - ${tenant.email}` : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                                >
                                                    Dodaj
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowAddTenant(false);
                                                        setNewTenantId('');
                                                    }}
                                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                                >
                                                    Anuluj
                                                </button>
                                            </form>
                                        </div>
                                    )}

                                    {/* Historia zdarzeń */}
                                    {getAllEvents().length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Historia zdarzeń</h3>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Data
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Najemca
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Zdarzenie
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Opis
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Użytkownik
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {getAllEvents().map(event => (
                                                            <tr key={event.id} className="hover:bg-gray-50">
                                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                                    {formatDate(event.created_at)}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                                    {event.tenant_name}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                        event.event_type === 'added' ? 'bg-green-100 text-green-800' :
                                                                        event.event_type === 'removed' ? 'bg-red-100 text-red-800' :
                                                                        event.event_type === 'set_primary' ? 'bg-blue-100 text-blue-800' :
                                                                        event.event_type === 'unset_primary' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {getEventTypeLabel(event.event_type)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                                    {event.description}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                                    {event.created_by?.name || 'System'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Financial Tab */}
                            {activeTab === 'financial' && (
                                <FinancialTab rental={rental} financialData={financialData || null} />
                            )}


                            {/* Settlements Tab */}
                            {activeTab === 'settlements' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                            <DocumentTextIcon className="w-5 h-5 mr-2" />
                                            Rozliczenia miesięczne
                                        </h2>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleCreateSettlement}
                                                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                <PlusIcon className="w-4 h-4 mr-2" />
                                                Generuj nowe rozliczenie
                                            </button>
                                            <Link
                                                href={route('rentals.monthly-settlements.index', rental.id)}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                <DocumentTextIcon className="w-4 h-4 mr-2" />
                                                Zarządzaj rozliczeniami
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                        <div className="p-6">
                                            {settlements && settlements.length === 0 ? (
                                                <div className="text-center py-12">
                                                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Brak rozliczeń</h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Zacznij od utworzenia pierwszego rozliczenia miesięcznego.
                                                    </p>
                                                    <div className="mt-6">
                                                        <button
                                                            onClick={handleCreateSettlement}
                                                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                        >
                                                            <PlusIcon className="w-4 h-4 mr-2" />
                                                            Generuj nowe rozliczenie
                                                        </button>
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
                                                            {settlements && settlements.map((settlement) => (
                                                                <>
                                                                    <tr key={settlement.id} className="hover:bg-gray-50">
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="flex items-center">
                                                                                <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                                                <span className="text-sm font-medium text-gray-900">
                                                                                    {settlement.formatted_date || `${settlement.month}/${settlement.year}` || 'Brak daty'}
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="flex items-center">
                                                                                <CurrencyDollarIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                                                <span className="text-sm font-medium text-gray-900">
                                                                                    {settlement.formatted_amount || formatCurrency(settlement.total_amount) || 'Brak kwoty'}
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
                                                                {settlement.status !== 'paid' && (
                                                                    <button
                                                                        onClick={() => handleEditSettlement(settlement)}
                                                                        className="text-yellow-600 hover:text-yellow-900"
                                                                        title="Edytuj"
                                                                    >
                                                                        <PencilIcon className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                                {settlement.status === 'paid' && (
                                                                    <span className="text-gray-400 cursor-not-allowed" title="Nie można edytować opłaconego rozliczenia">
                                                                        <PencilIcon className="w-4 h-4" />
                                                                    </span>
                                                                )}
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
                            )}

                            {/* Attachments Tab */}
                            {activeTab === 'attachments' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                            <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />
                                            Załączniki
                                        </h2>
                                        <button 
                                            onClick={() => setShowAttachmentModal(true)}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            <PlusIcon className="w-4 h-4 mr-2" />
                                            Dodaj załącznik
                                        </button>
                                    </div>

                                    {rental.attachments && rental.attachments.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Nazwa pliku
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Opis
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Rozmiar
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Data dodania
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Akcje
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {rental.attachments.map((attachment) => (
                                                        <tr key={attachment.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {attachment.original_name}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {attachment.description || '-'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {Math.round(attachment.file_size / 1024)} MB
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatDate(attachment.created_at)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={() => window.open(route('rentals.attachments.download', [rental.id, attachment.id]), '_blank')}
                                                                        className="text-indigo-600 hover:text-indigo-900"
                                                                    >
                                                                        Pobierz
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingAttachment(attachment);
                                                                            setShowAttachmentModal(true);
                                                                        }}
                                                                        className="text-gray-600 hover:text-gray-900"
                                                                    >
                                                                        Edytuj
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            if (confirm('Czy na pewno chcesz usunąć ten załącznik?')) {
                                                                                router.delete(route('rentals.attachments.destroy', [rental.id, attachment.id]));
                                                                            }
                                                                        }}
                                                                        className="text-red-600 hover:text-red-900"
                                                                    >
                                                                        Usuń
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">Brak załączników</h3>
                                            <p className="mt-1 text-sm text-gray-500">Załączniki dla tego najmu będą wyświetlane tutaj.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal zarządzania załącznikami */}
            <RentalAttachmentManagementModal
                isOpen={showAttachmentModal}
                onClose={() => {
                    setShowAttachmentModal(false);
                    setEditingAttachment(null);
                }}
                rental={rental}
                attachments={rental.attachments || []}
                editingAttachment={editingAttachment}
                openForm={!editingAttachment}
            />

            {/* Modale rozliczeń */}
            <SettlementCreateModal
                isOpen={showSettlementCreateModal}
                onClose={closeSettlementCreateModal}
                rental={rental}
                meters={rental?.property?.meters || []}
                years={Array.from({length: new Date().getFullYear() - (rental?.start_date ? new Date(rental.start_date).getFullYear() : new Date().getFullYear() - 1) + 1}, (_, i) => (rental?.start_date ? new Date(rental.start_date).getFullYear() : new Date().getFullYear() - 1) + i)}
                months={{
                    1: 'Styczeń', 2: 'Luty', 3: 'Marzec', 4: 'Kwiecień',
                    5: 'Maj', 6: 'Czerwiec', 7: 'Lipiec', 8: 'Sierpień',
                    9: 'Wrzesień', 10: 'Październik', 11: 'Listopad', 12: 'Grudzień'
                }}
            />

            <SettlementEditModal
                isOpen={showSettlementEditModal}
                onClose={closeSettlementEditModal}
                rental={rental}
                settlement={editingSettlement}
                meters={rental?.property?.meters || []}
            />
        </AuthenticatedLayout>
    );
}