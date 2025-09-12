import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon, PaperClipIcon, TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import PrimaryButton from './PrimaryButton';
import InputError from './InputError';

export default function PropertyAttachmentManagementModal({ 
    isOpen, 
    onClose, 
    property, 
    attachments = [],
    openForm = false 
}) {
    const [editingAttachment, setEditingAttachment] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [descriptions, setDescriptions] = useState({});
    const [showAddForm, setShowAddForm] = useState(openForm);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        attachments: [],
        descriptions: {}
    });

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

        // Ustaw pliki w useForm
        setData('attachments', selectedFiles);
        setData('descriptions', descriptions);

        post(route('properties.attachments.store', property.id), {
            forceFormData: true,
            onSuccess: () => {
                setSelectedFiles([]);
                setDescriptions({});
                reset();
                setShowAddForm(false);
            },
            onError: (errors) => {
                console.error('Błąd podczas dodawania załączników:', errors);
            }
        });
    };

    const handleEdit = (attachment) => {
        setEditingAttachment(attachment);
        setData('description', attachment.description || '');
    };

    const handleUpdateDescription = (e) => {
        e.preventDefault();
        
        patch(route('properties.attachments.update', [property.id, editingAttachment.id]), {
            onSuccess: () => {
                setEditingAttachment(null);
                reset();
            }
        });
    };

    const handleDelete = (attachment) => {
        if (confirm('Czy na pewno chcesz usunąć ten załącznik?')) {
            router.delete(route('properties.attachments.destroy', [property.id, attachment.id]));
        }
    };

    const handleDownload = (attachment) => {
        window.open(route('properties.attachments.download', [property.id, attachment.id]), '_blank');
    };

    const formatFileSize = (sizeInKB) => {
        if (sizeInKB < 1024) {
            return `${sizeInKB} KB`;
        }
        return `${(sizeInKB / 1024).toFixed(1)} MB`;
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        const iconClasses = "w-8 h-8 text-gray-400";
        
        switch (extension) {
            case 'pdf':
                return <div className={`${iconClasses} bg-red-100 rounded flex items-center justify-center`}>PDF</div>;
            case 'doc':
            case 'docx':
                return <div className={`${iconClasses} bg-blue-100 rounded flex items-center justify-center`}>DOC</div>;
            case 'xls':
            case 'xlsx':
                return <div className={`${iconClasses} bg-green-100 rounded flex items-center justify-center`}>XLS</div>;
            case 'txt':
                return <div className={`${iconClasses} bg-gray-100 rounded flex items-center justify-center`}>TXT</div>;
            default:
                return <PaperClipIcon className={iconClasses} />;
        }
    };

    return (
        <>
            <Transition show={isOpen}>
                <Dialog className="relative z-50" onClose={onClose}>
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
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                            <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-6">
                                                Zarządzanie załącznikami
                                            </DialogTitle>

                                            {/* Existing Attachments */}
                                            <div className="mb-6">
                                                <h4 className="text-md font-medium text-gray-900 mb-3">Istniejące załączniki</h4>
                                                {attachments.length === 0 ? (
                                                    <p className="text-gray-500 text-sm">Brak załączników</p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {attachments.map((attachment) => (
                                                            <div key={attachment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                                                <div className="flex items-center space-x-3">
                                                                    {getFileIcon(attachment.original_name)}
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900">{attachment.original_name}</p>
                                                                        <p className="text-xs text-gray-500">{formatFileSize(attachment.file_size)}</p>
                                                                        {attachment.description && (
                                                                            <p className="text-xs text-gray-600 mt-1">{attachment.description}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <button
                                                                        onClick={() => handleDownload(attachment)}
                                                                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                                    >
                                                                        Pobierz
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEdit(attachment)}
                                                                        className="text-gray-400 hover:text-gray-600"
                                                                    >
                                                                        <PencilIcon className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(attachment)}
                                                                        className="text-red-400 hover:text-red-600"
                                                                    >
                                                                        <TrashIcon className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Add New Attachments */}
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4 className="text-md font-medium text-gray-900">Dodaj nowe załączniki</h4>
                                                    {!showAddForm && (
                                                        <button
                                                            onClick={() => setShowAddForm(true)}
                                                            className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center"
                                                        >
                                                            <PlusIcon className="w-4 h-4 mr-1" />
                                                            Dodaj nowe
                                                        </button>
                                                    )}
                                                </div>
                                                {showAddForm && (
                                                    <form onSubmit={handleSubmit} className="space-y-4">
                                                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]').getAttribute('content')} />
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Wybierz pliki
                                                        </label>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            onChange={handleFileSelect}
                                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                            accept="*/*"
                                                        />
                                                        <InputError message={errors.attachments} className="mt-2" />
                                                    </div>

                                                    {data.attachments && data.attachments.length > 0 && (
                                                        <div className="space-y-3">
                                                            <h5 className="text-sm font-medium text-gray-700">Opisy załączników</h5>
                                                            {data.attachments.map((file, index) => (
                                                                <div key={index} className="flex items-center space-x-3">
                                                                    <div className="flex-1">
                                                                        <p className="text-sm text-gray-900">{file.name}</p>
                                                                        <p className="text-xs text-gray-500">{formatFileSize(Math.round(file.size / 1024))}</p>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Opcjonalny opis..."
                                                                            value={data.descriptions?.[index] || ''}
                                                                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex justify-end space-x-3">
                                                        <button
                                                            type="button"
                                                            onClick={onClose}
                                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        >
                                                            Anuluj
                                                        </button>
                                                        <PrimaryButton
                                                            type="submit"
                                                            disabled={processing || !data.attachments || data.attachments.length === 0}
                                                        >
                                                            {processing ? 'Dodawanie...' : 'Dodaj załączniki'}
                                                        </PrimaryButton>
                                                    </div>
                                                </form>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Edit Description Modal */}
            {editingAttachment && (
                <Transition show={!!editingAttachment}>
                    <Dialog className="relative z-50" onClose={() => setEditingAttachment(null)}>
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
                                    <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                            <button
                                                type="button"
                                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={() => setEditingAttachment(null)}
                                            >
                                                <XMarkIcon className="h-6 w-6" />
                                            </button>
                                        </div>

                                        <div className="sm:flex sm:items-start">
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                                <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                                                    Edytuj opis załącznika
                                                </DialogTitle>

                                                <form onSubmit={handleUpdateDescription} className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Opis załącznika
                                                        </label>
                                                        <textarea
                                                            value={data.description}
                                                            onChange={(e) => setData('description', e.target.value)}
                                                            rows={3}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                            placeholder="Wprowadź opis załącznika..."
                                                        />
                                                        <InputError message={errors.description} className="mt-2" />
                                                    </div>

                                                    <div className="flex justify-end space-x-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingAttachment(null)}
                                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        >
                                                            Anuluj
                                                        </button>
                                                        <PrimaryButton
                                                            type="submit"
                                                            disabled={processing}
                                                        >
                                                            {processing ? 'Zapisywanie...' : 'Zapisz'}
                                                        </PrimaryButton>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </DialogPanel>
                                </TransitionChild>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            )}
        </>
    );
}
