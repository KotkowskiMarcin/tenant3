import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon, PaperClipIcon, TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import PrimaryButton from './PrimaryButton';
import InputError from './InputError';

export default function RentalAttachmentManagementModal({ 
    isOpen, 
    onClose, 
    rental, 
    attachments = [],
    editingAttachment: propEditingAttachment = null,
    openForm = false 
}) {
    const [editingAttachment, setEditingAttachment] = useState(propEditingAttachment);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [descriptions, setDescriptions] = useState({});
    const [showAddForm, setShowAddForm] = useState(openForm);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        attachments: [],
        descriptions: {}
    });

    // Aktualizuj stan edytowanego załącznika gdy prop się zmieni
    useEffect(() => {
        setEditingAttachment(propEditingAttachment);
        if (propEditingAttachment) {
            setData('description', propEditingAttachment.description || '');
            setShowAddForm(false);
        } else {
            setShowAddForm(openForm);
        }
    }, [propEditingAttachment, openForm]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        
        // Initialize descriptions for new files
        const newDescriptions = {};
        files.forEach((file, index) => {
            newDescriptions[index] = '';
        });
        setDescriptions(newDescriptions);
        
        // Ustaw pliki w useForm
        setData('attachments', files);
        setData('descriptions', newDescriptions);
    };

    const handleDescriptionChange = (index, value) => {
        setDescriptions(prev => ({
            ...prev,
            [index]: value
        }));
        
        // Aktualizuj również w useForm
        setData(`descriptions.${index}`, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (selectedFiles.length === 0) {
            return;
        }

        post(route('rentals.attachments.store', rental.id), {
            onSuccess: () => {
                setSelectedFiles([]);
                setDescriptions({});
                setShowAddForm(false);
                reset();
            }
        });
    };

    // handleEdit jest teraz obsługiwane przez parent component

    const handleUpdate = (e) => {
        e.preventDefault();
        
        put(route('rentals.attachments.update', [rental.id, editingAttachment.id]), {
            onSuccess: () => {
                setEditingAttachment(null);
                reset();
            }
        });
    };

    const handleDelete = (attachment) => {
        if (confirm('Czy na pewno chcesz usunąć ten załącznik?')) {
            destroy(route('rentals.attachments.destroy', [rental.id, attachment.id]));
        }
    };

    const handleDownload = (attachment) => {
        window.open(route('rentals.attachments.download', [rental.id, attachment.id]), '_blank');
    };

    const formatFileSize = (sizeInKB) => {
        if (sizeInKB < 1024) {
            return `${sizeInKB} KB`;
        }
        return `${(sizeInKB / 1024).toFixed(1)} MB`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pl-PL');
    };

    return (
        <Transition show={isOpen}>
            <Dialog onClose={onClose} className="relative z-50">
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <TransitionChild
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Zamknij</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                <div className="sm:flex sm:items-start">
                                    <div className="w-full">
                                        <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                            {editingAttachment ? 'Edytuj załącznik' : 'Zarządzanie załącznikami'} - {rental.property?.name}
                                        </DialogTitle>

                                        {/* Lista załączników - tylko gdy nie edytujemy */}
                                        {!editingAttachment && (
                                            <div className="mb-6">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="text-md font-medium text-gray-900">Załączniki</h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAddForm(!showAddForm)}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        <PlusIcon className="w-4 h-4 mr-2" />
                                                        Dodaj załączniki
                                                    </button>
                                                </div>

                                            {attachments.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Brak załączników</h3>
                                                    <p className="mt-1 text-sm text-gray-500">Dodaj pierwsze załączniki do tego najmu.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {attachments.map((attachment) => (
                                                        <div key={attachment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                            <div className="flex items-center space-x-3">
                                                                <PaperClipIcon className="h-5 w-5 text-gray-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {attachment.original_name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {formatFileSize(attachment.file_size)} • {formatDate(attachment.created_at)}
                                                                    </p>
                                                                    {attachment.description && (
                                                                        <p className="text-xs text-gray-600 mt-1">
                                                                            {attachment.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => handleDownload(attachment)}
                                                                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                                                >
                                                                    Pobierz
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(attachment)}
                                                                    className="text-red-400 hover:text-red-600"
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            </div>
                                        )}

                                        {/* Formularz dodawania załączników - tylko gdy nie edytujemy */}
                                        {!editingAttachment && showAddForm && (
                                            <div className="border-t pt-6">
                                                <h4 className="text-md font-medium text-gray-900 mb-4">Dodaj nowe załączniki</h4>
                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Wybierz pliki
                                                        </label>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            onChange={handleFileSelect}
                                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                                                        />
                                                        <InputError message={errors.attachments} className="mt-2" />
                                                    </div>

                                                    {selectedFiles.length > 0 && (
                                                        <div className="space-y-3">
                                                            <h5 className="text-sm font-medium text-gray-700">Opisy plików (opcjonalne)</h5>
                                                            {selectedFiles.map((file, index) => (
                                                                <div key={index}>
                                                                    <label className="block text-xs text-gray-600 mb-1">
                                                                        {file.name}
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={descriptions[index] || ''}
                                                                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                                        placeholder="Opis pliku..."
                                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                    />
                                                                    <InputError message={errors[`descriptions.${index}`]} className="mt-1" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex justify-end space-x-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowAddForm(false);
                                                                setSelectedFiles([]);
                                                                setDescriptions({});
                                                                reset();
                                                            }}
                                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        >
                                                            Anuluj
                                                        </button>
                                                        <PrimaryButton disabled={processing || selectedFiles.length === 0}>
                                                            {processing ? 'Dodawanie...' : 'Dodaj załączniki'}
                                                        </PrimaryButton>
                                                    </div>
                                                </form>
                                            </div>
                                        )}

                                        {/* Modal edycji opisu */}
                                        {editingAttachment && (
                                            <div className="border-t pt-6">
                                                <h4 className="text-md font-medium text-gray-900 mb-4">
                                                    Edytuj opis załącznika: {editingAttachment.original_name}
                                                </h4>
                                                <form onSubmit={handleUpdate} className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Opis
                                                        </label>
                                                        <textarea
                                                            value={data.description}
                                                            onChange={(e) => setData('description', e.target.value)}
                                                            rows={3}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                            placeholder="Opis załącznika..."
                                                        />
                                                        <InputError message={errors.description} className="mt-2" />
                                                    </div>

                                                    <div className="flex justify-end space-x-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingAttachment(null);
                                                                reset();
                                                            }}
                                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        >
                                                            Anuluj
                                                        </button>
                                                        <PrimaryButton disabled={processing}>
                                                            {processing ? 'Zapisywanie...' : 'Zapisz'}
                                                        </PrimaryButton>
                                                    </div>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
