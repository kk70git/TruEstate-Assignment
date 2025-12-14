# 🏗️ System Architecture

This document outlines the technical design of the **TruEstate Sales Management System**, a full-stack MERN application.

## 1. High-Level Overview

The system uses a **Client-Server** architecture where the React frontend communicates with the Node.js backend via a RESTful API.

```bash
graph LR
    Client[Frontend (Vercel)] -->|REST API| Server[Backend (Render)]
    Server -->|Mongoose| DB[(MongoDB Atlas)]
    DB -->|JSON| Server
    Server -->|JSON| Client
```
## 2. Tech Stack & Components
### 🖥️ Frontend (Client)
Framework: React.js (v18) with Vite for fast build performance.

Styling: Tailwind CSS for responsive, utility-first design.

Networking: Axios for handling HTTP requests and useEffect for data fetching.

State Management: React Hooks (useState) for managing filters and pagination.

Environment: Uses VITE_API_URL to toggle between local and production backends.

### ⚙️ Backend (Server)
Runtime: Node.js with Express.js.

Architecture: MVC (Model-View-Controller) pattern.

Routes: Define endpoints (e.g., /transactions).

Controllers: Handle logic (filtering, sorting, pagination).

Models: Mongoose schemas to validate data structure.

Security: cors for cross-origin requests and dotenv for secret management.

### 🗄️ Database
Service: MongoDB Atlas (Cloud NoSQL).

Data Model: Stores sales records in a transactions collection.

Schema: flexible JSON-like documents containing customer details, transaction amounts, and regional data.

## 3. Deployment Strategy
The application uses a decoupled deployment strategy for scalability:

| Component | Host | Key Configuration |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** | Optimized for static assets and React; connects via HTTPS. |
| **Backend** | **Render** | Hosting for the Node.js API service. |
| **Database** | **MongoDB Atlas** | Managed cloud database cluster. |

## 4. Data Flow
User Action: User applies a filter (e.g., "Region: North").

Request: Frontend sends GET /api/transactions?region=North.

Process: Backend Controller builds a MongoDB query object.

Fetch: Database returns matching documents.

Response: JSON data is sent back to the Client to update the UI.