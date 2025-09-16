import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { 
    PlusIcon, 
    EyeIcon, 
    TrashIcon, 
    StarIcon,
    PhotoIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Modal from './Modal';
import PrimaryButton from './PrimaryButton';
import DangerButton from './DangerButton';
import ConfirmModal from './ConfirmModal';

export default function PropertyImageManagementModal({ 
    show, 
    onClose, 
    property 
}) {
    const handleImageError = (e) => {
        console.log('Image load error:', e.target.src);
        e.target.src = '/images/placeholder-image.svg';
        e.target.onerror = null;
    };

    const [showLightbox, setShowLightbox] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);

    const { data, setData, processing, errors, reset } = useForm({
        images: []
    });

    const primaryImage = property.images?.find(img => img.is_primary);
    const additionalImages = property.images?.filter(img => !img.is_primary) || [];
    const totalImages = property.images?.length || 0;

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);
    };

    const submitUpload = (e) => {
        e.preventDefault();
        
        if (data.images.length === 0) {
            console.error('No images selected!');
            return;
        }
        
        const formData = new FormData();
        data.images.forEach((image, index) => {
            formData.append('images[]', image);
        });
        
        router.post(route('properties.images.store', property.id), formData, {
            forceFormData: true,
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                console.error('Upload errors:', errors);
            }
        });
    };

    const setAsPrimary = (imageId) => {
        router.patch(route('properties.images.set-primary', [property.id, imageId]), {}, {
            onSuccess: () => {
                window.location.reload();
            }
        });
    };

    const handleDeleteClick = (imageId) => {
        setImageToDelete(imageId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (imageToDelete) {
            router.delete(route('properties.images.destroy', [property.id, imageToDelete]), {
                onSuccess: () => {
                    window.location.reload();
                }
            });
        }
        setShowDeleteModal(false);
        setImageToDelete(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setImageToDelete(null);
    };

    const openLightbox = (image, index) => {
        setSelectedImage(image);
        setLightboxIndex(index);
        setShowLightbox(true);
    };

    const closeLightbox = () => {
        setShowLightbox(false);
        setSelectedImage(null);
        setLightboxIndex(0);
    };

    const nextImage = () => {
        const allImages = property.images || [];
        const nextIndex = (lightboxIndex + 1) % allImages.length;
        setLightboxIndex(nextIndex);
        setSelectedImage(allImages[nextIndex]);
    };

    const prevImage = () => {
        const allImages = property.images || [];
        const prevIndex = lightboxIndex === 0 ? allImages.length - 1 : lightboxIndex - 1;
        setLightboxIndex(prevIndex);
        setSelectedImage(allImages[prevIndex]);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <>
            <Modal show={show} onClose={handleClose}>
                <div className="p-6 max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Zarządzanie zdjęciami - {property.name}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Upload Section */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Dodaj nowe zdjęcia
                        </h3>
                        <form onSubmit={submitUpload}>
                            <div className="mb-4">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {errors.images && (
                                    <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <PrimaryButton disabled={processing || data.images.length === 0}>
                                    {processing ? 'Dodawanie...' : 'Dodaj zdjęcia'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Gallery Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">
                                Galeria zdjęć ({totalImages})
                            </h3>
                        </div>

                        {totalImages === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <PhotoIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-500">Brak zdjęć w galerii</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {/* Primary Image */}
                                {primaryImage && (
                                    <div className="relative group col-span-2 md:col-span-2">
                                        <img
                                            src={primaryImage.url}
                                            alt={primaryImage.original_name}
                                            className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => openLightbox(primaryImage, 0)}
                                            onError={handleImageError}
                                        />
                                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                                            <StarIconSolid className="h-3 w-3 inline mr-1" />
                                            Wiodące
                                        </div>
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <DangerButton
                                                size="sm"
                                                onClick={() => handleDeleteClick(primaryImage.id)}
                                                className="p-1"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </DangerButton>
                                        </div>
                                    </div>
                                )}

                                {/* Additional Images */}
                                {additionalImages.map((image, index) => (
                                    <div key={image.id} className="relative group">
                                        <img
                                            src={image.url}
                                            alt={image.original_name}
                                            className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => openLightbox(image, index + 1)}
                                            onError={handleImageError}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAsPrimary(image.id);
                                                    }}
                                                    className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                                                    title="Ustaw jako wiodące"
                                                >
                                                    <StarIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(image.id);
                                                    }}
                                                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                                    title="Usuń zdjęcie"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Lightbox */}
            {showLightbox && selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl max-h-full p-4">
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                        >
                            <XMarkIcon className="h-8 w-8" />
                        </button>
                        
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.original_name}
                            className="max-w-full max-h-full object-contain"
                            onError={handleImageError}
                        />
                        
                        {property.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                                >
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                                >
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                        
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
                            <p className="text-sm">{selectedImage.original_name}</p>
                            <p className="text-xs text-gray-300">
                                {lightboxIndex + 1} z {property.images.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal potwierdzenia usuwania */}
            <ConfirmModal
                show={showDeleteModal}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Usuń zdjęcie"
                message="Czy na pewno chcesz usunąć to zdjęcie? Ta akcja nie może zostać cofnięta."
                confirmText="Tak, usuń"
                cancelText="Anuluj"
                type="danger"
            />
        </>
    );
}
