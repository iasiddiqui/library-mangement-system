# Library Management System

A modern, full-stack online library management system built with Express.js, MongoDB, and vanilla JavaScript. This system provides a comprehensive solution for managing books, students, book issues, and feedback in a digital library environment.

## 🚀 Features

### Student Features
- **User Registration & Authentication**: Secure student registration and login with JWT tokens
- **Book Browsing**: Browse available books with detailed information
- **Book Details**: View comprehensive book details including content
- **Book Issuing**: Issue books from the library
- **Issued Books Management**: View and manage your issued books
- **Book Returns**: Return books when finished
- **Profile Management**: View and update student profile
- **Feedback System**: Submit feedback and suggestions

### Admin Features
- **Admin Dashboard**: Comprehensive admin panel for system management
- **Book Management**: Add, view, and manage books in the library
- **Student Management**: View all registered students
- **Issue Management**: Monitor and manage all book issues
- **Feedback Management**: View and manage student feedback
- **System Statistics**: Overview of library statistics

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **RESTful API**: Well-structured API endpoints
- **Responsive Design**: Modern, mobile-friendly UI
- **Book Content**: Full-text book content reading
- **Image Support**: Book cover images
- **Auto-initialization**: Default admin and books on first run

## 🛠️ Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database (with Mongoose ODM)
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variables

### Frontend
- **HTML5**: Markup
- **CSS3**: Styling
- **Vanilla JavaScript**: Client-side logic
- **Font Awesome**: Icons (if used)
- **Google Fonts**: Typography

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** (comes with Node.js) or **yarn**

## 📦 Installation

1. **Clone the repository or navigate to the project directory**
   ```bash
   cd "library managmant system"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory
   ```bash
   # Create .env file
   touch .env
   ```

4. **Configure environment variables** in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/library_management
   PORT=3000
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

   **For MongoDB Atlas (Cloud):**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library_management?retryWrites=true&w=majority
   ```

5. **Start MongoDB** (if using local MongoDB)
   - **Windows**: MongoDB should start automatically as a service
   - **Mac/Linux**: `sudo systemctl start mongod` or `brew services start mongodb-community`

## 🚀 Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Access the Application
- **Frontend**: Open your browser and navigate to `http://localhost:3000`
- **API Base URL**: `http://localhost:3000/api`

## 🔐 Default Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`

> ⚠️ **Important**: The default admin account is automatically created on first server start. Change the password immediately in production!

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Student registration | No |
| POST | `/api/auth/login` | Student login | No |

### Books
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/books` | Get all books | No |
| GET | `/api/books/:id` | Get book by ID | No |
| POST | `/api/books/init` | Initialize default books | Admin |

### Issues
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/issues` | Get student's issued books | Student |
| POST | `/api/issues/:bookId` | Issue a book | Student |
| POST | `/api/issues/return/:issueId` | Return a book | Student |

### Profile
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/profile` | Get student profile | Student |
| PUT | `/api/profile` | Update student profile | Student |

### Feedback
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/feedback` | Submit feedback | No |
| GET | `/api/feedback` | Get all feedbacks | Admin |

### Admin
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/admin/login` | Admin login | No |
| GET | `/api/admin/students` | Get all students | Admin |
| GET | `/api/admin/issues` | Get all issues | Admin |
| GET | `/api/admin/feedback` | Get all feedbacks | Admin |

## 📁 Project Structure

```
library-management-system/
├── models/                 # MongoDB models
│   ├── Admin.js           # Admin model
│   ├── Book.js            # Book model
│   ├── Feedback.js        # Feedback model
│   ├── Issue.js           # Book issue model
│   └── Student.js         # Student model
├── routes/                 # API routes
│   ├── admin.js           # Admin routes
│   ├── auth.js            # Authentication routes
│   ├── books.js           # Book routes
│   ├── feedback.js        # Feedback routes
│   ├── issues.js          # Book issue routes
│   └── profile.js         # Profile routes
├── public/                 # Frontend files
│   ├── index.html         # Home page
│   ├── student_login.html # Student login page
│   ├── registration.html  # Student registration
│   ├── dashboard.html     # Student dashboard
│   ├── books.html         # Books listing
│   ├── book_detail.html   # Book details
│   ├── read_book.html     # Book reading page
│   ├── issued_books.html  # Issued books page
│   ├── profile.html       # Student profile
│   ├── feedback.html      # Feedback page
│   ├── admin_login.html   # Admin login
│   ├── admin_dashboard.html # Admin dashboard
│   ├── app.js             # Frontend utilities
│   └── styles.css         # Global styles
├── books/                  # Book cover images
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables (create this)
└── README.md              # This file
```

## 🎯 Key Features Explained

### Book Management
- Books are automatically initialized with default data on first run
- Each book includes title, author, category, description, image, and full content
- Books can be marked as available/unavailable based on issue status

### Issue System
- Students can issue books that are available
- Each issue tracks issue date and return date
- Books are automatically marked as unavailable when issued
- Students can view their issued books and return them

### Authentication
- JWT tokens are used for secure authentication
- Tokens are stored in localStorage on the client side
- Passwords are hashed using bcryptjs before storage
- Separate authentication for students and admins

### Feedback System
- Students can submit feedback without authentication
- Admins can view all feedback in the admin dashboard
- Feedback includes name, email, and message

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/library_management` |
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_super_secret_jwt_key` |
| `NODE_ENV` | Environment mode | `development` |

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB service status
- Verify connection string in `.env` file
- Check MongoDB logs for errors

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using port 3000

### Module Not Found Errors
- Run `npm install` to install all dependencies
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in `.env` matches
- Verify token expiration settings

## 📝 Notes

- Book images are served from the `/books/` directory
- The system uses JWT tokens stored in localStorage for authentication
- Passwords are hashed using bcryptjs with salt rounds of 10
- All timestamps are automatically managed by MongoDB
- The application uses a multi-page architecture (not SPA)
- Default books and admin are created automatically on first server start

## 📧 Contact Information

- **Email**: moneeriqbal19@gmail.com
- **Mobile**: +91 74850 88439

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔄 Version

Current Version: 1.0.0

---

**Happy Reading! 📚**
