# 🏭 Industrial Machine Selection DSS — MOORA Method

> A **Decision Support System** (DSS) for selecting the best industrial machine from multiple alternatives using the **MOORA** method _(Multi-Objective Optimization on the basis of Ratio Analysis)_.

---

## 📋 Project Description

This is a full-stack web application that helps decision makers select the most optimal industrial machine from a set of alternatives, evaluated against 10 predefined criteria. The system implements the MOORA method step-by-step and interactively, so users can follow and understand every stage of the calculation.

Developed as a university project for the **Decision Support Systems** course by:

| Name | Student ID |
|------|------------|
| Hamza Deleon Wiradarma | 2407412004 |
| Nur Nabila Amalia | 2407412015 |
| Aurellia Sagita Sandjaya | 2407412027 |
| Reynard Radithya Aydin | 2407412008 |

---

## ✨ Key Features

- 🔐 **User Authentication** — Session-based registration & login
- 📊 **Alternative Management** — Full CRUD for industrial machine data with validation
- 🧮 **Step-by-Step MOORA Calculation** — Transparent visualization of each calculation step
- 📈 **Final Ranking** — Visual ranking display with highlighted top recommendation
- 💾 **Calculation History** — Save and review previous calculation results
- 📄 **PDF Export** — Download a full ranking report as a PDF file
- 🌱 **Default Data Seed** — Load 10 sample machines directly from the database
- 💡 **Splash Screen** — Elegant intro animation on first launch

---

## 🔬 MOORA Calculation Flow

The system implements 5 sequential MOORA steps:

| Step | Page | Description |
|------|------|-------------|
| **Step 1** | Decision Matrix | Raw data of alternatives vs. criteria |
| **Step 2** | Normalization | Matrix normalization using the square root of sum of squares |
| **Step 3** | Weighting | Multiply normalized values by each criterion's weight |
| **Step 4** | Yi Optimization | Compute the net benefit score (benefit sum − cost sum) |
| **Step 5** | Ranking | Order alternatives by Yi value, highest to lowest |

**Core Formulas:**

```
Normalization  : x*ij  = xij / √(Σxij²)
Weighting      : x**ij = wj × x*ij
Yi Score       : Yi    = Σ(x**ij benefit) − Σ(x**ij cost)
```

---

## 📐 Evaluation Criteria

The system uses 10 criteria to evaluate industrial machines:

| Code | Criterion | Type | Weight |
|------|-----------|------|--------|
| C1 | Machine Price (IDR) | Cost | 0.20 |
| C2 | Motor Power (HP) | Benefit | 0.15 |
| C3 | Rotation Speed (RPM) | Benefit | 0.15 |
| C4 | Cutting Width (mm) | Benefit | 0.10 |
| C5 | Capacity (ton/hr) | Benefit | 0.10 |
| C6 | Ease of Maintenance | Benefit | 0.10 |
| C7 | Spare Parts Availability | Benefit | 0.05 |
| C8 | Product Warranty | Benefit | 0.05 |
| C9 | Technician Support | Benefit | 0.05 |
| C10 | Economic Lifespan (years) | Benefit | 0.05 |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Description |
|------------|---------|-------------|
| React | ^19 | UI library |
| React Router DOM | ^7 | Client-side routing |
| Vite | ^8 | Build tool & dev server |
| Lucide React | ^1.17 | Icon library |
| jsPDF + AutoTable | ^4 / ^5 | PDF export |

### Backend
| Technology | Description |
|------------|-------------|
| PHP | REST API (native, no framework) |
| MySQL | Relational database |
| PDO | Secure database connection |
| PHP Session | Authentication management |

---

## 🗂️ Project Structure

```
Project MOORA/
├── moora-spk-react/        # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/          # App pages (Landing, Step1–5, History, etc.)
│   │   ├── components/     # Reusable UI components (Button, Modal, DataTable, etc.)
│   │   ├── contexts/       # React Context (Auth, Toast, DataStore)
│   │   ├── hooks/          # Custom hooks (useAuth, useDataStore, useToast)
│   │   └── lib/            # MOORA engine, PDF export, utils
│   ├── public/
│   ├── index.html
│   └── package.json
│
└── moora-spk-backend/      # Backend (PHP + MySQL)
    ├── api/
    │   ├── alternatives.php    # CRUD for alternatives
    │   ├── seed.php            # Seed default data
    │   ├── auth/               # login, logout, register, check
    │   └── history/            # Save & retrieve calculation history
    ├── config/
    │   └── database.php        # PDO connection & helper functions
    └── database/
        └── moora_spk.sql       # MySQL database schema
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ & npm
- **PHP** 8.0+ (with `pdo_mysql` extension)
- **MySQL** 8.0+ or **XAMPP / Laragon**

### 1. Set Up the Database

```bash
mysql -u root -p < moora-spk-backend/database/moora_spk.sql
```

### 2. Configure the Backend

Edit `moora-spk-backend/config/database.php` with your MySQL credentials:

```php
$host   = 'localhost';
$dbname = 'moora_spk';
$user   = 'root';
$pass   = '';
```

Then serve the backend (place it in `htdocs`/`www`, or use the PHP built-in server):

```bash
cd moora-spk-backend
php -S localhost:8000
```

### 3. Run the Frontend

```bash
cd moora-spk-react
npm install
npm run dev
```

Open your browser at `http://localhost:5173`

---

## 📸 Usage Flow

1. **Open the app** → Splash screen is displayed
2. **Register / Log in** → To save data and calculation history
3. **Add Alternatives** → Enter machine data with 10 criterion values
4. **Start Calculation** → Follow Steps 1 through 5 sequentially
5. **View Results** → Final ranking with the top recommendation highlighted
6. **Export / Save** → Download as PDF or save to history

---

## 🗄️ Database Schema

```
users               — User account data
alternatives        — Machine alternatives per user
calculations        — Calculation session history (with snapshot)
calculation_results — Detailed ranking result per alternative per calculation
```

---

## 📦 NPM Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production to dist/
npm run preview  # Preview the production build
npm run lint     # Lint the codebase with ESLint
```

---

## 📄 License

This project was created for academic purposes. Feel free to use it as a learning reference.
