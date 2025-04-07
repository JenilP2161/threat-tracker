
# 🛡️ Malware Tracker

A full-stack malware tracking application built with **Next.js**, providing real-time data from a public API with filtering, sorting, and pagination.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js** installed. You can install it from [https://nodejs.org/](https://nodejs.org/).

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/JenilP2161/malware-tracker.git
cd malware-tracker
npm install
```

### Run the Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 🧱 Project Architecture

### 🔹 Frontend

-   Built with **Next.js** App Router and **TypeScript**
    
-   **Tailwind CSS** for responsive styling
    
-   Components include:
    
    -   `Filter`: Search and sorting options
        
    -   `TableData`: Displays threat data in a table
        
    -   `Pagination`: Handles pagination controls
        

### 🔹 Backend (API Routes)

-   `/api/threats`: Server-side proxy to fetch threat data from a public malware URL API (e.g., abuse.ch)
    
-   Supports query params for:
    
    -   `page`, `limit`: Pagination
        
    -   `sortBy`, `order`: Sorting
        
    -   `filterType`: Threat type filtering
            
-   Includes simple in-memory rate limiting middleware to throttle requests based on IP
-   Includes Caching via headers to limit API request calls
- Input sanitization to handle 

### 🔹 Middleware 
  - Implements IP-based rate limiting with a cooldown.
  
  - Returns `429` status when the request rate exceeds limit.

---

## 📁 Project Structure

```
/components         → Reusable UI components (Filter, Pagination, TableData)
/pages/api          → API route acting as a proxy to fetch & sanitize threat data
/public             → Public assets (e.g., loader.gif)
index.tsx           → Main page with all logic (filtering, error handling, fetch)
```

---



## ✨ Features

- 🔐 **Rate limiting** with IP tracking to prevent abuse
- 📄 **Paginated, filterable, and sortable** malware data table
- ⚙️ **Backend proxy** to fetch data from a public malware API
- 🧼 **Input sanitization** on the backend to prevent malformed or harmful query parameters
- 🧠 **Caching mechanism** to reduce redundant API calls and improve performance
- 🎨 **Styled with Tailwind CSS** for a modern and responsive UI


---

## ⚠️ Known Limitations & Assumptions

- Input sanitization is not enforced on the client side; filtering relies on clean strings.
- Rate limiting is based on IP; in production, headers like `x-forwarded-for` should be validated carefully.
- Public API endpoint used is assumed to be stable and responsive.
- No database is currently used—data is fetched live on every request.
- No unit testing is currently done.

---

## ✅ Future Improvements

-   Add authentication and role-based access  
-   Integrate a database (e.g., PostgreSQL) for historical tracking   
-   Implement persistent rate limiting (e.g., Redis)
-   Unit and integration tests with **Jest**

---