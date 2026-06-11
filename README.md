# Rukon's Tutorial - Coaching Center Management System

A complete MERN stack MVP for managing a small-to-medium coaching center. Built for **Rukon's Tutorial**, Katiadi, Kishoreganj, Bangladesh.

## Features

### Public Website
- Home, About, Courses/Batches, Teachers, Results, Admission, Notices, Contact
- Online admission form and contact form
- Responsive design for desktop, tablet, and mobile

### Admin Dashboard
- Dashboard overview with stats
- Student, Batch, Attendance, Payment management
- Exam & Result management
- Notice & Study Material management
- Teacher profile management
- Admission request review

### Student Portal
- Profile, Batch info, Attendance, Payments, Results
- Notices and Study Materials (external links only)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, React Router, Tailwind CSS, Axios, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |

## Project Structure

```
/coaching-management-system (root)
├── client/          # React frontend
│   ├── public/images/   # Logo & photos (add your images here)
│   └── src/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       └── utils/
└── server/          # Express backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── seed/
    └── utils/
```

## Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm

## Setup Instructions

### 1. Clone / Open Project

```bash
cd "D:\Rukon's Tutorial"
```

### 2. Backend Setup

```bash
cd server
npm install
```

Copy environment file and configure:

```bash
copy .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/rukons-tutorial
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Seed the database with sample data:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

### 4. Add Your Images

Place your coaching center images in these locations:

| File | Path |
|------|------|
| Logo | `client/public/images/logo.png` |
| Classroom photo | `client/public/images/classroom.jpg` |
| Students photo | `client/public/images/students.jpg` |
| Teacher photos | `client/public/images/teacher-1.jpg`, `teacher-2.jpg`, `teacher-3.jpg` |

You can also copy images from the root `images/` folder if you add them there.

### 5. Open in Browser

- **Website:** http://localhost:5173
- **API:** http://localhost:5000/api/health

## Sample Login Credentials

After running `npm run seed` in the server folder:

### Admin
| Field | Value |
|-------|-------|
| Email | admin@rukons.com |
| Password | admin123 |

### Students (password: `student123` for all)
| Name | Email |
|------|-------|
| Arif Hossain | arif@rukons.com |
| Sadia Akter | sadia@rukons.com |
| Rahim Khan | rahim@rukons.com |
| Nusrat Jahan | nusrat@rukons.com |
| Imran Hasan | imran@rukons.com |

## API Endpoints

| Module | Base Route |
|--------|------------|
| Auth | `/api/auth` |
| Students | `/api/students` |
| Batches | `/api/batches` |
| Attendance | `/api/attendance` |
| Payments | `/api/payments` |
| Exams | `/api/exams` |
| Notices | `/api/notices` |
| Materials | `/api/materials` |
| Admissions | `/api/admissions` |
| Teachers | `/api/teachers` |
| Contact | `/api/contact` |
| Dashboard | `/api/dashboard` |

## Contact Information (Rukon's Tutorial)

- **Address:** Sarachar Road, Katiadi Purbapara, Beside Hiralal Sahar Field, Katiadi, Kishoreganj
- **Phone:** 01341703221
- **Email:** rukonahmed734@gamil.com
- **Facebook:** https://www.facebook.com/RukonsTutorial
- **Hours:** 7:00 AM - 9:00 PM

## Production Notes

- Change `JWT_SECRET` to a strong random string
- Use MongoDB Atlas for cloud database
- Set `CLIENT_URL` to your production frontend URL
- Build frontend: `cd client && npm run build`
- Serve frontend build with nginx or similar
- Never commit `.env` files

## License

Private project for Rukon's Tutorial.
