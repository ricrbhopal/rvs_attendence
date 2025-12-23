import React from 'react'

const ConfirmationToast = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "primary" // primary, warning, danger
}) => {
  const getButtonColors = () => {
    switch (type) {
      case 'warning':
        return 'bg-orange-600 hover:bg-orange-700'
      case 'danger':
        return 'bg-red-600 hover:bg-red-700'
      default:
        return 'bg-[#7B2D26] hover:bg-[#5A1F1A]'
    }
  }

  const getTitleColor = () => {
    switch (type) {
      case 'warning':
        return 'text-orange-700'
      case 'danger':
        return 'text-red-700'
      default:
        return 'text-[#7B2D26]'
    }
  }

  return (
    <div className="flex flex-col gap-3 p-2 min-w-[300px]">
      <div className={`font-bold text-lg ${getTitleColor()}`}>
        {title}
      </div>
      <div className="text-sm text-gray-700">
        {message}
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={onConfirm}
          className={`flex-1 ${getButtonColors()} text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg`}
        >
          {confirmText}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
        >
          {cancelText}
        </button>
      </div>
    </div>
  )
}

export default ConfirmationToast
