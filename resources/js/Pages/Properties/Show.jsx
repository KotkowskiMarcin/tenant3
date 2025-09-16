import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PropertyImageManagementModal from '@/Components/PropertyImageManagementModal';
import PropertyImageViewerModal from '@/Components/PropertyImageViewerModal';
import PropertyAttachmentManagementModal from '@/Components/PropertyAttachmentManagementModal';
import PropertyAttachmentCard from '@/Components/PropertyAttachmentCard';
import PropertyAttachmentEditModal from '@/Components/PropertyAttachmentEditModal';
import PropertyAttachmentDeleteModal from '@/Components/PropertyAttachmentDeleteModal';
import PropertyAttachmentAddModal from '@/Components/PropertyAttachmentAddModal';
import PropertyEventTimeline from '@/Components/PropertyEventTimeline';
import PropertyEventManagementModal from '@/Components/PropertyEventManagementModal';
import FeeTypesManagementModal from '@/Components/FeeTypesManagementModal';
import PaymentCreateModal from '@/Components/PaymentCreateModal';
import PaymentEditModal from '@/Components/PaymentEditModal';
import RentalCreateModal from '@/Components/RentalCreateModal';
import ConfirmModal from '@/Components/ConfirmModal';
import MeterManagementModal from '@/Components/Meters/MeterManagementModal';
import MeterViewModal from '@/Components/Meters/MeterViewModal';
import MeterEditModal from '@/Components/Meters/MeterEditModal';
import MeterDeleteModal from '@/Components/Meters/MeterDeleteModal';
import { useState, useEffect } from 'react';
import { 
    PencilIcon, 
    TrashIcon, 
    PhotoIcon,
    MapPinIcon,
    HomeIcon,
    DocumentTextIcon,
    UserIcon,
    PaperClipIcon,
    CalendarDaysIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    ClockIcon,
    ArrowLeftIcon,
    InformationCircleIcon,
    BanknotesIcon,
    ClipboardDocumentListIcon,
    PlusIcon,
    FunnelIcon,
    XMarkIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    BoltIcon
} from '@heroicons/react/24/outline';

