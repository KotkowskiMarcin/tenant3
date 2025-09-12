import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { XMarkIcon, PaperClipIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';

export default function PropertyEventEditModal({ isOpen, onClose, property, event }) {
    // Initialize form data based on event
    const getInitialData = () => {
        if (event && event.event_date) {
            const eventDate = new Date(event.event_date);
            const dateStr = eventDate.toISOString().split('T')[0];
            const timeStr = eventDate.toTimeString().split(' ')[0].substring(0, 5);
            
            return {
                title: event.title || '',
                description: event.description || '',
                event_date: dateStr,
                event_time: timeStr,
                notes: event.notes || '',
                attachment: null,
                remove_attachment: false,
            };
        }
        
        return {
            title: '',
            description: '',
            event_date: '',
            event_time: '',
            notes: '',
            attachment: null,
            remove_attachment: false,
        };
    };

    const { data, setData, patch, post, processing, errors, reset, clearErrors } = useForm(getInitialData());

    // Update form data when event changes
    useEffect(() => {
        if (event && isOpen) {
            const newData = getInitialData();
            clearErrors();
            reset();
            setData(newData);
        }
    }, [event, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Use forceFormData only when we have a file or need to remove attachment
        const hasFile = data.attachment !== null;
        const needsFormData = hasFile || data.remove_attachment;
        
        const submitOptions = {
            onSuccess: () => {
                reset();
                onClose();
            }
        };
        
        if (needsFormData) {
            submitOptions.forceFormData = true;
        }
        
        // Use POST with _method field for file uploads
        const submitData = needsFormData ? {
            ...data,
            _method: 'patch'
        } : data;
        
        if (needsFormData) {
            post(route('properties.events.update', { property: property.id, event: event.id }), {
                ...submitOptions,
                data: submitData
            });
        } else {
            patch(route('properties.events.update', { property: property.id, event: event.id }), submitOptions);
        }
    };

    const handleClose = () => {
        reset();
        setData({
            title: '',
            description: '',
            event_date: '',
            event_time: '',
            notes: '',
            attachment: null,
            remove_attachment: false,
        });
        onClose();
    };

    const handleRemoveAttachment = () => {
        if (confirm('Czy na pewno chcesz usunąć załącznik?')) {
            setData('remove_attachment', true);
            setData('attachment', null);
        }
    };

    return (
        <Modal show={isOpen} onClose={handleClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Edytuj zdarzenie
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6" noValidate>
                    <div className="space-y-6">
                        {/* Tytuł */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Tytuł zdarzenia *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Wprowadź tytuł zdarzenia"
                                required
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>

                        {/* Data i godzina */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Data zdarzenia *
                                </label>
                                <input
                                    type="date"
                                    id="event_date"
                                    name="event_date"
                                    value={data.event_date}
                                    onChange={(e) => setData('event_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                                {errors.event_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.event_date}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="event_time" className="block text-sm font-medium text-gray-700 mb-2">
                                    Godzina zdarzenia
                                </label>
                                <input
                                    type="time"
                                    id="event_time"
                                    name="event_time"
                                    value={data.event_time}
                                    onChange={(e) => setData('event_time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.event_time && (
                                    <p className="mt-1 text-sm text-red-600">{errors.event_time}</p>
                                )}
                            </div>
                        </div>

                        {/* Opis */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Opis zdarzenia
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Wprowadź opis zdarzenia"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        {/* Uwagi */}
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                Uwagi
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={2}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Dodatkowe uwagi do zdarzenia"
                            />
                            {errors.notes && (
                                <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                            )}
                        </div>

                        {/* Załącznik */}
                        <div>
                            <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-2">
                                Załącznik
                            </label>
                            
                            {/* Istniejący załącznik */}
                            {event?.attachment_path && !data.remove_attachment && (
                                <div className="mb-3 p-3 bg-gray-50 rounded-md border">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <PaperClipIcon className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-700">
                                                {event.attachment_original_name || event.attachment_display_name}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveAttachment}
                                            className="text-red-600 hover:text-red-800 flex items-center text-sm"
                                        >
                                            <TrashIcon className="h-4 w-4 mr-1" />
                                            Usuń
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Nowy załącznik */}
                            <input
                                type="file"
                                id="attachment"
                                name="attachment"
                                onChange={(e) => setData('attachment', e.target.files[0])}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Maksymalny rozmiar pliku: 10MB. Obsługiwane formaty: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, GIF
                            </p>
                            {errors.attachment && (
                                <p className="mt-1 text-sm text-red-600">{errors.attachment}</p>
                            )}
                        </div>
                    </div>

                    {/* Przyciski */}
                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {processing ? 'Zapisywanie...' : 'Zapisz zmiany'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
