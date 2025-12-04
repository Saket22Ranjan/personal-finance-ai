# 🚀 Personal Finance AI – Smart Expense Tracking from Bank Statements

AI-powered personal finance dashboard built using **MERN + ML categorization**.
Upload **CSV/PDF bank statements** → get **clean insights**, **spend breakdowns**, **daily cashflow**, and **AI-generated financial reports**.

---

## ✨ Features

### 🔄 Multi-bank Statement Import

* Upload **CSV or PDF** from:
  ✔️ HDFC
  ✔️ ICICI
  ✔️ SBI
  ✔️ Axis
  ✔️ PhonePe
  ✔️ GPay
  ✔️ Paytm Wallet
  ✔️ UPI exports
* Auto-detect columns even when formats differ.

### 🤖 AI-Powered Categorization

Automatically classifies each transaction into:
**Food, Rent, Bills, Shopping, Travel, Subscriptions, Salary, Refunds, Transfers…**

Also identifies:

* Top merchants
* Recurring expenses
* Sudden spikes
* Monthly burn trends

### 📊 Beautiful Insights Dashboard

* Spend by category (Pie Chart)
* Daily net cash flow (Line Chart)
* Total inflow, outflow, net
* Transaction breakdown
* AI suggestions to improve savings

### 🔐 Authentication

* JWT-based auth
* Secure login / register
* No data stored after logout (session reset)

---

# 🏗️ Architecture Overview

```mermaid
flowchart LR
    A[User Browser] --> B[Frontend (React + Vite)]
    B -->|File Upload / Auth| C[Backend API (Node + Express)]
    C -->|Parse CSV/PDF| D[Parser Engine]
    D --> E[AI Categorizer (Rule-based + ML-ready)]
    C --> F[(MongoDB)]
    E --> F
    F --> B
```

---

# 📂 Project Structure

```
personal-finance-ai/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   ├── components/
│   │   │   ├── FileUpload.jsx
│   │   │   ├── CategoryPieChart.jsx
│   │   │   ├── TrendLineChart.jsx
│   ├── public/
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Transaction.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   ├── services/
│   │   │   ├── categorizer.js
│   │   ├── server.js
│   ├── uploads/ (temp)
│   ├── .env
│
└── README.md
```

---

# 🧠 How It Works (Processing Pipeline)

### 1️⃣ User Uploads CSV/PDF

The backend detects file type:

* If **CSV** → parsed using `csv-parse`
* If **PDF** → parsed using `pdf-parse`

### 2️⃣ Extracts Fields

* Date
* Description
* Amount
* Debit/Credit type

### 3️⃣ Transaction Categorization

Using rule-engine + pattern matching:

* “SWIGGY”, “ZOMATO” → Food
* “PAYTM UPI XXXX” → UPI Transfer
* “OLA”, “UBER” → Travel
* “YOUTUBE”, “NETFLIX” → Subscriptions
* Amount < 0 → Debit
* Amount > 0 → Credit

### 4️⃣ Stored in MongoDB

Scoped **per user session**.
On logout → frontend resets state.

### 5️⃣ Dashboard Visualization

Using **Recharts** / **Chart.js**:

* Pie Chart for category spend
* Line Chart for cashflow
* Summary cards
* AI insights panel

---

# ⚙️ Installation & Setup

## 🔧 Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Create backend/.env

```
MONGO_URI=mongodb://127.0.0.1:27017/personal_finance_ai
JWT_SECRET=yourSecretKeyHere
PORT=5000
```

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Create frontend/.env

```
VITE_API_URL=http://localhost:5000/api
```

---

# 🖥️ Screenshots (Add these later)

```
📌 Landing Page  
📌 Login / Register  
📌 Upload Page  
📌 Dashboard – Summary  
📌 Spend Breakdown  
📌 Insights Panel  
```

---

# 🚀 Roadmap / Future Enhancements

### 🔜 Upcoming Features

* Export full monthly report → PDF
* Income tax estimation
* Budget suggestions using ML
* Multi-month comparison dashboard
* Subscription auto-detection
* SMS inbox parsing

---

# 🛠️ Tech Stack

### 💻 Frontend

* React + Vite
* TailwindCSS
* Recharts
* Framer Motion
* Axios

### 🧩 Backend

* Node.js + Express
* Multer (File Uploads)
* pdf-parse
* csv-parse
* JWT Auth

### 🗄 Database

* MongoDB / Atlas

---

# ❤️ Built by Saket Ranjan

If you like this project, ⭐ star it on GitHub!

---

If you want, I can also generate:

✅ **A logo pack (light + dark mode)**
✅ **Architecture diagram as PNG/SVG**
✅ **UI screenshots mockup**
Just tell me **“Generate logo”** or **“Give architecture image”**.
