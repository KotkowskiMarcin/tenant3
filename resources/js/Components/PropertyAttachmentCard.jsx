import { PaperClipIcon, DocumentIcon, ArrowDownTrayIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function PropertyAttachmentCard({ 
    attachments = [], 
    onEdit, 
    onDelete, 
    onDownload,
    onAddNew 
}) {
    const formatFileSize = (sizeInKB) => {
        if (sizeInKB < 1024) {
            return `${sizeInKB} KB`;
        }
        return `${(sizeInKB / 1024).toFixed(1)} MB`;
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        
        switch (extension) {
            case 'pdf':
                return (
                    <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                        <span className="text-red-600 font-bold text-xs">PDF</span>
                    </div>
                );
            case 'doc':
            case 'docx':
                return (
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs">DOC</span>
                    </div>
                );
            case 'xls':
            case 'xlsx':
                return (
                    <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                        <span className="text-green-600 font-bold text-xs">XLS</span>
                    </div>
                );
            case 'txt':
                return (
                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-600 font-bold text-xs">TXT</span>
                    </div>
                );
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp':
                return (
                    <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-xs">IMG</span>
                    </div>
                );
            default:
                return (
                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                        <DocumentIcon className="w-4 h-4 text-gray-600" />
                    </div>
                );
        }
    };

    const handleDownload = (attachment) => {
        if (onDownload) {
            onDownload(attachment);
        } else {
            window.open(route('properties.attachments.download', [attachment.property_id, attachment.id]), '_blank');
        }
    };

    if (attachments.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                    <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Brak załączników</h3>
                    <p className="mt-1 text-sm text-gray-500">Ta nieruchomość nie ma jeszcze żadnych załączników.</p>
                    {onAddNew && (
                        <button
                            onClick={onAddNew}
                            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center mx-auto"
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Dodaj pierwszy załącznik
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <PaperClipIcon className="w-5 h-5 mr-2" />
                        Załączniki ({attachments.length})
                    </h3>
                    <div className="flex items-center space-x-2">
                        {onAddNew && (
                            <button
                                onClick={onAddNew}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center"
                            >
                                <PlusIcon className="w-4 h-4 mr-1" />
                                Dodaj
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Plik
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Akcje
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {attachments.map((attachment) => (
                            <tr 
                                key={attachment.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mr-3">
                                            {getFileIcon(attachment.original_name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-900">
                                                {attachment.original_name}
                                            </div>
                                            {attachment.description && (
                                                <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                    {attachment.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => handleDownload(attachment)}
                                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                            title="Pobierz plik"
                                        >
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                        </button>
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(attachment)}
                                                className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                                                title="Edytuj załącznik"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(attachment)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                title="Usuń załącznik"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
