import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { CalendarDaysIcon, ClockIcon, DocumentTextIcon, PaperClipIcon, PencilIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import PropertyEventEditModal from './PropertyEventEditModal';

export default function PropertyEventTimeline({ events, propertyId, property }) {
    const [expandedEvents, setExpandedEvents] = useState(new Set());
    const [editingEvent, setEditingEvent] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const toggleEventDetails = (eventId) => {
        const newExpanded = new Set(expandedEvents);
        if (newExpanded.has(eventId)) {
            newExpanded.delete(eventId);
        } else {
            newExpanded.add(eventId);
        }
        setExpandedEvents(newExpanded);
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingEvent(null);
    };

    if (!events || events.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center text-gray-500">
                    <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p>Brak zdarzeń dla tej nieruchomości</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                    Zdarzenia ({events.length})
                </h3>
            </div>
            
            <div className="p-6">
                <div className="flow-root">
                    <ul className="-mb-8">
                        {events.map((event, eventIdx) => {
                            const isExpanded = expandedEvents.has(event.id);
                            return (
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
                                            <div className="min-w-0 flex-1 pt-1.5">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        {/* Data i godzina nad tytułem */}
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <p className="text-sm text-gray-500">
                                                                {event.timeline_date}
                                                            </p>
                                                            {event.timeline_time && (
                                                                <div className="flex items-center text-xs text-gray-500">
                                                                    <ClockIcon className="h-3 w-3 mr-1" />
                                                                    {event.timeline_time}
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Tytuł zdarzenia */}
                                                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                                                            {event.title}
                                                        </h4>

                                                        {/* Szczegóły - schowane domyślnie */}
                                                        {isExpanded && (
                                                            <div className="mt-3 space-y-3">
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
                                                    
                                                    {/* Przyciski akcji */}
                                                    <div className="flex items-center space-x-2 ml-4">
                                                        <button
                                                            onClick={() => toggleEventDetails(event.id)}
                                                            className="text-gray-500 hover:text-gray-700 p-1 flex items-center space-x-1"
                                                            title={isExpanded ? "Ukryj szczegóły" : "Pokaż szczegóły"}
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronUpIcon className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronDownIcon className="h-4 w-4" />
                                                            )}
                                                            <span className="text-xs">
                                                                {isExpanded ? "Ukryj szczegóły" : "Pokaż szczegóły"}
                                                            </span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditEvent(event)}
                                                            className="text-blue-600 hover:text-blue-800 p-1"
                                                            title="Edytuj zdarzenie"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {/* Modal edycji zdarzenia */}
            {showEditModal && editingEvent && (
                <PropertyEventEditModal
                    isOpen={showEditModal}
                    onClose={handleCloseEditModal}
                    property={property}
                    event={editingEvent}
                />
            )}
        </div>
    );
}
