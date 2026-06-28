# Online Judge (OJ)

A full-stack Online Judge platform inspired by LeetCode and CodeChef, built using the MERN stack. It allows users to solve coding problems, execute code in multiple programming languages, and submit solutions for automatic evaluation against hidden test cases.

---

## Features

### Authentication

* User Registration & Login
* JWT Authentication
* Role-based Authorization (Admin / User)

### Problem Management

* View all coding problems
* Problem details page
* Create, Edit and Delete problems (Admin)
* Difficulty levels
* Tags
* Examples and Hidden Test Cases

### Code Execution

* Run custom input
* Submit solution
* Verdict generation
* Multiple language support:

  * C
  * C++
  * Java
  * Python
  * JavaScript

### Judge

* Compilation
* Execution
* Automatic comparison with expected outputs
* Time Limit Exceeded detection
* Runtime Error detection
* Compilation Error detection
* Accepted / Rejected verdicts

### User Features

* Submission History
* User Profile
* Leaderboard

---

# Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* Monaco Editor

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Cookie Parser

## Judge

* Child Process
* GCC
* G++
* Java
* Python3
* Node.js Runtime

---

# Project Structure

```text
backend/
│
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── sandbox/
│      └── <temporary execution folders>
│
├── package.json
├── Dockerfile
└── .env
```

---

# Execution Flow

1. User submits code.
2. Backend creates a unique sandbox directory.
3. Source code and input are written into the sandbox.
4. The program is compiled.
5. The executable is run against test cases.
6. Outputs are compared with expected outputs.
7. Verdict is generated.
8. Sandbox directory is deleted.

---

# Verdicts

* Accepted
* Rejected
* Compilation Error
* Runtime Error
* Time Limit Exceeded

---

# Security

Current implementation includes:

* Isolated sandbox folder for every execution
* Automatic cleanup after execution
* Time limit enforcement
* Per-submission temporary directories

Future improvements planned:

* Docker sandboxing
* Non-root execution
* Memory limits
* CPU limits
* Network isolation
* Process limits
* Read-only filesystem

---

# Supported Languages

| Language   | Compiler / Runtime |
| ---------- | ------------------ |
| C          | gcc                |
| C++        | g++                |
| Java       | javac / java       |
| Python     | python3            |
| JavaScript | node               |

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the server

```bash
npm run dev
```

---

# Docker

Build the image

```bash
docker build -t online-judge .
```

Run the container

```bash
docker run -p 5000:5000 online-judge
```

---


## Judge

* Dockerized execution
* Memory Limit Exceeded detection
* Output Limit Exceeded detection
* Interactive problems
* Custom Test Cases

## Platform

* Discussion Forum
* AI Problem Generator
* AI Code Review
* Company-specific Question Sets


---

# License

This project is intended for educational and portfolio purposes.
