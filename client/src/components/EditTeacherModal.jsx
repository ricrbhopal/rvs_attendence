import React, { useState, useEffect } from 'react'

const EditTeacherModal = ({ isOpen, onClose, onSubmit, teacher }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    rfid: '',
    status: 'active'
  })

  // Populate form when teacher prop changes
  useEffect(() => {
    if (teacher) {
      setFormData({
        fullname: teacher.fullname || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        rfid: teacher.rfid || '',
        status: teacher.status || 'active'
      })
    }
  }, [teacher])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(teacher._id, formData)
  }

  const handleClose = () => {
    // Reset form on close
    setFormData({
      fullname: '',
      email: '',
      phone: '',
      rfid: '',
      status: 'active'
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='bg-blue-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center'>
          <h2 className='text-2xl font-bold'>Edit Teacher</h2>
          <button
            onClick={handleClose}
            className='text-white hover:text-gray-200 transition'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {/* Full Name */}
          <div>
            <label htmlFor='fullname' className='block text-sm font-semibold text-gray-700 mb-2'>
              Full Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='fullname'
              name='fullname'
              value={formData.fullname}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition'
              placeholder='Enter teacher full name'
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-2'>
              Email Address <span className='text-red-500'>*</span>
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition'
              placeholder='teacher@school.com'
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor='phone' className='block text-sm font-semibold text-gray-700 mb-2'>
              Phone Number <span className='text-red-500'>*</span>
            </label>
            <input
              type='tel'
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition'
              placeholder='9876543210'
              required
              pattern='[0-9]{10}'
              title='Please enter a valid 10-digit phone number'
            />
          </div>

          {/* RFID Card */}
          <div>
            <label htmlFor='rfid' className='block text-sm font-semibold text-gray-700 mb-2'>
              RFID Card Number <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='rfid'
              name='rfid'
              value={formData.rfid}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition font-mono'
              placeholder='RFID001'
              required
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor='status' className='block text-sm font-semibold text-gray-700 mb-2'>
              Status <span className='text-red-500'>*</span>
            </label>
            <select
              id='status'
              name='status'
              value={formData.status}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition'
              required
            >
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
              <option value='suspended'>Suspended</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={handleClose}
              className='flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300'
            >
              Update Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTeacherModal
