# Data Visualizer Pro

## Overview

Data Visualizer Pro is a full-stack web application for interactive data visualization, dataset management, and AI-powered recommendations. Users can upload CSV datasets, analyze and visualize data with multiple chart types, and receive smart recommendations based on their data. The platform is designed for usability, performance, and security.

---

## Features

- **Interactive Dashboard:** Upload, analyze, and visualize datasets with a modern, responsive UI.
- **Dataset Management:** Securely upload, view, and manage datasets (CSV supported).
- **AI-Powered Recommendations:** Get relevant insights and suggestions based on your data.
- **Multiple Chart Types:** Line, bar, pie, scatter, and more powered by chart.js library.
- **User Authentication:** Secure login and account management.
- **Health Monitoring:** Health check endpoints for backend and recommendation services.
- **Performance & Security:** API rate limiting, error handling, and Redis caching.

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Supabase (Postgres), Redis, Docker
- **Recommendation Service:** Node.js, Express, Supabase, Twilio (optional)
- **Authentication:** Supabase Auth
- **Deployment:** Docker, Nginx

---

## Folder Structure

```
backend/
  core-service/         # Main API (datasets, users, etc.)
  recommendation-service/ # AI/ML recommendations
  shared/                 # Shared backend libs/configs
frontend/               # React app (UI)
docker-compose.yml      # Multi-service orchestration
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Supabase project (for DB & Auth)

### Setup

1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd Data-Visualizer-Pro
   ```
2. **Configure environment variables:**
   - Make a `.env` file in backend/core-service and backend/recommendation-service, and fill in Supabase/Redis/Twilio/SendGrid keys.
   - Make another `.env` file in frontend and fill in Supabase/MODE keys.
3. **Start with Docker Compose:**
   ```bash
   docker-compose up --build
   ```
   - Frontend: http://localhost:3000
   - Core API: http://localhost:3001/api
   - Recommendation API: http://localhost:3002/api

---

## Usage

- **Upload Datasets:** Go to Data Manager, upload CSV files (user_id required).
- **Visualize Data:** Select datasets and choose chart types in the dashboard.
- **Get Recommendations:** Navigate to the Recommendations page for AI-driven insights.
- **Account Settings:** Manage your profile and authentication.

---

## API Endpoints (Core Service)

- `GET /api/datasets?lite=true&user_id=...` — List datasets for user
- `POST /api/datasets/upload/csv` — Upload CSV (with user_id)
- `GET /api/datasets/:id` — Get dataset by ID
- `GET /api/datasets/Landing` — Demo datasets for landing page
- `GET /api/health` — Health check

## API Endpoints (Recommendation Service)

- `GET /api/recommendations` — Get recommendations
- `GET /api/health` — Health check

---

## Contributing

No Open Source contributions are welcome, since the project is completely private.

---

## Project Objectives

1. **Develop a Data Visualization Dashboard:**  
   Create a user-friendly web application that allows users to upload, analyze, and visualize datasets interactively.

2. **Enable Dataset Management:**  
   Provide features for users to upload, view, and manage datasets securely and efficiently.

3. **Implement Data Recommendation System:**  
   Integrate a recommendation engine to suggest relevant visualizations or insights based on the uploaded data.

4. **Ensure Robust API and Backend:**  
   Build a scalable and secure backend API to handle data processing, storage, and retrieval.

5. **Support Health Monitoring and Error Handling:**  
   Include health check endpoints and comprehensive error handling to ensure reliability and maintainability.

6. **Enhance User Experience:**  
   Focus on responsive design, intuitive navigation, and clear data presentation to improve usability.

7. **Maintain Security and Performance:**  
   Apply best practices for API security, rate limiting, and performance optimization throughout the application.

---
