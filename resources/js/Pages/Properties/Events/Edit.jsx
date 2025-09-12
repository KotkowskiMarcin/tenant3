import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeftIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function Edit({ property, event }) {
    const { data, setData, put, processing, errors } = useForm({
        title: event.title,
        description: event.description || '',
        event_date: event.event_date ? event.event_date.split(' ')[0] : '',
        event_time: event.event_date ? event.event_date.split(' ')[1]?.substring(0, 5) : '',
        notes: event.notes || '',
        attachment: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('properties.events.update', { property: property.id, event: event.id }));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edytuj zdarzenie - ${property.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex items-center mb-6">
                                <Link
                                    href={route('properties.show', property.id)}
                                    className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ArrowLeftIcon className="w-5 h-5" />
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Edytuj zdarzenie</h1>
                                    <p className="text-sm text-gray-600">{property.name}</p>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Tytuł */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                            Tytuł zdarzenia *
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Wprowadź tytuł zdarzenia"
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                        )}
                                    </div>

                                    {/* Data */}
                                    <div>
                                        <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-2">
                                            Data zdarzenia *
                                        </label>
                                        <input
                                            type="date"
                                            id="event_date"
                                            value={data.event_date}
                                            onChange={(e) => setData('event_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {errors.event_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.event_date}</p>
                                        )}
                                    </div>

                                    {/* Godzina */}
                                    <div>
                                        <label htmlFor="event_time" className="block text-sm font-medium text-gray-700 mb-2">
                                            Godzina zdarzenia
                                        </label>
                                        <input
                                            type="time"
                                            id="event_time"
                                            value={data.event_time}
                                            onChange={(e) => setData('event_time', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {errors.event_time && (
                                            <p className="mt-1 text-sm text-red-600">{errors.event_time}</p>
                                        )}
                                    </div>

                                    {/* Opis */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                            Opis zdarzenia
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={4}
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
                                    <div className="md:col-span-2">
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                            Uwagi
                                        </label>
                                        <textarea
                                            id="notes"
                                            rows={3}
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
                                    <div className="md:col-span-2">
                                        <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-2">
                                            Załącznik
                                        </label>
                                        <input
                                            type="file"
                                            id="attachment"
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
                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                    <Link
                                        href={route('properties.show', property.id)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Anuluj
                                    </Link>
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
