# 💬 ChatBot Application

A real-time chat application built with **Next.js**, **Prisma**, **Zustand**, and **JWT authentication**.  
Supports text and image messages, user authentication, and persistent conversations.

---

## 🚀 Features

- 🔐 **Authentication & Authorization** using JWT
- 👤 **User Profiles** with avatar support
- 💬 **1:1 Messaging** between authenticated users
- 🖼️ **Image Attachments** (stored on Cloudinary)
- 🪝 **State Management** using Zustand
- 🗄️ **Database** with Prisma + PostgreSQL
- ⚡ **Real-time Ready** (Socket.io / WebSockets integration )

---

## 🛠️ Tech Stack

- **Frontend:**  React, TailwindCSS , Daisy UI ,Typescript
- **State Management:** Zustand
- **Backend / API:** REST API Routes , Typescript
- **Database ORM:** Prisma
- **Authentication:** JWT + HttpOnly Cookies
- **File Storage:** Cloudinary
- **Notifications:** react-hot-toast

---


---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/chatbot-app.git
cd chatbot-app
```
### 2. Install dependencies
```bash
npm install
```
### 3. Configure environment variables
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/chatdb"

# JWT
JWT_SECRET="your-secret-key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```
### 4. Run the development application
```bash
# backend
tsc -b
node dist/index.js

#frontend
npm run dev
```
The app will be available at http://localhost:3000

## 📸 Screenshots

### 🔑 Login Page
![Login Page](./frontend/public/images/Screenshot(109).png/)

### 🏠 Chat Dashboard
![Chat Dashboard](./frontend/public/images/Screenshot(105).png/)

### 👤 Profile Page
![Profile Page](./frontend/public/images/Screenshot(108).png/)

### 🌈 Themes
![Settings Page](./frontend/public/images/Screenshot(107).png/)












