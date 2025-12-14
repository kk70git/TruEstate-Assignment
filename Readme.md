# TruEstate - Sales Management Dashboard

A full-stack MERN application designed to manage and visualize sales transaction data. This dashboard features advanced filtering, sorting, server-side pagination, and a responsive UI built with React and Tailwind CSS.

## 🚀 Live Demo

- **Frontend (Vercel):** https://tru-estate-assignment-eight.vercel.app/
- **Backend (Render):** https://truestate-backend-t4uz.onrender.com

---

## ✨ Features

- **Dynamic Dashboard:** Visualizes total sales, units sold, and discount metrics.
- **Advanced Filtering:** Filter transactions by Region, Gender, Category, Payment Method, and Date Range.
- **Server-Side Pagination:** Efficiently handles large datasets by loading data in chunks.
- **Search & Sort:** Real-time search by Name/Phone and sorting capabilities (Date, Name, Quantity).
- **Responsive Design:** Fully responsive layout built with Tailwind CSS.
- **RESTful API:** Robust backend handling data queries, filtering, and database operations.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **State Management:** React Hooks (`useState`, `useEffect`)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **ORM:** Mongoose
- **Deployment:** Render (Backend), Vercel (Frontend)

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
- Node.js installed
- MongoDB Atlas connection string

### 1. Clone the Repository
```bash
git clone https://github.com/kk70git/TruEstate-Assignment.git
cd TruEstate-Assignment
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
Create a .env file in the Backend folder and add your credentials:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
```
Start the backend server
```bash
npm start
```
The server will run on http://localhost:5000

### 3. Frontend Setup
```bash
cd Frontend
npm install
```
Create a .env file in the Frontend folder:

```bash
# Point this to your local backend for development
VITE_API_URL=http://localhost:5000/api
```
Start the React development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173


## 🔌 API Endpoints

### Base URL
`https://truestate-backend-t4uz.onrender.com/api`

### 1. Get Transactions
Fetches a paginated list of transactions with optional filtering and sorting.

- **Endpoint:** `/transactions`
- **Method:** `GET`
- **Query Parameters:**

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `page` | `number` | Page number for pagination | `1` |
| `limit` | `number` | Number of items per page | `10` |
| `search` | `string` | Search by Customer Name or Phone | `Anurag` |
| `sort` | `string` | Sort field (`date`, `name`, `quantity`) | `date` |
| `region` | `string` | Filter by region | `North` |
| `gender` | `string` | Filter by gender | `Male` |
| `category` | `string` | Filter by product category | `Electronics` |
| `minAge` | `number` | Filter by minimum age | `20` |
| `maxAge` | `number` | Filter by maximum age | `30` |
| `startDate`| `date` | Filter transactions after this date | `2023-01-01` |
| `endDate` | `date` | Filter transactions before this date | `2023-12-31` |

**Example Request:**
```http
GET /api/transactions?page=1&limit=10&search=Anurag&sort=date
```

### 2. Get Filter Options
Fetches distinct values for dropdown filters (Regions, Categories, Payment Methods, Tags) to populate the frontend UI.

- **Endpoint:** `/transactions/options`
- **Method:** `GET`

**Example Response:**
```json
{
  "regions": ["North", "South", "East", "West"],
  "categories": ["Electronics", "Clothing", "Home"],
  "paymentMethods": ["Credit Card", "UPI", "Cash"],
  "tags": ["New", "Sale"]
}
```

## 📂 Project Structure

```
truestate-assignment/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components (Sidebar, Table, etc.)
│   │   ├── services/    # API configuration (api.js)
│   │   ├── App.jsx      # Main application logic
│   │   └── main.jsx     # Entry point
│   └── .env             # Frontend environment variables
│
└── server/              # Node.js Backend
    ├── models/          # Mongoose schemas
    ├── routes/          # API routes
    ├── controllers/     # Route logic
    ├── index.js         # Server entry point
    └── .env             # Backend secrets

```

## 🛡️ Environment Variables:
Note: Do not commit your .env files to GitHub.

Backend: Needs MONGO_URI to connect to the database.

Frontend: Needs VITE_API_URL to know where to send requests (use the Render URL when deploying)

