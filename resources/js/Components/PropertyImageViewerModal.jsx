import React, { useState, useEffect } from 'react';
import { 
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function PropertyImageViewerModal({ 
    show, 
    onClose, 
    property 
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = property.images || [];

    // Reset index when modal opens
    useEffect(() => {
        if (show) {
            setCurrentIndex(0);
        }
    }, [show]);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const selectImage = (index) => {
        setCurrentIndex(index);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'Escape') onClose();
    };

    // Add keyboard event listener
    useEffect(() => {
        if (show) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [show, currentIndex]);

    if (!show || images.length === 0) return null;

    const currentImage = images[currentIndex];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="relative w-full h-full max-w-6xl max-h-full p-4 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white text-xl font-semibold">
                        {property.name} - Zdjęcie {currentIndex + 1} z {images.length}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        <XMarkIcon className="h-8 w-8" />
                    </button>
                </div>

                {/* Main Image Container */}
                <div className="flex-1 flex items-center justify-center relative" style={{ maxHeight: '80vh' }}>
                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
                            >
                                <ChevronLeftIcon className="h-12 w-12" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
                            >
                                <ChevronRightIcon className="h-12 w-12" />
                            </button>
                        </>
                    )}

                    {/* Main Image */}
                    <div className="max-w-full max-h-full flex items-center justify-center">
                        <img
                            src={`/storage/${currentImage.file_path}`}
                            alt={currentImage.original_name}
                            className="max-w-full max-h-full object-contain rounded-lg"
                            style={{ maxHeight: '80vh' }}
                        />
                    </div>
                </div>

                {/* Image Carousel */}
                {images.length > 1 && (
                    <div className="mt-6">
                        <div className="flex justify-center">
                            <div className="flex space-x-2 overflow-x-auto max-w-full pb-2">
                                {images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => selectImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                            index === currentIndex 
                                                ? 'border-white shadow-lg' 
                                                : 'border-gray-600 hover:border-gray-400'
                                        }`}
                                    >
                                        <img
                                            src={`/storage/${image.file_path}`}
                                            alt={image.original_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Info */}
                <div className="mt-4 text-center text-white">
                    <p className="text-sm text-gray-300">{currentImage.original_name}</p>
                    {currentImage.is_primary && (
                        <p className="text-xs text-yellow-400 mt-1">Zdjęcie wiodące</p>
                    )}
                </div>
            </div>
        </div>
    );
}
