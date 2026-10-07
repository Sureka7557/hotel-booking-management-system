# Hotel Booking Management System

A full-stack hotel booking management system designed to provide a smooth and user-friendly experience for searching hotels, viewing rooms, selecting dates, making reservations, and managing hotel and user data.

## 📌 Overview

The Hotel Booking Management System is a web-based application with separate client, API, and admin dashboard applications.

The system allows users to:

- Search and explore hotels
- View hotel details and available rooms
- Select check-in and check-out dates
- Make hotel reservations
- View and manage reservations
- Register and log in securely

The admin dashboard provides management features for hotels, rooms, users, bookings, and statistics.

## ✨ Features

### 👤 User Side

- User registration and login
- Hotel search and filtering
- Hotel details page
- Room availability
- Date-range selection
- Room reservation
- Reservation management
- Responsive user interface

### 🏨 Admin Dashboard

- Admin authentication
- Hotel management
- Room management
- User management
- Booking management
- Hotel statistics
- Room statistics
- User statistics
- Data tables
- Dashboard charts
- Dark mode support

### ⚙️ Backend

- REST API
- Authentication
- User management
- Hotel management
- Room management
- Booking management
- Token verification
- Error handling
- Database models and API routes

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- React Router
- Axios
- CSS
- React Date Range
- Date-fns
- React Icons
- Font Awesome

### Admin Dashboard
- React.js
- JavaScript
- React Router
- Axios
- CSS
- Charts
- Data tables
- Context API

### Backend
- Node.js
- Express.js
- REST API
- Authentication
- MongoDB

## 📁 Project Structure

```text
hotel-booking-management-system/
│
├── admin/
│   ├── dashboard/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── App.js
│   │   └── package.json
│   │
│   └── package.json
│
├── api/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── data.js
│   ├── index.js
│   ├── seed.js
│   └── package.json
│
├── client/
│   ├── frontend/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── hooks/
│   │   │   └── pages/
│   │   └── package.json
│   │
│   └── package-lock.json
│
└── .gitignore
