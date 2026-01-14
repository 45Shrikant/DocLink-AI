# 🏥 DocLink-AI: Smart Doctor Appointment System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white)

**DocLink-AI** is a comprehensive healthcare platform designed to bridge the gap between patients and specialists. It features AI-powered symptom analysis, real-time appointment slot management, and secure payment processing.

---

## 🚀 Key Features

### 👨‍⚕️ For Patients
* **🤖 AI Symptom Checker:** Integrated **OpenAI (GPT-3.5)** assistant analyzes symptoms and recommends the right specialist instantly.
* **✅ Verified Doctors:** Only admin-verified doctors with valid credentials are listed to ensure safety and trust.
* **📅 Real-Time Slot Booking:** View **complete available slots** for every doctor. The system prevents double-booking and updates availability instantly.
* **💳 Secure Payments:** Integrated **Stripe Gateway** for seamless appointment fees.
* **🔔 Instant Notifications:** Get alerts for booking confirmations and status updates.

### 🩺 For Doctors
* **dashboard:** Manage appointments, view patient history, and update profile details.
* **Slot Management:** Customize working hours and appointment duration.

### 🛠️ For Developers (DevOps)
* **🐳 Fully Dockerized:** Client, Server, and Database are containerized for "run anywhere" reliability.
* **🔄 CI/CD Pipeline:** Automated build and deployment workflows via GitHub Actions and Render.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js, Context API, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud) |
| **AI Engine** | OpenAI API (GPT-3.5) |
| **Payments** | Stripe API |
| **DevOps** | Docker, Docker Compose, GitHub Actions |
| **Image Storage** | Cloudinary |

---

## ⚙️ Environment Setup

This project uses sensitive keys for AI and Payments. You must set these up locally.

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/45Shrikant/DocLink-AI.git](https://github.com/45Shrikant/DocLink-AI.git)
    cd DocLink-AI
    ```

2.  **Create a `.env` file** in the **ROOT** directory.

3.  **Add the following keys:**
    *(Note: You will need to get your own API keys for OpenAI and Stripe)*

    ```env
    # --- Server Configuration ---
    PORT=5015
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_random_secret_key

    # --- External Services ---
    OPENAI_API_KEY=sk-proj-your-openai-key
    STRIPE_SECRET_KEY=sk_test-your-stripe-key

    # --- Cloudinary (Images) ---
    REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
    REACT_APP_CLOUDINARY_PRESET=your_upload_preset
    REACT_APP_CLOUDINARY_BASE_URL=[https://api.cloudinary.com/v1_1/your_cloud_name/image/upload](https://api.cloudinary.com/v1_1/your_cloud_name/image/upload)

    # --- Client Configuration ---
    REACT_APP_SERVER_DOMAIN=http://localhost:5015/api
    ```

---

## 🏃‍♂️ How to Run

### Option 1: Using Docker (Recommended)
The easiest way to run the full stack (Frontend + Backend + Database).

```bash
docker-compose up --build
