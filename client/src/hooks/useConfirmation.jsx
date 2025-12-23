import { toast } from 'react-hot-toast'
import ConfirmationToast from '../components/ConfirmationToast'

export const useConfirmation = () => {
  const showConfirmation = ({
    title,
    message,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'primary',
    requireDoubleConfirmation = false,
    secondTitle = 'Final Confirmation',
    secondMessage = 'Are you absolutely sure you want to proceed?'
  }) => {
    const handleFirstConfirm = (toastId) => {
      toast.dismiss(toastId)

      if (requireDoubleConfirmation) {
        // Show second confirmation
        toast(
          (t2) => (
            <ConfirmationToast
              title={secondTitle}
              message={secondMessage}
              onConfirm={() => {
                toast.dismiss(t2.id)
                onConfirm()
              }}
              onCancel={() => toast.dismiss(t2.id)}
              confirmText="Yes, I'm Sure"
              cancelText={cancelText}
              type="warning"
            />
          ),
          { duration: Infinity }
        )
      } else {
        onConfirm()
      }
    }

    toast(
      (t) => (
        <ConfirmationToast
          title={title}
          message={message}
          onConfirm={() => handleFirstConfirm(t.id)}
          onCancel={() => toast.dismiss(t.id)}
          confirmText={confirmText}
          cancelText={cancelText}
          type={type}
        />
      ),
      { duration: Infinity }
    )
  }

  return { showConfirmation }
}
