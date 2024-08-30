# ROCIKIB | Log Management System
![Rockib Logo](./assets/Rockib.webp)
This project is a simple log management system built using Node.js, Express, and MongoDB. It provides an API for adding logs and retrieving them based on various filters such as application name, sections, and date ranges. The system also integrates with an external utilization monitoring service.

## Features

- **Add Logs**: Store logs with customizable fields including app name, section, subsection, and data.
- **Retrieve Logs**: Retrieve logs based on application name, section, subsection, date range, and pagination.
- **Caching**: Caches API responses for improved performance.
- **External Utilization Data Posting**: Automatically posts log usage data to an external monitoring service.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm (Node Package Manager)

### Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/fandilladp/Rockib
   cd Rockib
   ```

2. **Install dependencies**:

   ```bash
   yarn
   ```

3. **Environment Configuration**:

   Create a `.env` file in the root directory of your project and configure the following environment variables:

   ```env
   PORT=5000
   TOKEN=your_auth_token
   DB_HOST=your_mongo_host
   DB_PORT=your_mongo_port
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   HOSTUTILITOR=url_of_utilization_monitoring_service
   TOKENUTILITOR=token_for_utilization_service
   ```

   - **PORT**: The port number on which the server will run.
   - **TOKEN**: Authorization token for the API.
   - **DB_HOST**: Hostname or IP address of the MongoDB server.
   - **DB_PORT**: Port number on which MongoDB is running.
   - **DB_NAME**: Name of the MongoDB database.
   - **DB_USER**: Username for MongoDB authentication.
   - **DB_PASSWORD**: Password for MongoDB authentication.
   - **HOSTUTILITOR**: URL of the external utilization monitoring service.
   - **TOKENUTILITOR**: Token required to authenticate with the utilization monitoring service.

4. **Start the Server**:

   ```bash
   npm start
   ```

   The server will start on the port specified in your `.env` file (default is `5000`).

## API Endpoints

### Add Log

- **URL**: `/api/addLog`
- **Method**: `POST`
- **Description**: Adds a new log entry to the database.
- **Request Body**:

  ```json
  {
    "app": "string",
    "section": "string",
    "subsection": "string",
    "data": {}
  }
  ```

- **Response**:

  ```json
  {
    "message": "Log added successfully",
    "newLog": {
      "_id": "unique_log_id",
      "app": "string",
      "section": "string",
      "subsection": "string",
      "data": {},
      "createdAt": "timestamp"
    }
  }
  ```

### Retrieve Logs

- **URL**: `/api/getData/:app?/:section?/:subsection?`
- **Method**: `GET`
- **Description**: Retrieves logs based on application name, section, subsection, and optional date filters.
- **Query Parameters**:
  - `app`: Name of the application (required).
  - `section`: Section name (optional).
  - `subsection`: Subsection name (optional).
  - `startDate`: Filter logs starting from this date (optional).
  - `endDate`: Filter logs up to this date (optional).
  - `limitFrom`: Pagination start (optional).
  - `limitTo`: Pagination end (optional).

- **Example**:

  ```bash
  GET /api/getData?app=testApp&startDate=2024-08-20&endDate=2024-08-29
  ```

- **Response**:

  ```json
  [
    {
      "_id": "unique_log_id",
      "app": "string",
      "section": "string",
      "subsection": "string",
      "data": {},
      "createdAt": "timestamp"
    },
    ...
  ]
  ```

## Caching

The application uses a simple in-memory cache to store API responses for 60 seconds. This helps in reducing the load on the database for frequently accessed data.

## External Utilization Monitoring

The application posts usage data to an external utilization monitoring service every time a log is added or retrieved. This can be configured using the `HOSTUTILITOR` and `TOKENUTILITOR` environment variables.

## Self-Hosting

To self-host this project, follow the setup instructions mentioned above. Ensure that your MongoDB instance is accessible, and your environment variables are correctly configured in the `.env` file.

---

This documentation should help developers understand how to set up and use the log management system effectively. Feel free to modify the documentation to fit your specific project details.