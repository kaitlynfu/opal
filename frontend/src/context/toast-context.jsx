import { createContext, useCallback, useState } from 'react'

export const ToastContext = createContext(null)

const ToastContextProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const removeToast = useCallback((toastId) => {
        setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.id !== toastId)
        )
    }, [])

    const showToast = useCallback((message, type = 'success') => {
        const toastId = Date.now() + Math.random()

        const newToast = {
            id: toastId,
            message,
            type
        }

        setToasts((currentToasts) => [
            ...currentToasts,
            newToast
        ])

        window.setTimeout(() => {
            removeToast(toastId)
        }, 3000)
    },
    [removeToast])

    return (
        <ToastContext.Provider
            value={{showToast}}
        >
            {children}
            
            <div className='toast-container'>
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast toast-${toast.type}`}
                    >  
                        <span className='toast-icon'>
                            {toast.type === 'error'
                                ? '!'
                                : toast.type === 'info'
                                    ? 'i'
                                    : '✓'}
                        </span>

                        <p>{toast.message}</p>

                        <button
                            type='button'
                            className='toast-close'
                            aria-label='Close notification'
                            onClick={() => removeToast(toast._id)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export default ToastContextProvider