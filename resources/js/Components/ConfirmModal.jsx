import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export default function ConfirmModal({ 
    show, 
    onClose, 
    onConfirm, 
    title = "Potwierdź akcję",
    message = "Czy na pewno chcesz wykonać tę akcję?",
    confirmText = "Tak, usuń",
    cancelText = "Anuluj",
    type = "danger" // danger, warning, info
}) {
    const getButtonStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    confirm: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    icon: 'text-red-600'
                };
            case 'warning':
                return {
                    confirm: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
                    icon: 'text-yellow-600'
                };
            case 'info':
                return {
                    confirm: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                    icon: 'text-blue-600'
                };
            default:
                return {
                    confirm: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    icon: 'text-red-600'
                };
        }
    };

    const buttonStyles = getButtonStyles();

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className={`flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full ${buttonStyles.icon.replace('text-', 'bg-').replace('-600', '-100')}`}>
                            {type === 'danger' && (
                                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            )}
                            {type === 'warning' && (
                                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            )}
                            {type === 'info' && (
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                        <h3 className="ml-3 text-lg font-medium text-gray-900">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-500">
                        {message}
                    </p>
                </div>

                <div className="flex justify-end space-x-3">
                    <SecondaryButton onClick={onClose}>
                        {cancelText}
                    </SecondaryButton>
                    <button
                        onClick={onConfirm}
                        className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonStyles.confirm}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
