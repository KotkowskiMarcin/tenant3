import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { XMarkIcon, PlusIcon, PencilIcon, TrashIcon, PaperClipIcon, CalendarDaysIcon, ClockIcon, DocumentTextIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';

export default function PropertyEventManagementModal({ isOpen, onClose, propertyId, events = [], openForm = false }) {
    const [editingEvent, setEditingEvent] = useState(null);
    const [showForm, setShowForm] = useState(openForm);
    const [expandedEvents, setExpandedEvents] = useState(new Set());

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        description: '',
        event_date: new Date().toISOString().split('T')[0], // Domyślna aktualna data
        event_time: '',
        notes: '',
        attachment: null,
    });

    // Automatycznie otwórz formularz dodawania gdy openForm jest true
    useEffect(() => {
        if (isOpen && openForm) {
            handleAddNew();
        }
    }, [isOpen, openForm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Prepare base data object
        const baseData = {
            title: data.title || '',
            description: data.description || '',
            event_date: data.event_date || '',
            event_time: data.event_time || '',
            notes: data.notes || '',
        };

        // If we have an attachment, we need to use FormData
        if (data.attachment) {
            const formData = new FormData();
            Object.keys(baseData).forEach(key => {
                formData.append(key, baseData[key]);
            });
            formData.append('attachment', data.attachment);

            if (editingEvent) {
                // For updates with files, we need to use POST with _method override
                formData.append('_method', 'PATCH');
                post(route('properties.events.update', { property: propertyId, event: editingEvent.id }), {
                    data: formData,
                    forceFormData: true,
                    onSuccess: () => {
                        reset();
                        setEditingEvent(null);
                        setShowForm(false);
                    }
                });
            } else {
                post(route('properties.events.store', propertyId), {
                    data: formData,
                    forceFormData: true,
                    onSuccess: () => {
                        reset();
                        setShowForm(false);
                    }
                });
            }
        } else {
            // No attachment, send as regular object
            if (editingEvent) {
                patch(route('properties.events.update', { property: propertyId, event: editingEvent.id }), {
                    data: baseData,
                    onSuccess: () => {
                        reset();
                        setEditingEvent(null);
                        setShowForm(false);
                    }
                });
            } else {
                post(route('properties.events.store', propertyId), {
                    data: baseData,
                    onSuccess: () => {
                        reset();
                        setShowForm(false);
                    }
                });
            }
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        
        // Parse the event date properly
        const eventDate = new Date(event.event_date);
        const eventDateString = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        const eventTimeString = eventDate.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
        
        setData({
            title: event.title || '',
            description: event.description || '',
            event_date: eventDateString,
            event_time: eventTimeString === '12:00' ? '' : eventTimeString, // Don't show 12:00 as default time
            notes: event.notes || '',
            attachment: null,
        });
        setShowForm(true);
    };

    const handleDelete = (eventId) => {
        if (confirm('Czy na pewno chcesz usunąć to zdarzenie?')) {
            destroy(route('properties.events.destroy', { property: propertyId, event: eventId }));
        }
    };

    const handleAddNew = () => {
        setEditingEvent(null);
        reset();
        // Ustaw domyślną aktualną datę przy dodawaniu nowego zdarzenia
        const today = new Date().toISOString().split('T')[0];
        setData({
            title: '',
            description: '',
            event_date: today,
            event_time: '',
            notes: '',
            attachment: null,
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingEvent(null);
        reset();
    };

    const handleFileChange = (e) => {
        setData('attachment', e.target.files[0]);
    };

    const toggleEventDetails = (eventId) => {
        const newExpanded = new Set(expandedEvents);
        if (newExpanded.has(eventId)) {
            newExpanded.delete(eventId);
        } else {
            newExpanded.add(eventId);
        }
        setExpandedEvents(newExpanded);
    };

    const handleModalClose = () => {
        setShowForm(false);
        setEditingEvent(null);
        setExpandedEvents(new Set());
        reset();
        onClose();
    };

    return (
        <Modal show={isOpen} onClose={handleModalClose} maxWidth="2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                    Zarządzanie zdarzeniami
                </h3>
                <button
                    onClick={handleModalClose}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            <div className="p-6">
                {!showForm ? (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-md font-medium text-gray-900">
                                Lista zdarzeń ({events.length})
                            </h4>
                            <button
                                onClick={handleAddNew}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Dodaj zdarzenie
                            </button>
                        </div>

                        {events.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>Brak zdarzeń</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Timeline zdarzeń */}
                                <div className="flow-root">
                                    <ul className="-mb-8">
                                        {events.map((event, eventIdx) => (
                                            <li key={event.id}>
                                                <div className="relative pb-8">
                                                    {eventIdx !== events.length - 1 ? (
                                                        <span
                                                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                            aria-hidden="true"
                                                        />
                                                    ) : null}
                                                    <div className="relative flex space-x-3">
                                                        <div>
                                                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                                <CalendarDaysIcon className="h-4 w-4 text-white" />
                                                            </span>
                                                        </div>
                                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <h4 className="text-sm font-medium text-gray-900">
                                                                        {event.title}
                                                                    </h4>
                                                                    {event.timeline_time && (
                                                                        <div className="flex items-center text-xs text-gray-500">
                                                                            <ClockIcon className="h-3 w-3 mr-1" />
                                                                            {event.timeline_time}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    {event.timeline_date}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    Utworzone: {new Date(event.created_at).toLocaleDateString('pl-PL')} {new Date(event.created_at).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                                
                                                                {/* Collapse section for details */}
                                                                <div className="mt-2">
                                                                    <button
                                                                        onClick={() => toggleEventDetails(event.id)}
                                                                        className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        {expandedEvents.has(event.id) ? (
                                                                            <>
                                                                                <ChevronUpIcon className="h-3 w-3 mr-1" />
                                                                                Ukryj szczegóły
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <ChevronDownIcon className="h-3 w-3 mr-1" />
                                                                                Pokaż szczegóły
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                    
                                                                    {expandedEvents.has(event.id) && (
                                                                        <div className="mt-2 space-y-2">
                                                                            {event.description && (
                                                                                <p className="text-sm text-gray-900">
                                                                                    {event.description}
                                                                                </p>
                                                                            )}
                                                                            {event.notes && (
                                                                                <div className="flex items-start">
                                                                                    <DocumentTextIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                                                                    <p className="text-sm text-gray-600">{event.notes}</p>
                                                                                </div>
                                                                            )}
                                                                            {event.has_attachment && (
                                                                                <div className="flex items-center">
                                                                                    <PaperClipIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                                                    <button
                                                                                        onClick={() => window.open(route('properties.events.download', { property: propertyId, event: event.id }), '_blank')}
                                                                                        className="text-sm text-blue-600 hover:text-blue-500 underline"
                                                                                    >
                                                                                        {event.attachment_display_name}
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleEdit(event)}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <PencilIcon className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(event.id)}
                                                                    className="text-red-600 hover:text-red-800"
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tytuł *
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Opis
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Data *
                                </label>
                                <input
                                    type="date"
                                    value={data.event_date}
                                    onChange={(e) => setData('event_date', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.event_date && <p className="mt-1 text-sm text-red-600">{errors.event_date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Godzina
                                </label>
                                <input
                                    type="time"
                                    value={data.event_time}
                                    onChange={(e) => setData('event_time', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.event_time && <p className="mt-1 text-sm text-red-600">{errors.event_time}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Uwagi
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={2}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Załącznik
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.attachment && <p className="mt-1 text-sm text-red-600">{errors.attachment}</p>}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Anuluj
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {editingEvent ? 'Zaktualizuj' : 'Dodaj'} zdarzenie
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}