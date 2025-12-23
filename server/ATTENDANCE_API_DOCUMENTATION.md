# Attendance API Documentation for NodeMCU Integration

## Base URL
```
https://rvsattendance.ricr.in/api
```

---

## 📋 Table of Contents
1. [Mark Attendance (Check-In/Check-Out)](#1-mark-attendance-check-incheck-out)
2. [View Teacher Attendance Records](#2-view-teacher-attendance-records)
3. [Get All Teachers](#3-get-all-teachers)
4. [Error Responses](#error-responses)
5. [Testing Tips](#testing-tips)

---

## 1. Mark Attendance (Check-In/Check-Out)

### **Endpoint**
```
POST /attendence/mark/:rfid
```

### **Description**
This is the main endpoint for NodeMCU to call when an RFID card is scanned. It automatically handles:
- First scan of the day → Check-In
- Second scan of the day → Check-Out
- Validates user status and timing requirements

### **URL Parameters**
| Parameter | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| rfid      | String | Yes      | RFID card number of the teacher |

### **Request Example**
```http
POST https://rvsattendance.ricr.in/api/attendence/mark/RFID001
Content-Type: application/json
```

### **Success Responses**

#### **Check-In Response (201 Created)**
```json
{
  "message": "Check-in marked successfully",
  "lcd": {
    "line1": "Welcome!",
    "line2": "John Doe"
  },
  "data": {
    "type": "checkIn",
    "time": "2025-12-23T10:30:00.000Z",
    "user": {
      "fullname": "John Doe",
      "rfid": "RFID001"
    }
  }
}
```

#### **Check-Out Response (200 OK)**
```json
{
  "message": "Check-out marked successfully",
  "lcd": {
    "line1": "Goodbye!",
    "line2": "8h 15m"
  },
  "data": {
    "type": "checkOut",
    "time": "2025-12-23T18:45:00.000Z",
    "checkInTime": "2025-12-23T10:30:00.000Z",
    "duration": "495 minutes",
    "user": {
      "fullname": "John Doe",
      "rfid": "RFID001"
    }
  }
}
```

### **Error Responses**

#### **RFID Not Provided (400 Bad Request)**
```json
{
  "message": "RFID is required",
  "lcd": {
    "line1": "ERROR!",
    "line2": "No RFID Card"
  }
}
```

#### **User Not Found (404 Not Found)**
```json
{
  "message": "User not found",
  "lcd": {
    "line1": "RFID001",
    "line2": "Not Registered"
  }
}
```

**Note:** Line 1 displays the scanned RFID number for identification.

#### **User Not Active (403 Forbidden)**
```json
{
  "message": "User is not active",
  "lcd": {
    "line1": "Access Denied!",
    "line2": "User Inactive"
  }
}
```

#### **Minimum Time Not Met (400 Bad Request)**
```json
{
  "message": "Check-out not allowed. Minimum 15 minutes required. Current: 10 mins",
  "lcd": {
    "line1": "Too Early!",
    "line2": "Wait 5 mins"
  }
}
```

**Note:** Line 2 shows remaining minutes until checkout is allowed.

#### **Already Marked (400 Bad Request)**
```json
{
  "message": "Attendance already marked for today",
  "lcd": {
    "line1": "Already Done!",
    "line2": "Come Tomorrow"
  }
}
```

### **Business Rules**
- Minimum 15 minutes gap required between check-in and check-out
- User must have "active" status to mark attendance
- Only one check-in and one check-out allowed per day
- Date is determined by server time (midnight to midnight)

### **LCD Display Format**
All responses include an `lcd` object optimized for 16x2 LCD displays:
- `line1`: First line of text (max 16 characters)
- `line2`: Second line of text (max 16 characters)

**Success Messages:**
- Check-In: "Welcome!" + Teacher name
- Check-Out: "Goodbye!" + Duration

**Error Messages:**
- No RFID: "ERROR!" + "No RFID Card"
- Not Registered: RFID number + "Not Registered"
- User Inactive: "Access Denied!" + "User Inactive"
- Too Early: "Too Early!" + "Wait X mins"
- Already Marked: "Already Done!" + "Come Tomorrow"

---

## 2. View Teacher Attendance Records

### **Endpoint**
```
GET /attendence/view/:teacherId
```

### **Description**
Retrieve all attendance records for a specific teacher (sorted by most recent first).

### **URL Parameters**
| Parameter  | Type   | Required | Description                |
|------------|--------|----------|----------------------------|
| teacherId  | String | Yes      | MongoDB ObjectId of teacher |

### **Request Example**
```http
GET https://rvsattendance.ricr.in/api/attendence/view/6756a1b2c3d4e5f6a7b8c9d0
```

### **Success Response (200 OK)**
```json
{
  "message": "Attendance records fetched successfully",
  "teacher": {
    "_id": "6756a1b2c3d4e5f6a7b8c9d0",
    "fullname": "John Doe",
    "rfid": "RFID001",
    "email": "john.doe@school.com",
    "phone": "9876543210"
  },
  "totalRecords": 25,
  "attendance": [
    {
      "_id": "6756b1c2d3e4f5a6b7c8d9e0",
      "date": "2025-12-23T00:00:00.000Z",
      "status": "present",
      "checkInTime": "2025-12-23T10:30:00.000Z",
      "checkOutTime": "2025-12-23T18:45:00.000Z",
      "duration": "8h 15m",
      "durationInMinutes": 495,
      "createdAt": "2025-12-23T10:30:00.000Z"
    },
    {
      "_id": "6756c1d2e3f4a5b6c7d8e9f0",
      "date": "2025-12-22T00:00:00.000Z",
      "status": "present",
      "checkInTime": "2025-12-22T09:15:00.000Z",
      "checkOutTime": "2025-12-22T17:30:00.000Z",
      "duration": "8h 15m",
      "durationInMinutes": 495,
      "createdAt": "2025-12-22T09:15:00.000Z"
    }
  ]
}
```

### **Error Responses**

#### **Teacher ID Not Provided (400 Bad Request)**
```json
{
  "message": "Teacher ID is required"
}
```

#### **Teacher Not Found (404 Not Found)**
```json
{
  "message": "Teacher not found"
}
```

---

## 3. Get All Teachers

### **Endpoint**
```
GET /attendence/allNames
```

### **Description**
Retrieve a list of all teachers with their IDs, names, and RFID numbers.

### **Request Example**
```http
GET https://rvsattendance.ricr.in/api/attendence/allNames
```

### **Success Response (200 OK)**
```json
{
  "data": [
    {
      "_id": "6756a1b2c3d4e5f6a7b8c9d0",
      "fullname": "John Doe",
      "rfid": "RFID001"
    },
    {
      "_id": "6756a2b3c4d5e6f7a8b9c0d1",
      "fullname": "Jane Smith",
      "rfid": "RFID002"
    },
    {
      "_id": "6756a3b4c5d6e7f8a9b0c1d2",
      "fullname": "Bob Johnson",
      "rfid": "RFID003"
    }
  ]
}
```

---

## Error Responses

### **HTTP Status Codes**
| Status Code | Description                           |
|-------------|---------------------------------------|
| 200         | Success - Request completed           |
| 201         | Created - New attendance record       |
| 400         | Bad Request - Invalid input           |
| 403         | Forbidden - User not authorized       |
| 404         | Not Found - Resource doesn't exist    |
| 500         | Internal Server Error                 |

### **Standard Error Format**
All error responses now include LCD-friendly display format:
```json
{
  "message": "Error description here",
  "lcd": {
    "line1": "First line text",
    "line2": "Second line text"
  }
}
```

---

## Testing Tips

### **Using cURL**
```bash
# Test check-in
curl -X POST https://rvsattendance.ricr.in/api/attendence/mark/RFID001

# Test check-out (run after 15+ minutes)
curl -X POST https://rvsattendance.ricr.in/api/attendence/mark/RFID001

# View attendance
curl https://rvsattendance.ricr.in/api/attendence/view/6756a1b2c3d4e5f6a7b8c9d0

# Get all teachers
curl https://rvsattendance.ricr.in/api/attendence/allNames
```

### **Using Postman**
1. Create a POST request to `https://rvsattendance.ricr.in/api/attendence/mark/RFID001`
2. Set Headers: `Content-Type: application/json`
3. Send request and check response

---

## Important Notes for NodeMCU

1. **Production URL**: Use `https://rvsattendance.ricr.in/api` as the base URL
2. **SSL/HTTPS**: The server uses HTTPS, ensure your NodeMCU supports SSL connections
3. **HTTP Method**: Use POST request with empty body to `/attendence/mark/:rfid`
4. **Response Parsing**: Parse JSON response to determine check-in vs check-out
5. **Error Handling**: Check HTTP status codes (200/201 = success, 400/403/404 = error)
6. **LCD Display**: 
   - Use `response.lcd.line1` for first line (16 chars max)
   - Use `response.lcd.line2` for second line (16 chars max)
   - Both lines are pre-formatted and ready to display
7. **Data Fields**: 
   - `data.type` will be either "checkIn" or "checkOut"
   - `data.user.fullname` contains teacher name
   - `data.duration` (only for check-out) contains time duration

---

## Contact & Support

For issues or questions:
- Backend Server: Check server logs or API status
- NodeMCU: Use Serial Monitor (115200 baud rate) for debugging
- Network Issues: Verify NodeMCU has internet connectivity and can reach the API domain

---

**Last Updated:** December 23, 2025
**Version:** 1.0
