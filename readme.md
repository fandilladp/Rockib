
# Rockib

Rockib is a flexible and scalable backend logging service built with Node.js and MongoDB. It is designed to handle a wide variety of log data structures, providing a powerful and efficient solution for logging and retrieving data across different applications and environments.

## Features

- **Flexible Data Structure:** Rockib allows you to log data in a highly flexible format. You can structure your log data in any way that suits your application's needs, making it easy to integrate with various types of applications.
- **Efficient Data Retrieval:** Rockib supports multiple ways to retrieve your log data. You can filter logs by application, section, subsection, and even specify limits to get exactly the data you need.
- **Scalable Architecture:** Built with Node.js and MongoDB, Rockib is designed to handle large volumes of log data efficiently, making it suitable for both small and large-scale applications.

## API Endpoints

### 1. Add Log
- **URL:** `{{host}}/api/addLog`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "app": "testApp",
    "section": "auth",
    "subsection": "login",
    "data": {
     
    }
  }
  ```
  This endpoint allows you to add a new log entry to the Rockib service. The log can include various details such as application name, section, subsection, and any additional data you want to log.

### 2. Get Data by App
- **URL:** `{{host}}/api/getData/:app`
- **Method:** `GET`
- **Parameters:** `app` (required) - The name of the application whose logs you want to retrieve.
  
  Use this endpoint to retrieve all logs associated with a specific application.

### 3. Get Data by App and Section
- **URL:** `{{host}}/api/getData/:app/:section`
- **Method:** `GET`
- **Parameters:** 
  - `app` (required) - The name of the application.
  - `section` (required) - The section of the application logs.

  This endpoint retrieves logs filtered by application name and section.

### 4. Get Data by App, Section, and Subsection
- **URL:** `{{host}}/api/getData/:app/:section/:subsection`
- **Method:** `GET`
- **Parameters:** 
  - `app` (required) - The name of the application.
  - `section` (required) - The section of the application logs.
  - `subsection` (optional) - The subsection within the section.

  Retrieve logs filtered by application, section, and subsection using this endpoint.

### 5. Get Data with Limit
- **URL:** `{{host}}/api/getData/:app?limitFrom=:limitFrom&limitTo=:limitTo`
- **Method:** `GET`
- **Parameters:**
  - `app` (required) - The name of the application.
  - `limitFrom` (optional) - The starting index for the logs.
  - `limitTo` (optional) - The ending index for the logs.

  Use this endpoint to retrieve a specific range of logs for an application.

### 6. Get Data by App and Section with Limit
- **URL:** `{{host}}/api/getData/:app/:section?limitFrom=:limitFrom&limitTo=:limitTo`
- **Method:** `GET`
- **Parameters:**
  - `app` (required) - The name of the application.
  - `section` (required) - The section of the application logs.
  - `limitFrom` (optional) - The starting index for the logs.
  - `limitTo` (optional) - The ending index for the logs.

  This endpoint allows you to retrieve a range of logs filtered by application and section.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or later)
- [MongoDB](https://www.mongodb.com/) (v4.x or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/rockib.git
   ```
2. Navigate to the project directory:
   ```bash
   cd rockib
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   Create a `.env` file in the root of the project and add your MongoDB connection string:
   ```env
   DB_HOST=your_mongodb_host
   DB_PORT=your_mongodb_port
   DB_NAME=your_mongodb_database_name
   DB_USER=your_mongodb_username
   DB_PASSWORD=your_mongodb_password
   ```

### Running the Application

1. Start the MongoDB server:
   ```bash
   mongod
   ```
2. Run the application:
   ```bash
   npm start
   ```

The application will start on `http://localhost:5000` by default.

### Testing the API

You can test the API using [Postman](https://www.postman.com/) or any other API client. Import the provided Postman collection to get started quickly.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

You can customize this README further to match the specific needs and details of your project.