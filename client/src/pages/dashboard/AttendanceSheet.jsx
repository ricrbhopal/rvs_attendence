import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../config/api.jsx'
import { toast } from 'react-hot-toast'
import logo from '../../assets/image.png'

const AttendanceSheet = () => {
  const navigate = useNavigate()
  const { teacherId } = useParams()
  
  const [teacher, setTeacher] = useState(null)
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState('2025-12')

  useEffect(() => {
    // Check if user is logged in
    const user = sessionStorage.getItem("user")
    if (!user) {
      toast.error("Please login first")
      navigate("/login")
      return
    }
    fetchAttendanceData()
  }, [teacherId, navigate])

  const fetchAttendanceData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/attendence/view/${teacherId}`)
      setTeacher(res.data.teacher)
      setAttendanceRecords(res.data.attendance)
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Session expired. Please login again")
        sessionStorage.removeItem("user")
        navigate("/login")
      } else if (error?.response?.status === 404) {
        toast.error("Teacher not found")
        navigate("/dashboard")
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to fetch attendance data"
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const formatDuration = (durationInMinutes) => {
    if (!durationInMinutes) return '0h 0m'
    const hours = Math.floor(durationInMinutes / 60)
    const minutes = durationInMinutes % 60
    return `${hours}h ${minutes}m`
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'bg-green-100 text-green-800'
      case 'absent': return 'bg-red-100 text-red-800'
      case 'late': return 'bg-yellow-100 text-yellow-800'
      case 'leave': return 'bg-blue-100 text-blue-800'
      case 'half-day': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadge = (status) => {
    const colors = getStatusColor(status)
    const label = status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors}`}>
        {label}
      </span>
    )
  }

  // Calculate statistics
  const stats = {
    totalDays: attendanceRecords.length,
    present: attendanceRecords.filter(r => r.status === 'present').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    late: attendanceRecords.filter(r => r.status === 'late').length,
    excused: attendanceRecords.filter(r => r.status === 'excused').length,
    totalMinutes: attendanceRecords.reduce((sum, r) => sum + (r.durationInMinutes || 0), 0),
    totalHours: (attendanceRecords.reduce((sum, r) => sum + (r.durationInMinutes || 0), 0) / 60).toFixed(2),
    avgHours: attendanceRecords.length > 0 
      ? ((attendanceRecords.reduce((sum, r) => sum + (r.durationInMinutes || 0), 0) / 60) / attendanceRecords.length).toFixed(2)
      : '0.00'
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-[#7B2D26] mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading attendance data...</p>
        </div>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Teacher Not Found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className='bg-[#7B2D26] hover:bg-[#5A1F1A] text-white px-6 py-2.5 rounded-lg transition'
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50'>
      {/* Header */}
      <header className='bg-white shadow-md border-b-2 border-[#7B2D26]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-20'>
            <div className='flex items-center space-x-3'>
              <img src={logo} alt='Raj Vedanta School' className='h-14 w-auto' />
              <div>
                <div className='text-xl font-bold text-[#7B2D26]'>Raj Vedanta School</div>
                <div className='text-xs text-gray-600'>Attendance Sheet</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className='bg-[#7B2D26] hover:bg-[#5A1F1A] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold flex items-center gap-2'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Teacher Info Card */}
        <div className='bg-white rounded-xl shadow-md p-6 mb-8'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div>
              <h1 className='text-3xl font-bold text-[#7B2D26] mb-2'>{teacher.fullname}</h1>
              <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                <div className='flex items-center gap-2'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                  <span>{teacher.email}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                  </svg>
                  <span>{teacher.phone}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2' />
                  </svg>
                  <span className='font-mono'>{teacher.rfid}</span>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent outline-none'
              >
                <option value='2025-12'>December 2025</option>
                <option value='2025-11'>November 2025</option>
                <option value='2025-10'>October 2025</option>
              </select>
              {/* Export Button */}
              {/* <button className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-semibold flex items-center gap-2'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
                Export
              </button> */}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8'>
          <div className='bg-white rounded-lg shadow-md p-4 text-center'>
            <div className='text-2xl font-bold text-gray-800'>{stats.totalDays}</div>
            <div className='text-xs text-gray-600 mt-1'>Total Days</div>
          </div>
          <div className='bg-white rounded-lg shadow-md p-4 text-center border-l-4 border-green-500'>
            <div className='text-2xl font-bold text-green-600'>{stats.present}</div>
            <div className='text-xs text-gray-600 mt-1'>Present</div>
          </div>
          <div className='bg-white rounded-lg shadow-md p-4 text-center border-l-4 border-red-500'>
            <div className='text-2xl font-bold text-red-600'>{stats.absent}</div>
            <div className='text-xs text-gray-600 mt-1'>Absent</div>
          </div>
          <div className='bg-white rounded-lg shadow-md p-4 text-center border-l-4 border-yellow-500'>
            <div className='text-2xl font-bold text-yellow-600'>{stats.late}</div>
            <div className='text-xs text-gray-600 mt-1'>Late</div>
          </div>
          <div className='bg-white rounded-lg shadow-md p-4 text-center border-l-4 border-[#7B2D26]'>
            <div className='text-2xl font-bold text-[#7B2D26]'>{stats.totalHours}</div>
            <div className='text-xs text-gray-600 mt-1'>Total Hours</div>
          </div>
          <div className='bg-white rounded-lg shadow-md p-4 text-center border-l-4 border-purple-500'>
            <div className='text-2xl font-bold text-purple-600'>{stats.avgHours}</div>
            <div className='text-xs text-gray-600 mt-1'>Avg Hours</div>
          </div>
        </div>

        {/* Attendance Records Table */}
        <div className='bg-white rounded-xl shadow-md overflow-hidden'>
          <div className='bg-[#7B2D26] text-white px-6 py-4'>
            <h2 className='text-xl font-bold'>Attendance Records</h2>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b-2 border-gray-200'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Date</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Check In</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Check Out</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Duration</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {attendanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan='5' className='px-6 py-8 text-center text-gray-500'>
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  attendanceRecords.map((record) => (
                    <tr key={record._id} className='hover:bg-gray-50 transition'>
                      <td className='px-6 py-4 text-sm font-semibold text-gray-900'>
                        {formatDate(record.date)}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-900 font-mono'>
                        {formatTime(record.checkInTime)}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-900 font-mono'>
                        {formatTime(record.checkOutTime)}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-900 font-semibold'>
                        {record.duration || '-'}
                      </td>
                      <td className='px-6 py-4'>
                        {getStatusBadge(record.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceSheet
