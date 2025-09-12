import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import PrimaryButton from './PrimaryButton';
import InputError from './InputError';

export default function PropertyAttachmentEditModal({ 
    isOpen, 
    onClose, 
    attachment 
}) {
    const { data, setData, patch, processing, errors, reset, clearErrors } = useForm({
        description: ''
    });

    useEffect(() => {
        if (attachment && isOpen) {
            clearErrors();
            reset();
            setData('description', attachment.description || '');
        }
    }, [attachment, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        patch(route('properties.attachments.update', [attachment.property_id, attachment.id]), {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const handleClose = () => {
        clearErrors();
        reset();
        onClose();
    };

    if (!attachment) return null;

    return (
        <Transition show={isOpen}>
            <Dialog className="relative z-50" onClose={handleClose}>
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
                                        onClick={handleClose}
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                        <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-4 flex items-center">
                                            <PencilIcon className="w-5 h-5 mr-2" />
                                            Edytuj załącznik
                                        </DialogTitle>

                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-medium text-gray-900">{attachment.original_name}</p>
                                            <p className="text-xs text-gray-500">
                                                {attachment.file_size < 1024 
                                                    ? `${attachment.file_size} KB` 
                                                    : `${(attachment.file_size / 1024).toFixed(1)} MB`
                                                }
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                                    onClick={handleClose}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                >
                                                    Anuluj
                                                </button>
                                                <PrimaryButton
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    {processing ? 'Zapisywanie...' : 'Zapisz zmiany'}
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
    );
}
