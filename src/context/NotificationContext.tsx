import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationPayload {
    title?: string;
    message: string;
    type?: NotificationType;
}

interface NotificationState extends Required<NotificationPayload> {
    isOpen: boolean;
}

interface NotificationContextType {
    showNotification: (payload: NotificationPayload) => void;
    closeNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const DEFAULT_TITLE: Record<NotificationType, string> = {
    success: 'Operación exitosa',
    error: 'Ocurrió un problema',
    info: 'Información',
    warning: 'Atención',
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const closeNotification = useCallback(() => setNotification(null), []);

    const showNotification = useCallback((payload: NotificationPayload) => {
        const type = payload.type ?? 'info';
        setNotification({
            isOpen: true,
            type,
            title: payload.title ?? DEFAULT_TITLE[type],
            message: payload.message,
        });
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification, closeNotification }}>
            {children}
            {notification?.isOpen && (
                <Modal notification={notification} onClose={closeNotification} />
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        return {
            showNotification: () => {/* noop */},
            closeNotification: () => {/* noop */},
        };
    }
    return ctx;
};

const typeStyles: Record<NotificationType, { bg: string; border: string; text: string}> = {
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800'},
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800'},
};

const Modal = ({ notification, onClose }: { notification: NotificationState; onClose: () => void }) => {
    const styles = typeStyles[notification.type];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className={`w-full max-w-md rounded-lg border shadow-lg ${styles.bg} ${styles.border}`}>
                <div className="flex items-start gap-3 p-4">
                    <div className="text-2xl" aria-hidden>
                    </div>
                    <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${styles.text}`}>{notification.title}</h3>
                        <p className="mt-1 text-gray-700 whitespace-pre-line">{notification.message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label="Cerrar notificación"
                    >
                        x
                    </button>
                </div>
                <div className="flex justify-end px-4 pb-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