function Show({ property, feeTypes, requiredPayments, paymentStatistics, recentPayments, monthlyOverdueNotifications, currentYear, currentMonth, frequencyTypeOptions, paymentMethodOptions, statusOptions, allTenants, billingTypeOptions }) {
    // Dodaj try-catch na najwyższym poziomie komponentu
    try {
    
    // Zabezpieczenie dla usePage
    let pageProps = {};
    let flash = null;
    
    try {
        pageProps = usePage()?.props || {};
        flash = pageProps.flash || null;
    } catch (error) {
        console.error('Error accessing usePage:', error);
        pageProps = {};
        flash = null;
    }
    
    // Sprawdź czy property istnieje
    if (!property) {
        return (
            <AuthenticatedLayout>
                <Head title="Nieruchomość nie znaleziona" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h1 className="text-2xl font-bold text-red-600">Nieruchomość nie została znaleziona</h1>
                                <p className="mt-2 text-gray-600">Sprawdź czy nieruchomość istnieje i czy masz do niej dostęp.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Loading state - jeśli dane nie są jeszcze załadowane
    if (!property || !property.id) {
        return (
            <AuthenticatedLayout>
                <Head title="Ładowanie..." />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    <span className="ml-2 text-gray-600">Ładowanie...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }
    
    // Zabezpieczenia dla useState
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const isRentalActive = (rental) => {
        if (!rental.end_date) return true;
        return new Date(rental.end_date) > new Date();
    };

    const handleImageError = (e) => {
        console.log('Image load error:', e.target.src);
        // Zastąp obrazek placeholderem
        e.target.src = '/images/placeholder-image.svg';
        e.target.onerror = null; // Zapobiegaj nieskończonej pętli
    };
    const [showImageModal, setShowImageModal] = useState(false);
    const [showImageViewerModal, setShowImageViewerModal] = useState(false);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [showAttachmentEditModal, setShowAttachmentEditModal] = useState(false);
    const [showAttachmentDeleteModal, setShowAttachmentDeleteModal] = useState(false);
    const [showAttachmentAddModal, setShowAttachmentAddModal] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showFeeTypesModal, setShowFeeTypesModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showPaymentEditModal, setShowPaymentEditModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [prefilledPaymentData, setPrefilledPaymentData] = useState(null);
    const [showRentalCreateModal, setShowRentalCreateModal] = useState(false);
    const [showMeterModal, setShowMeterModal] = useState(false);
    const [showMeterViewModal, setShowMeterViewModal] = useState(false);
    const [showMeterEditModal, setShowMeterEditModal] = useState(false);
    const [showMeterCreateModal, setShowMeterCreateModal] = useState(false);
    const [showMeterDeleteModal, setShowMeterDeleteModal] = useState(false);
    const [viewingMeter, setViewingMeter] = useState(null);
    const [editingMeter, setEditingMeter] = useState(null);
    const [deletingMeter, setDeletingMeter] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');
    
    // Filtry płatności - domyślnie ustawione na aktualny miesiąc
    const getCurrentMonthRange = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
            startDate: firstDay.toISOString().split('T')[0],
            endDate: lastDay.toISOString().split('T')[0]
        };
    };

    const [paymentFilters, setPaymentFilters] = useState({
        feeTypeId: '',
        ...getCurrentMonthRange()
    });
    const [filteredPayments, setFilteredPayments] = useState([]);
    
    // Stany dla tabeli DataTable
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('payment_date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const primaryImage = property?.images && Array.isArray(property.images) ? property.images.find(img => img && img.is_primary) : null;
    
    // Zabezpieczenia dla property
    const safeProperty = property && typeof property === 'object' ? property : {};
    const safePropertyImages = safeProperty?.images && Array.isArray(safeProperty.images) ? safeProperty.images : [];
    const safePropertyRentals = safeProperty?.rentals && Array.isArray(safeProperty.rentals) ? safeProperty.rentals : [];
    const safePropertyEvents = safeProperty?.events && Array.isArray(safeProperty.events) ? safeProperty.events : [];
    const safePropertyAttachments = safeProperty?.attachments && Array.isArray(safeProperty.attachments) ? safeProperty.attachments : [];
    
    // Zabezpieczenia dla danych
    const safeFeeTypes = Array.isArray(feeTypes) ? feeTypes : [];
    const safeRequiredPayments = Array.isArray(requiredPayments) ? requiredPayments : [];
    const safePaymentStatistics = paymentStatistics && typeof paymentStatistics === 'object' ? paymentStatistics : {};
    const safeRecentPayments = Array.isArray(recentPayments) ? recentPayments : [];
    const safeMonthlyOverdueNotifications = Array.isArray(monthlyOverdueNotifications) ? monthlyOverdueNotifications : [];
    const safeAllTenants = Array.isArray(allTenants) ? allTenants : [];
    const safeBillingTypeOptions = Array.isArray(billingTypeOptions) ? billingTypeOptions : [];
    const safeCurrentYear = typeof currentYear === 'number' ? currentYear : new Date().getFullYear();
    const safeCurrentMonth = typeof currentMonth === 'number' ? currentMonth : new Date().getMonth() + 1;
    const safeFrequencyTypeOptions = Array.isArray(frequencyTypeOptions) ? frequencyTypeOptions : [];
    const safePaymentMethodOptions = Array.isArray(paymentMethodOptions) ? paymentMethodOptions : [];
    const safeStatusOptions = Array.isArray(statusOptions) ? statusOptions : [];

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleAttachmentEdit = (attachment) => {
        setSelectedAttachment(attachment);
        setShowAttachmentEditModal(true);
    };

    const handleAttachmentDelete = (attachment) => {
        setSelectedAttachment(attachment);
        setShowAttachmentDeleteModal(true);
    };

    const handleAttachmentDownload = (attachment) => {
        window.open(route('properties.attachments.download', [attachment.property_id, attachment.id]), '_blank');
    };

    const handleAttachmentAdd = () => {
        setShowAttachmentAddModal(true);
    };

    // Funkcje obsługi filtrów płatności
    const handleFilterChange = (field, value) => {
        setPaymentFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Automatyczne filtrowanie przy zmianie filtrów
    useEffect(() => {
        let filtered = safeRecentPayments || [];
        
        // Filtruj po typie opłaty
        if (paymentFilters.feeTypeId) {
            filtered = filtered.filter(payment => payment.fee_type_id == paymentFilters.feeTypeId);
        }
        
        // Filtruj po zakresie dat
        if (paymentFilters.startDate) {
            filtered = filtered.filter(payment => 
                new Date(payment.payment_date) >= new Date(paymentFilters.startDate)
            );
        }
        
        if (paymentFilters.endDate) {
            filtered = filtered.filter(payment => 
                new Date(payment.payment_date) <= new Date(paymentFilters.endDate)
            );
        }
        
        setFilteredPayments(filtered);
        setCurrentPage(1); // Resetuj stronę przy zmianie filtrów
    }, [paymentFilters, safeRecentPayments]);

    const clearFilters = () => {
        setPaymentFilters({
            feeTypeId: '',
            ...getCurrentMonthRange()
        });
    };

    const setCurrentMonth = () => {
        setPaymentFilters(prev => ({
            ...prev,
            ...getCurrentMonthRange()
        }));
    };

    const setPreviousMonth = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
        
        setPaymentFilters(prev => ({
            ...prev,
            startDate: firstDay.toISOString().split('T')[0],
            endDate: lastDay.toISOString().split('T')[0]
        }));
    };

    // Funkcje DataTable
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortedAndFilteredPayments = () => {
        let filtered = [...filteredPayments];
        
        // Wyszukiwanie
        if (searchTerm) {
            filtered = filtered.filter(payment => 
                (payment.fee_type ? payment.fee_type.name : 'Płatność ad-hoc').toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.amount.toString().includes(searchTerm) ||
                payment.payment_date.includes(searchTerm)
            );
        }
        
        // Sortowanie
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortField) {
                case 'fee_type':
                    aValue = a.fee_type ? a.fee_type.name : 'Płatność ad-hoc';
                    bValue = b.fee_type ? b.fee_type.name : 'Płatność ad-hoc';
                    break;
                case 'amount':
                    aValue = parseFloat(a.amount);
                    bValue = parseFloat(b.amount);
                    break;
                case 'payment_date':
                    aValue = new Date(a.payment_date);
                    bValue = new Date(b.payment_date);
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                default:
                    aValue = a[sortField];
                    bValue = b[sortField];
            }
            
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        return filtered;
    };

    const getPaginatedPayments = () => {
        const sorted = getSortedAndFilteredPayments();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sorted.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(getSortedAndFilteredPayments().length / itemsPerPage);

    // Oblicz sumę kwot wyświetlanych płatności (tylko zakończone)
    const getTotalAmount = () => {
        return getSortedAndFilteredPayments()
            .filter(payment => payment.status === 'completed')
            .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    };

    const confirmDelete = () => {
        router.delete(route('properties.destroy', property.id));
        setShowDeleteModal(false);
    };

    // Funkcje obsługi płatności
    const handlePaymentEdit = (payment) => {
        setSelectedPayment(payment);
        setShowPaymentEditModal(true);
    };

    const handlePaymentDelete = (payment) => {
        if (confirm('Czy na pewno chcesz usunąć tę płatność?')) {
            router.delete(route('payments.destroy', payment.id), {
                onSuccess: () => {
                    // Odśwież dane po usunięciu
                    router.reload({ only: ['recentPayments'] });
                }
            });
        }
    };

    const handleCreatePaymentFromNotification = (notification) => {
        // Przygotuj dane dla pre-wypełnionego modalu
        const today = new Date().toISOString().split('T')[0];
        setPrefilledPaymentData({
            fee_type_id: notification.fee_type_id,
            amount: notification.amount,
            description: `${notification.name} - ${new Date().toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}`,
            payment_date: today,
            due_date: today,
            payment_method: 'bank_transfer',
            status: 'completed'
        });
        setShowPaymentModal(true);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'rented':
                return 'bg-yellow-100 text-yellow-800';
            case 'unavailable':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const tabs = [
        { id: 'basic', name: 'Podstawowe', icon: InformationCircleIcon },
        { id: 'financial', name: 'Finansowy', icon: BanknotesIcon },
        { id: 'payments', name: 'Płatności', icon: ChartBarIcon },
        { id: 'rentals', name: 'Najmy', icon: HomeIcon },
        { id: 'meters', name: 'Liczniki', icon: BoltIcon },
        { id: 'events', name: 'Zdarzenia', icon: CalendarDaysIcon },
        { id: 'attachments', name: 'Załączniki', icon: ClipboardDocumentListIcon }
    ];

    return (
        <AuthenticatedLayout>
            <Head title={`Nieruchomość - ${property.name}`} />
            
            {/* Wiadomości o sukcesie */}
            {flash?.success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 mx-6 mt-6">
                    {flash?.success}
                </div>
            )}

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white shadow-sm rounded-lg mb-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Link
                                        href={route('properties.index')}
                                        className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <ArrowLeftIcon className="w-5 h-5" />
                                    </Link>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
                                        <div className="flex items-center mt-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.status)}`}>
                                                {property.status_label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('properties.edit', property.id)}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        Edytuj
                                    </Link>
                                    <button
                                        onClick={handleDeleteClick}
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
                                            <div className="bg-gray-50 rounded-lg p-6">
                                                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                                    <HomeIcon className="w-5 h-5 mr-2" />
                                                    Informacje podstawowe
                                                </h2>
                                                <div className="space-y-6">
                                                    <div className="flex items-start">
                                                        <MapPinIcon className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">Adres</p>
                                                            <p className="text-sm text-gray-900 whitespace-pre-line">{property.address}</p>
                                                        </div>
                                                    </div>

                                                    {property.area && (
                                                        <div className="flex items-start">
                                                            <div className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0 flex items-center justify-center">
                                                                <span className="text-lg">⬜</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Powierzchnia</p>
                                                                <p className="text-sm text-gray-900">{property.area} m²</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {property.rooms && (
                                                        <div className="flex items-start">
                                                            <div className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0 flex items-center justify-center">
                                                                <span className="text-lg">⊞</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Liczba pokoi</p>
                                                                <p className="text-sm text-gray-900">{property.rooms}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {property.description && (
                                                        <div className="flex items-start">
                                                            <DocumentTextIcon className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Opis</p>
                                                                <p className="text-sm text-gray-900 whitespace-pre-line">{property.description}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {property.cooperative_info && (
                                                        <div className="flex items-start">
                                                            <div className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0 flex items-center justify-center">
                                                                <span className="text-lg">🏢</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Spółdzielnia/Wspólnota mieszkaniowa</p>
                                                                <p className="text-sm text-gray-900 whitespace-pre-line">{property.cooperative_info}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Owner Information */}
                                            <div className="bg-gray-50 rounded-lg p-6">
                                                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                                    <UserIcon className="w-5 h-5 mr-2" />
                                                    Właściciel
                                                </h2>
                                                <div className="space-y-4">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            <Link
                                                                href={route('owners.show', property.owner.id)}
                                                                className="hover:text-blue-600"
                                                            >
                                                                {property.owner.first_name} {property.owner.last_name}
                                                            </Link>
                                                        </h3>
                                                        <p className="text-sm text-gray-500">{property.owner.email}</p>
                                                    </div>
                                                    {property.owner.phone && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">Telefon</p>
                                                            <p className="text-sm text-gray-900">{property.owner.phone}</p>
                                                        </div>
                                                    )}
                                                    {property.owner.address && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-500">Adres</p>
                                                            <p className="text-sm text-gray-900">{property.owner.address}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right column - Image Gallery */}
                                        <div className="space-y-6">
                                            <div className="bg-gray-50 rounded-lg p-6">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                                        <PhotoIcon className="w-5 h-5 mr-2" />
                                                        Galeria zdjęć ({safePropertyImages?.length || 0})
                                                    </h2>
                                                    <button
                                                        onClick={() => setShowImageModal(true)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                    >
                                                        Zarządzaj zdjęciami
                                                    </button>
                                                </div>

                                                {safePropertyImages && safePropertyImages.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {/* Zdjęcie wiodące */}
                                                        <div className="relative group">
                                                            <img
                                                                src={primaryImage?.url || safePropertyImages?.[0]?.url}
                                                                alt={primaryImage?.original_name || safePropertyImages?.[0]?.original_name}
                                                                className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                                onClick={() => setShowImageModal(true)}
                                                                onError={handleImageError}
                                                            />
                                                            {primaryImage && (
                                                                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                                    Wiodące
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Trzy dodatkowe zdjęcia */}
                                                        {safePropertyImages?.length > 1 && (
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {safePropertyImages
                                                                    ?.filter(img => !img.is_primary)
                                                                    ?.slice(0, 3)
                                                                    .map((image, index) => (
                                                                        <div key={image.id} className="relative group">
                                                                            <img
                                                                                src={image.url}
                                                                                alt={image.original_name}
                                                                                className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                                                                                onClick={() => setShowImageModal(true)}
                                                                                onError={handleImageError}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                
                                                                {/* Placeholder dla brakujących zdjęć */}
                                                                {safePropertyImages?.filter(img => !img.is_primary)?.length < 3 && 
                                                                    Array.from({ length: 3 - (safePropertyImages?.filter(img => !img.is_primary)?.length || 0) }).map((_, index) => (
                                                                        <div key={`placeholder-${index}`} className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                                                                            <PhotoIcon className="h-6 w-6 text-gray-400" />
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        )}

                                                        {/* Przycisk "Zobacz wszystkie" */}
                                                        {safePropertyImages?.length > 4 && (
                                                            <div className="text-center">
                                                                <button
                                                                    onClick={() => setShowImageViewerModal(true)}
                                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center mx-auto"
                                                                >
                                                                    <PhotoIcon className="h-4 w-4 mr-1" />
                                                                    Zobacz wszystkie zdjęcia ({safePropertyImages?.length})
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                                                        <PhotoIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                                        <p className="text-gray-500 mb-4">Brak zdjęć w galerii</p>
                                                        <button
                                                            onClick={() => setShowImageModal(true)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Dodaj pierwsze zdjęcie
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Additional Information */}
                                            <div className="bg-gray-50 rounded-lg p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dodatkowe informacje</h3>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Data utworzenia:</span>
                                                        <span className="text-gray-900">{new Date(property.created_at).toLocaleDateString('pl-PL')}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Ostatnia aktualizacja:</span>
                                                        <span className="text-gray-900">{new Date(property.updated_at).toLocaleDateString('pl-PL')}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">ID nieruchomości:</span>
                                                        <span className="text-gray-900">#{property.id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Financial Tab */}
                            {activeTab === 'financial' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                            <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                                            Panel Finansowy
                                        </h2>
                                        <div className="flex space-x-2">
                                            <Link
                                                href={route('properties.payments.required', property.id)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium"
                                            >
                                                Wymagane płatności
                                            </Link>
                                            <Link
                                                href={route('properties.payments.statistics', property.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium"
                                            >
                                                Statystyki
                                            </Link>
                                            <Link
                                                href={route('payments.create', { property_id: property.id })}
                                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium"
                                            >
                                                Nowa płatność
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                        {/* Statystyki finansowe */}
                                        <div className="bg-white p-4 rounded-lg border">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <ChartBarIcon className="h-8 w-8 text-green-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-500">Suma w {safeCurrentYear}</p>
                                                    <p className="text-2xl font-semibold text-gray-900">
                                                        {safePaymentStatistics?.total_amount?.toLocaleString('pl-PL', {
                                                            style: 'currency',
                                                            currency: 'PLN'
                                                        }) || '0,00 zł'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-lg border">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <ClockIcon className="h-8 w-8 text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-500">Liczba transakcji</p>
                                                    <p className="text-2xl font-semibold text-gray-900">
                                                        {safePaymentStatistics?.total_count || 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-lg border">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-500">Średnia kwota</p>
                                                    <p className="text-2xl font-semibold text-gray-900">
                                                        {safePaymentStatistics?.average_amount?.toLocaleString('pl-PL', {
                                                            style: 'currency',
                                                            currency: 'PLN'
                                                        }) || '0,00 zł'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-lg border">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <ChartBarIcon className={`h-8 w-8 ${(safePaymentStatistics?.year_over_year_change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-500">Zmiana YoY</p>
                                                    <p className={`text-2xl font-semibold ${(safePaymentStatistics?.year_over_year_change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {(safePaymentStatistics?.year_over_year_change || 0) >= 0 ? '+' : ''}{safePaymentStatistics?.year_over_year_change || 0}%
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Wymagane płatności na bieżący miesiąc */}
                                    {safeRequiredPayments && safeRequiredPayments.length > 0 && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                                                Wymagane płatności - {new Date(safeCurrentYear, safeCurrentMonth - 1).toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
                                            </h3>
                                            <div className="space-y-2">
                                                {safeRequiredPayments.map((payment, index) => (
                                                    <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{payment.name}</p>
                                                            {payment.description && (
                                                                <p className="text-sm text-gray-500">{payment.description}</p>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-gray-900">
                                                                {payment.amount.toLocaleString('pl-PL', {
                                                                    style: 'currency',
                                                                    currency: 'PLN'
                                                                })}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {payment.frequency_type === 'monthly' ? 'Miesięcznie' :
                                                                 payment.frequency_type === 'quarterly' ? `Co ${payment.frequency_value} miesięcy` :
                                                                 payment.frequency_type === 'biannual' ? 'Co pół roku' :
                                                                 payment.frequency_type === 'annual' ? 'Rocznie' :
                                                                 `Miesiąc ${payment.frequency_value}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 text-center">
                                                <Link
                                                    href={route('properties.payments.required', property.id)}
                                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm font-medium"
                                                >
                                                    Opłać wszystkie
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    {/* Ostatnie płatności */}
                                    {safeRecentPayments && safeRecentPayments.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Ostatnie płatności</h3>
                                            <div className="space-y-2">
                                                {safeRecentPayments.map((payment) => (
                                                    <div key={payment.id} className="flex justify-between items-center bg-white p-3 rounded border">
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {payment.fee_type ? payment.fee_type.name : 'Płatność ad-hoc'}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(payment.payment_date).toLocaleDateString('pl-PL')}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-gray-900">
                                                                {payment.amount.toLocaleString('pl-PL', {
                                                                    style: 'currency',
                                                                    currency: 'PLN'
                                                                })}
                                                            </p>
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
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 text-center">
                                                <Link
                                                    href={route('payments.index', { property_id: property.id })}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    Zobacz wszystkie płatności
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Events Tab */}
                            {activeTab === 'events' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                            <CalendarDaysIcon className="w-5 h-5 mr-2" />
                                            Zdarzenia ({safePropertyEvents?.length || 0})
                                        </h2>
                                        <button
                                            onClick={() => setShowEventModal(true)}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center"
                                        >
                                            <PlusIcon className="w-4 h-4 mr-2" />
                                            Dodaj zdarzenie
                                        </button>
                                    </div>
                                    
                                    {safePropertyEvents && safePropertyEvents.length > 0 ? (
                                        <PropertyEventTimeline events={safePropertyEvents} propertyId={safeProperty?.id} property={safeProperty} />
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                                            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <p className="text-gray-500 mb-4">Brak zdarzeń dla tej nieruchomości</p>
                                            <button
                                                onClick={() => setShowEventModal(true)}
                                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center mx-auto"
                                            >
                                                <PlusIcon className="w-4 h-4 mr-2" />
                                                Dodaj pierwsze zdarzenie
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Attachments Tab */}
                            {activeTab === 'payments' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900">Płatności</h3>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => setShowFeeTypesModal(true)}
                                                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                                                Szablony opłat
                                            </button>
                                            <button
                                                onClick={() => setShowPaymentModal(true)}
                                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                <PlusIcon className="w-4 h-4 mr-2" />
                                                Dodaj płatność
                                            </button>
                                        </div>
                                    </div>

                                    {/* Powiadomienia o nieopłaconych comiesięcznych opłatach */}
                                    {safeMonthlyOverdueNotifications && safeMonthlyOverdueNotifications.length > 0 && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-yellow-800">
                                                        Nieopłacone comiesięczne opłaty
                                                    </h3>
                                                    <div className="mt-2 text-sm text-yellow-700">
                                                        <p className="mb-2">
                                                            Następujące comiesięczne opłaty nie zostały jeszcze uiszczone w bieżącym miesiącu:
                                                        </p>
                                                        <ul className="space-y-3">
                                                            {safeMonthlyOverdueNotifications.map((notification) => (
                                                                <li key={notification.fee_type_id} className="flex items-center justify-between bg-yellow-100 rounded-lg p-3">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center">
                                                                            <strong className="text-yellow-800">{notification.name}</strong>
                                                                            <span className="text-yellow-700 ml-2 font-semibold">
                                                                                {notification.amount} zł
                                                                            </span>
                                                                        </div>
                                                                        {notification.description && (
                                                                            <p className="text-yellow-600 text-sm mt-1">
                                                                                {notification.description}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleCreatePaymentFromNotification(notification)}
                                                                        className="ml-4 inline-flex items-center px-3 py-2 bg-yellow-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-700 focus:bg-yellow-700 active:bg-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                                    >
                                                                        <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                                                                        Wykonaj opłatę
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Filtry płatności - zawsze widoczne */}
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-lg font-medium text-gray-900">Filtry płatności</h4>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                            {/* Typ opłaty */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Typ opłaty
                                                </label>
                                                <select
                                                    value={paymentFilters.feeTypeId}
                                                    onChange={(e) => handleFilterChange('feeTypeId', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    <option value="">Wszystkie typy</option>
                                                    {safeFeeTypes && safeFeeTypes.map((feeType) => (
                                                        <option key={feeType.id} value={feeType.id}>
                                                            {feeType.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Data od */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Data od
                                                </label>
                                                <input
                                                    type="date"
                                                    value={paymentFilters.startDate}
                                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>

                                            {/* Data do */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Data do
                                                </label>
                                                <input
                                                    type="date"
                                                    value={paymentFilters.endDate}
                                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>

                                            {/* Szybkie ustawienia */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Szybkie ustawienia
                                                </label>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={setCurrentMonth}
                                                        className="px-3 py-2 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                                    >
                                                        Bieżący miesiąc
                                                    </button>
                                                    <button
                                                        onClick={setPreviousMonth}
                                                        className="px-3 py-2 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                                    >
                                                        Poprzedni miesiąc
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                onClick={clearFilters}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Wyczyść filtry
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Resetuj stronę i zastosuj filtry
                                                    setCurrentPage(1);
                                                    // Filtry są już automatycznie aplikowane przez useEffect
                                                }}
                                                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 min-w-[120px]"
                                            >
                                                Szukaj
                                            </button>
                                        </div>
                                    </div>
                                    {/* Tabela płatności DataTable */}
                                    <div className="bg-white rounded-lg shadow">
                                        {/* Nagłówek z wyszukiwaniem */}
                                        <div className="px-6 py-4 border-b border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Płatności
                                                        <span className="text-sm font-normal text-gray-500 ml-2">
                                                            ({getSortedAndFilteredPayments().length} {getSortedAndFilteredPayments().length === 1 ? 'płatność' : 'płatności'})
                                                        </span>
                                                    </h3>
                                                    {getSortedAndFilteredPayments().length > 0 && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Suma: <span className="font-semibold text-gray-900">{getTotalAmount().toFixed(2)} zł</span>
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative flex">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Szukaj płatności..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    setCurrentPage(1);
                                                                }
                                                            }}
                                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        />
                                                        <button
                                                            onClick={() => setCurrentPage(1)}
                                                            className="ml-2 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        >
                                                            Szukaj w wynikach
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tabela */}
                                        {getPaginatedPayments().length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th 
                                                                scope="col" 
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                                onClick={() => handleSort('fee_type')}
                                                            >
                                                                <div className="flex items-center">
                                                                    Typ opłaty
                                                                    {sortField === 'fee_type' && (
                                                                        sortDirection === 'asc' ? 
                                                                            <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                                                                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                                                                    )}
                                                                </div>
                                                            </th>
                                                            <th 
                                                                scope="col" 
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                                onClick={() => handleSort('amount')}
                                                            >
                                                                <div className="flex items-center">
                                                                    Kwota
                                                                    {sortField === 'amount' && (
                                                                        sortDirection === 'asc' ? 
                                                                            <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                                                                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                                                                    )}
                                                                </div>
                                                            </th>
                                                            <th 
                                                                scope="col" 
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                                onClick={() => handleSort('payment_date')}
                                                            >
                                                                <div className="flex items-center">
                                                                    Data płatności
                                                                    {sortField === 'payment_date' && (
                                                                        sortDirection === 'asc' ? 
                                                                            <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                                                                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                                                                    )}
                                                                </div>
                                                            </th>
                                                            <th 
                                                                scope="col" 
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                                onClick={() => handleSort('status')}
                                                            >
                                                                <div className="flex items-center">
                                                                    Status
                                                                    {sortField === 'status' && (
                                                                        sortDirection === 'asc' ? 
                                                                            <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                                                                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                                                                    )}
                                                                </div>
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Opis
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Akcje
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {getPaginatedPayments().map((payment) => (
                                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {payment.fee_type ? payment.fee_type.name : 'Płatność ad-hoc'}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm font-semibold text-gray-900">
                                                                        {payment.amount} zł
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900">
                                                                        {new Date(payment.payment_date).toLocaleDateString('pl-PL')}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                                                        {payment.description || '-'}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => handlePaymentEdit(payment)}
                                                                            className="text-indigo-600 hover:text-indigo-900"
                                                                            title="Edytuj płatność"
                                                                        >
                                                                            <PencilSquareIcon className="h-4 w-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handlePaymentDelete(payment)}
                                                                            className="text-red-600 hover:text-red-900"
                                                                            title="Usuń płatność"
                                                                        >
                                                                            <TrashIcon className="h-4 w-4" />
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
                                                <div className="text-gray-500">
                                                    <FunnelIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                    <p className="text-lg font-medium mb-2">Brak płatności spełniających kryteria</p>
                                                    <p className="text-sm">Spróbuj zmienić filtry lub wyczyść je, aby zobaczyć wszystkie płatności.</p>
                                                </div>
                                            </div>
                                        )}

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
                                                            Strona <span className="font-medium">{currentPage}</span> z <span className="font-medium">{totalPages}</span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                            <button
                                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                                disabled={currentPage === 1}
                                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <ChevronUpIcon className="h-5 w-5" />
                                                            </button>
                                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                                <button
                                                                    key={page}
                                                                    onClick={() => setCurrentPage(page)}
                                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                        page === currentPage
                                                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
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
                                                                <ChevronDownIcon className="h-5 w-5" />
                                                            </button>
                                                        </nav>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <p className="text-gray-600 mb-4">Zarządzaj płatnościami dla tej nieruchomości.</p>
                                        <div className="flex space-x-3">
                                            <Link
                                                href={route('properties.payments.index', property.id)}
                                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                <ChartBarIcon className="w-4 h-4 mr-2" />
                                                Zobacz wszystkie płatności
                                            </Link>
                                            <Link
                                                href={route('properties.payments.required', property.id)}
                                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                <ClockIcon className="w-4 h-4 mr-2" />
                                                Wymagane płatności
                                            </Link>
                                            <Link
                                                href={route('properties.payments.statistics', property.id)}
                                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                <ChartBarIcon className="w-4 h-4 mr-2" />
                                                Statystyki
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'rentals' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900">Najmy</h3>
                                        <button
                                            onClick={() => setShowRentalCreateModal(true)}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            <PlusIcon className="w-4 h-4 mr-2" />
                                            Dodaj najem
                                        </button>
                                    </div>
                                    
                                    {safePropertyRentals && safePropertyRentals.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Najemca
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
                                                    {safePropertyRentals?.map((rental) => (
                                                        <tr key={rental.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <Link
                                                                    href={route('tenants.show', rental.tenant.id)}
                                                                    className="text-sm font-medium text-blue-600 hover:text-blue-900"
                                                                >
                                                                    {rental.tenant.first_name} {rental.tenant.last_name}
                                                                </Link>
                                                                {rental.tenant.email && (
                                                                    <p className="text-sm text-gray-500">{rental.tenant.email}</p>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {new Date(rental.start_date).toLocaleDateString('pl-PL')}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {rental.end_date ? new Date(rental.end_date).toLocaleDateString('pl-PL') : 'Bezterminowy'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {new Intl.NumberFormat('pl-PL', {
                                                                    style: 'currency',
                                                                    currency: 'PLN'
                                                                }).format(rental.rent_amount)}
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
                                                                        title="Zobacz szczegóły"
                                                                    >
                                                                        <EyeIcon className="w-4 h-4" />
                                                                    </Link>
                                                                    <Link
                                                                        href={route('rentals.edit', rental.id)}
                                                                        className="text-indigo-600 hover:text-indigo-900"
                                                                        title="Edytuj"
                                                                    >
                                                                        <PencilIcon className="w-4 h-4" />
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <HomeIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">Brak najmów</h3>
                                            <p className="mt-1 text-sm text-gray-500">Dodaj pierwszy najem dla tej nieruchomości.</p>
                                            <div className="mt-6">
                                                <button
                                                    onClick={() => setShowRentalCreateModal(true)}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                >
                                                    <PlusIcon className="w-4 h-4 mr-2" />
                                                    Dodaj najem
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'meters' && (
                                <div className="space-y-6">
                                    <div className="bg-white shadow rounded-lg">
                                        <div className="px-6 py-4 border-b border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <BoltIcon className="h-6 w-6 text-blue-600 mr-3" />
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        Liczniki ({safeProperty?.meters?.length || 0})
                                                    </h3>
                                                </div>
                                                <button
                                                    onClick={() => setShowMeterCreateModal(true)}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                >
                                                    <PlusIcon className="h-4 w-4 mr-2" />
                                                    Dodaj licznik
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            {safeProperty?.meters && safeProperty.meters.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Nazwa
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Numer seryjny
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Dostawca
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Stan
                                                                </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cena/jednostka
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Akcje
                                            </th>
                                        </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {safeProperty.meters.map((meter) => (
                                                                <tr key={meter.id} className="hover:bg-gray-50">
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="flex items-center">
                                                                            <BoltIcon className="h-5 w-5 text-blue-500 mr-2" />
                                                                            <div className="text-sm font-medium text-gray-900">
                                                                                {meter.name}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {meter.serial_number}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {meter.provider || '-'}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {meter.formatted_reading}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {meter.formatted_price_per_unit}
                                                                    </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                setViewingMeter(meter);
                                                                setShowMeterViewModal(true);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="Podgląd"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingMeter(meter);
                                                                setShowMeterEditModal(true);
                                                            }}
                                                            className="text-yellow-600 hover:text-yellow-900"
                                                            title="Edytuj"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setDeletingMeter(meter);
                                                                setShowMeterDeleteModal(true);
                                                            }}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Usuń"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
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
                                                    <BoltIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Brak liczników</h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Zacznij od dodania pierwszego licznika.
                                                    </p>
                                                    <div className="mt-6">
                                                        <button
                                                            onClick={() => setShowMeterCreateModal(true)}
                                                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                        >
                                                            <PlusIcon className="h-4 w-4 mr-2" />
                                                            Dodaj pierwszy licznik
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'attachments' && (
                                <div className="space-y-6">
                                    <PropertyAttachmentCard 
                                        attachments={safePropertyAttachments} 
                                        onEdit={handleAttachmentEdit}
                                        onDelete={handleAttachmentDelete}
                                        onDownload={handleAttachmentDownload}
                                        onAddNew={handleAttachmentAdd}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal zarządzania zdjęciami */}
            <PropertyImageManagementModal
                show={showImageModal}
                onClose={() => setShowImageModal(false)}
                property={safeProperty}
            />

            {/* Modal przeglądania zdjęć */}
            <PropertyImageViewerModal
                show={showImageViewerModal}
                onClose={() => setShowImageViewerModal(false)}
                property={safeProperty}
            />

            {/* Modal zarządzania załącznikami */}
            <PropertyAttachmentManagementModal
                isOpen={showAttachmentModal}
                onClose={() => setShowAttachmentModal(false)}
                property={safeProperty}
                attachments={property.attachments || []}
            />

            {/* Modal edycji załącznika */}
            <PropertyAttachmentEditModal
                isOpen={showAttachmentEditModal}
                onClose={() => {
                    setShowAttachmentEditModal(false);
                    setSelectedAttachment(null);
                }}
                attachment={selectedAttachment}
            />

            {/* Modal usuwania załącznika */}
            <PropertyAttachmentDeleteModal
                isOpen={showAttachmentDeleteModal}
                onClose={() => {
                    setShowAttachmentDeleteModal(false);
                    setSelectedAttachment(null);
                }}
                attachment={selectedAttachment}
            />

            {/* Modal dodawania załącznika */}
            <PropertyAttachmentAddModal
                isOpen={showAttachmentAddModal}
                onClose={() => setShowAttachmentAddModal(false)}
                property={safeProperty}
            />

            {/* Modal zarządzania zdarzeniami */}
            <PropertyEventManagementModal
                isOpen={showEventModal}
                onClose={() => setShowEventModal(false)}
                propertyId={safeProperty?.id}
                events={safePropertyEvents}
                openForm={true}
            />

            {/* Modal potwierdzenia usuwania nieruchomości */}
            <ConfirmModal
                show={showDeleteModal}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Usuń nieruchomość"
                message="Czy na pewno chcesz usunąć tę nieruchomość? Ta akcja nie może zostać cofnięta i usunie również wszystkie powiązane zdjęcia."
                confirmText="Tak, usuń"
                cancelText="Anuluj"
                type="danger"
            />

            {/* Modal dodawania najmu */}
            <RentalCreateModal
                show={showRentalCreateModal}
                onClose={() => setShowRentalCreateModal(false)}
                property={safeProperty}
                tenants={safeAllTenants}
                billingTypeOptions={safeBillingTypeOptions}
            />

            {/* Modal zarządzania licznikami */}
            <MeterManagementModal
                property={safeProperty}
                isOpen={showMeterModal}
                onClose={() => setShowMeterModal(false)}
            />

            {/* Modal podglądu licznika */}
            <MeterViewModal
                meter={viewingMeter}
                isOpen={showMeterViewModal}
                onClose={() => {
                    setShowMeterViewModal(false);
                    setViewingMeter(null);
                }}
            />

            {/* Modal edycji licznika */}
            <MeterEditModal
                meter={editingMeter}
                isOpen={showMeterEditModal}
                onClose={() => {
                    setShowMeterEditModal(false);
                    setEditingMeter(null);
                }}
                isCreating={false}
                property={safeProperty}
            />

            {/* Modal tworzenia licznika */}
            <MeterEditModal
                meter={null}
                isOpen={showMeterCreateModal}
                onClose={() => {
                    setShowMeterCreateModal(false);
                }}
                isCreating={true}
                property={property}
            />

            {/* Modal usuwania licznika */}
            <MeterDeleteModal
                meter={deletingMeter}
                isOpen={showMeterDeleteModal}
                onClose={() => {
                    setShowMeterDeleteModal(false);
                    setDeletingMeter(null);
                }}
                onConfirm={() => {
                    if (deletingMeter) {
                        router.delete(route('property-meters.destroy', deletingMeter.id), {
                            onSuccess: () => {
                                setShowMeterDeleteModal(false);
                                setDeletingMeter(null);
                            }
                        });
                    }
                }}
            />

            {/* Modal zarządzania szablonami opłat */}
            <FeeTypesManagementModal
                isOpen={showFeeTypesModal}
                onClose={() => setShowFeeTypesModal(false)}
                property={safeProperty}
                feeTypes={safeFeeTypes}
                frequencyTypeOptions={safeFrequencyTypeOptions}
                onRefresh={() => {
                    // Odśwież dane bez przeładowania strony
                    router.reload({ only: ['feeTypes'] });
                }}
            />

            {/* Modal dodawania płatności */}
            <PaymentCreateModal
                isOpen={showPaymentModal}
                onClose={() => {
                    setShowPaymentModal(false);
                    setPrefilledPaymentData(null);
                }}
                property={safeProperty}
                feeTypes={safeFeeTypes}
                paymentMethodOptions={safePaymentMethodOptions}
                statusOptions={safeStatusOptions}
                prefilledData={prefilledPaymentData}
                onSuccess={() => {
                    // Odśwież dane po dodaniu płatności
                    router.reload({ only: ['recentPayments', 'monthlyOverdueNotifications'] });
                    setPrefilledPaymentData(null);
                }}
            />

            {/* Modal edycji płatności */}
            <PaymentEditModal
                isOpen={showPaymentEditModal}
                onClose={() => {
                    setShowPaymentEditModal(false);
                    setSelectedPayment(null);
                }}
                payment={selectedPayment}
                property={safeProperty}
                feeTypes={safeFeeTypes}
                paymentMethodOptions={safePaymentMethodOptions}
                statusOptions={safeStatusOptions}
                onSuccess={() => {
                    // Odśwież dane po edycji płatności
                    router.reload({ only: ['recentPayments'] });
                }}
            />
        </AuthenticatedLayout>
    );
    
    } catch (error) {
        console.error('Error in Show component:', error);
        return (
            <AuthenticatedLayout>
                <Head title="Błąd" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h1 className="text-2xl font-bold text-red-600 mb-4">Wystąpił błąd</h1>
                                <p className="text-gray-600 mb-4">
                                    Przepraszamy, wystąpił nieoczekiwany błąd podczas ładowania strony.
                                </p>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Odśwież stronę
                                </button>
                                <div className="mt-4 text-sm text-gray-500">
                                    Błąd: {error.message}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }
}

export default Show;
