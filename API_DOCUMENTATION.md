# Car Dealer Website - API Documentation

## Overview
This document outlines all the API routes required for the LuxuryCars dealer website. The API follows RESTful conventions and uses JSON for data exchange.

## Base URL
\`\`\`
https://api.luxurycars.com/v1
\`\`\`

## Authentication
The API uses JWT tokens for authentication. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <jwt_token>
\`\`\`

---

## 1. Authentication Endpoints

### POST /auth/login
Admin login endpoint
\`\`\`json
Request:
{
  "email": "admin@luxurycars.com",
  "password": "admin123"
}

Response (200):
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "admin@luxurycars.com",
    "role": "admin",
    "name": "Admin User"
  }
}

Response (401):
{
  "success": false,
  "message": "Invalid credentials"
}
\`\`\`

---

## 3. Bulk Import Endpoints

### POST /cars/bulk-import/upload
Upload and parse Excel file for bulk import (Admin only)
\`\`\`json
Request: multipart/form-data
- file: File (Excel file .xlsx or .xls)

Response (200):
{
  "success": true,
  "data": {
    "sessionId": "import_session_123",
    "totalRows": 50,
    "validRows": 47,
    "errorRows": 3,
    "preview": [
      {
        "row": 2,
        "name": "Tesla Model S Plaid",
        "price": 129990,
        "year": 2023,
        "mileage": 0,
        "transmission": "Automatic",
        "bodyType": "Sedan",
        "fuelType": "Electric",
        "color": "Pearl White",
        "featured": true,
        "errors": []
      },
      {
        "row": 4,
        "name": "Invalid Car Entry",
        "price": "invalid_price",
        "year": 2025,
        "mileage": -100,
        "transmission": "",
        "bodyType": "Sedan",
        "fuelType": "Petrol",
        "color": "Black",
        "featured": false,
        "errors": [
          "Invalid price format",
          "Year cannot be in the future",
          "Mileage cannot be negative",
          "Transmission is required"
        ]
      }
    ],
    "errors": [
      {
        "row": 4,
        "errors": [
          "Invalid price format",
          "Year cannot be in the future",
          "Mileage cannot be negative",
          "Transmission is required"
        ]
      }
    ]
  },
  "message": "File parsed successfully"
}

Response (400):
{
  "success": false,
  "message": "Invalid file format or corrupted file",
  "errors": [
    {
      "field": "file",
      "message": "Only .xlsx and .xls files are supported"
    }
  ]
}
\`\`\`

### POST /cars/bulk-import/confirm
Confirm and execute bulk import (Admin only)
\`\`\`json
Request:
{
  "sessionId": "import_session_123",
  "importValidOnly": true
}

Response (202):
{
  "success": true,
  "data": {
    "jobId": "bulk_import_job_456",
    "estimatedTime": "2 minutes",
    "totalCarsToImport": 47
  },
  "message": "Bulk import started"
}
\`\`\`

### GET /cars/bulk-import/status/:jobId
Get bulk import job status (Admin only)
\`\`\`json
Response (200):
{
  "success": true,
  "data": {
    "jobId": "bulk_import_job_456",
    "status": "in_progress", // "pending", "in_progress", "completed", "failed"
    "progress": {
      "current": 25,
      "total": 47,
      "percentage": 53
    },
    "imported": [
      {
        "row": 2,
        "carId": 101,
        "name": "Tesla Model S Plaid",
        "status": "success"
      }
    ],
    "failed": [
      {
        "row": 15,
        "name": "BMW X5",
        "error": "Duplicate car name found"
      }
    ],
    "startedAt": "2024-01-15T10:30:00Z",
    "estimatedCompletion": "2024-01-15T10:32:00Z"
  }
}

Response (200) - When completed:
{
  "success": true,
  "data": {
    "jobId": "bulk_import_job_456",
    "status": "completed",
    "progress": {
      "current": 47,
      "total": 47,
      "percentage": 100
    },
    "summary": {
      "totalProcessed": 47,
      "successful": 45,
      "failed": 2,
      "skipped": 0
    },
    "imported": [
      // ... all successfully imported cars
    ],
    "failed": [
      {
        "row": 15,
        "name": "BMW X5",
        "error": "Duplicate car name found"
      },
      {
        "row": 23,
        "name": "Audi A8",
        "error": "Invalid VIN format"
      }
    ],
    "startedAt": "2024-01-15T10:30:00Z",
    "completedAt": "2024-01-15T10:32:15Z"
  }
}
\`\`\`

### GET /cars/bulk-import/template
Download Excel template file (Admin only)
\`\`\`json
Response (200):
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="car_import_template.xlsx"

// Returns Excel file with proper headers and sample data
\`\`\`

### DELETE /cars/bulk-import/session/:sessionId
Cancel/cleanup import session (Admin only)
\`\`\`json
Response (200):
{
  "success": true,
  "message": "Import session cancelled and cleaned up"
}
\`\`\`

---

## Excel File Format Requirements

### Required Columns:
1. **Name** (Text) - Car name/model
2. **Price** (Number) - Price in USD
3. **Year** (Number) - Manufacturing year (1900-current year)
4. **Mileage** (Number) - Mileage in miles (0 or positive)
5. **Transmission** (Text) - Transmission type
6. **Body Type** (Text) - Vehicle body type
7. **Fuel Type** (Text) - Fuel/energy type
8. **Color** (Text) - Vehicle color
9. **Featured** (Boolean) - TRUE/FALSE for featured status

### Optional Columns:
1. **Engine** (Text) - Engine specifications
2. **Horsepower** (Number) - Engine horsepower
3. **Description** (Text) - Car description
4. **VIN** (Text) - Vehicle identification number

### Validation Rules:
- **Name**: Required, max 255 characters, must be unique
- **Price**: Required, positive number, max 10,000,000
- **Year**: Required, between 1900 and current year
- **Mileage**: Required, non-negative number
- **Transmission**: Required, max 50 characters
- **Body Type**: Required, max 50 characters
- **Fuel Type**: Required, max 50 characters
- **Color**: Required, max 50 characters
- **Featured**: Optional, defaults to FALSE
- **Engine**: Optional, max 100 characters
- **Horsepower**: Optional, positive number
- **Description**: Optional, max 2000 characters
- **VIN**: Optional, must be valid VIN format if provided

### Sample Excel Data:
| Name | Price | Year | Mileage | Transmission | Body Type | Fuel Type | Color | Featured |
|------|-------|------|---------|--------------|-----------|-----------|-------|----------|
| Mercedes-Benz S-Class | 110000 | 2023 | 1500 | Automatic | Sedan | Hybrid | Black | TRUE |
| BMW 7 Series | 105000 | 2023 | 2000 | Automatic | Sedan | Petrol | White | TRUE |
| Tesla Model S | 89000 | 2023 | 500 | Automatic | Sedan | Electric | Red | FALSE |
