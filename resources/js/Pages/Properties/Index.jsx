import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { useState } from 'react';
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Index({ properties }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);

    const handleDeleteClick = (id) => {
        setPropertyToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (propertyToDelete) {
            router.delete(route('properties.destroy', propertyToDelete));
        }
        setShowDeleteModal(false);
        setPropertyToDelete(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setPropertyToDelete(null);
    };

    const filteredProperties = properties.data.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.owner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.owner.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <AuthenticatedLayout>
            <Head title="Nieruchomości" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Nieruchomości</h1>
                                <Link
                                    href={route('properties.create')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <span className="w-4 h-4 mr-2 text-lg">+</span>
                                    Dodaj nieruchomość
                                </Link>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Szukaj nieruchomości..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Properties Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProperties.map((property) => {
                                    // Znajdź zdjęcie wiodące lub pierwsze dostępne
                                    const primaryImage = property.images?.find(img => img.is_primary);
                                    const fallbackImage = property.images?.[0];
                                    const displayImage = primaryImage || fallbackImage;
                                    const hasImage = displayImage && property.images && property.images.length > 0;
                                    
                                    return (
                                        <Link
                                            key={property.id}
                                            href={route('properties.show', property.id)}
                                            className="group block"
                                        >
                                            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                                                {/* Background Image or Placeholder */}
                                                {hasImage ? (
                                                    <img
                                                        src={displayImage.url}
                                                        alt={property.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            console.error('Image load error:', e.target.src);
                                                            e.target.style.display = 'none';
                                                            e.target.nextElementSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                
                                                {/* Fallback placeholder - always present but hidden when image loads */}
                                                <div 
                                                    className={`w-full h-full bg-gray-400 flex items-center justify-center ${hasImage ? 'hidden' : 'flex'}`}
                                                >
                                                    <HomeIcon className="w-16 h-16 text-gray-600" />
                                                </div>
                                                
                                                {/* Overlay with gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                                                
                                                {/* Content */}
                                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="text-lg font-bold line-clamp-1">
                                                            {property.name}
                                                        </h3>
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                                                            {property.status_label}
                                                        </span>
                                                    </div>
                                                    
                                                    <p className="text-sm text-gray-200 mb-1 line-clamp-1">
                                                        {property.owner.first_name} {property.owner.last_name}
                                                    </p>
                                                    
                                                    <p className="text-sm text-gray-300 line-clamp-2">
                                                        {property.address}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {filteredProperties.length === 0 && (
                                <div className="text-center py-8">
                                    <HomeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Brak nieruchomości do wyświetlenia.</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {properties.links && (
                                <div className="mt-6">
                                    <nav className="flex items-center justify-between">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            {properties.links.prev && properties.links.prev.url && (
                                                <Link
                                                    href={properties.links.prev.url}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    Poprzednia
                                                </Link>
                                            )}
                                            {properties.links.next && properties.links.next.url && (
                                                <Link
                                                    href={properties.links.next.url}
                                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    Następna
                                                </Link>
                                            )}
                                        </div>
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Pokazuję <span className="font-medium">{properties.from}</span> do{' '}
                                                    <span className="font-medium">{properties.to}</span> z{' '}
                                                    <span className="font-medium">{properties.total}</span> wyników
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                    {properties.links.map((link, index) => (
                                                        link.url ? (
                                                            <Link
                                                                key={index}
                                                                href={link.url}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                    link.active
                                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        ) : (
                                                            <span
                                                                key={index}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                    link.active
                                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                        : 'bg-white border-gray-300 text-gray-500'
                                                                }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        )
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
        </AuthenticatedLayout>
    );
}
