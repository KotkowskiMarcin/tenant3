import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ user, auth }) {
    const getRoleBadgeColor = (role) => {
        return role === 'admin' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Szczegóły Użytkownika: {user.name}
                    </h2>
                    <div className="flex space-x-2">
                        <Link
                            href={route('users.edit', user.id)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Edytuj
                        </Link>
                        <Link
                            href={route('users.index')}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Powrót do listy
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Użytkownik: ${user.name}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Avatar i podstawowe info */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 h-20 w-20">
                                        <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-2xl font-medium text-gray-700">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {user.name}
                                        </h3>
                                        <p className="text-lg text-gray-600">
                                            {user.email}
                                        </p>
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                            {user.role === 'admin' ? 'Administrator' : 'Użytkownik'}
                                        </span>
                                    </div>
                                </div>

                                {/* Szczegóły */}
                                <div className="border-t pt-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                        Szczegóły Konta
                                    </h4>
                                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                ID Użytkownika
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                #{user.id}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Rola
                                            </dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Data utworzenia
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(user.created_at).toLocaleDateString('pl-PL', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Ostatnia aktualizacja
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(user.updated_at).toLocaleDateString('pl-PL', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Email zweryfikowany
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {user.email_verified_at ? (
                                                    <span className="text-green-600 font-medium">
                                                        ✓ Tak
                                                    </span>
                                                ) : (
                                                    <span className="text-red-600 font-medium">
                                                        ✗ Nie
                                                    </span>
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Status konta
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                <span className="text-green-600 font-medium">
                                                    ✓ Aktywne
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Akcje */}
                                <div className="border-t pt-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                        Akcje
                                    </h4>
                                    <div className="flex space-x-4">
                                        <Link
                                            href={route('users.edit', user.id)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Edytuj Użytkownika
                                        </Link>
                                        {user.id !== auth.user.id && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
                                                        router.delete(route('users.destroy', user.id));
                                                    }
                                                }}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Usuń Użytkownika
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
