# ProjectHub Frontend

ProjectHub is a web application for managing projects and tasks efficiently. This is the frontend part of the application, built with Next.js and React.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Development Server](#running-the-development-server)
- [API Configuration](#api-configuration)
- [Database Setup (Backend)](#database-setup-backend)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/) (LTS version recommended, e.g., v18.x or v20.x)
- [Yarn](https://yarnpkg.com/) (or npm, but Yarn is used in the commands below)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd front
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    # or npm install
    ```

    If you encounter peer dependency conflicts, you might need to use:

    ```bash
    yarn install --legacy-peer-deps
    # or npm install --legacy-peer-deps
    ```

## Running the Development Server

To start the Next.js development server:

```bash
yarn dev
# or npm run dev
```

The application will be accessible at `http://localhost:3000` (or another port if 3000 is in use).

## API Configuration

The frontend communicates with a backend API. The base URL for the API is configured via the `NEXT_PUBLIC_API_URL` environment variable.

By default, it points to `http://localhost:3002`.

To change it, create a `.env.local` file in the project root and add:

```
NEXT_PUBLIC_API_URL=http://your-backend-api-url:port
```

## Backend Setup

This frontend consumes data from a backend API. If you are setting up the backend, you will need to run the API locally in your machine.
# nevoa-frontend
