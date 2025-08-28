# 📚 XAI-Tech Cybersecurity Platform - API Documentation

## Overview

The XAI-Tech Cybersecurity Platform provides a comprehensive REST API for managing security incidents, threats, projects, and reports. This documentation covers all available endpoints, request/response formats, and authentication methods.

## Base URL

- **Development**: `http://localhost:4000/api`
- **Production**: `https://api.xai-tech.com/api`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "user"
  }
}
```

## Common Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-27T10:30:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": [
      {
        "field": "field_name",
        "message": "Field-specific error"
      }
    ]
  },
  "timestamp": "2024-01-27T10:30:00Z"
}
```

## Authentication Endpoints

### POST /auth/login

Authenticate a user and receive a JWT token.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "access_token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "displayName": "string",
    "role": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Status Codes:**

- `200` - Login successful
- `401` - Invalid credentials
- `422` - Validation error

### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "email": "string",
  "password": "string",
  "displayName": "string"
}
```

**Response:**

```json
{
  "access_token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "displayName": "string",
    "role": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Status Codes:**

- `201` - Registration successful
- `409` - User already exists
- `422` - Validation error

### POST /auth/refresh

Refresh the JWT token.

**Headers:**

```
Authorization: Bearer <current-token>
```

**Response:**

```json
{
  "access_token": "string"
}
```

**Status Codes:**

- `200` - Token refreshed
- `401` - Invalid token

### GET /auth/profile

Get the current user's profile.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": "string",
  "email": "string",
  "displayName": "string",
  "role": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Status Codes:**

- `200` - Profile retrieved
- `401` - Unauthorized

## Incidents Endpoints

### GET /incidents

Get all incidents with optional filtering.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `status` (optional) - Filter by status: `open`, `investigating`, `resolved`, `closed`
- `projectId` (optional) - Filter by project ID
- `limit` (optional) - Number of results (default: 50)
- `offset` (optional) - Number of results to skip (default: 0)

**Response:**

```json
[
  {
    "id": "string",
    "title": "string",
    "status": "string",
    "projectId": "string",
    "project": {
      "id": "string",
      "name": "string"
    },
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### POST /incidents

Create a new incident.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "string",
  "projectId": "string" // optional
}
```

**Response:**

```json
{
  "id": "string",
  "title": "string",
  "status": "open",
  "projectId": "string",
  "project": {
    "id": "string",
    "name": "string"
  },
  "createdAt": "string",
  "updatedAt": "string"
}
```

### GET /incidents/:id

Get a specific incident by ID.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": "string",
  "title": "string",
  "status": "string",
  "projectId": "string",
  "project": {
    "id": "string",
    "name": "string"
  },
  "createdAt": "string",
  "updatedAt": "string"
}
```

### PATCH /incidents/:id/status

Update incident status.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "investigating" | "resolved" | "closed"
}
```

**Response:**

```json
{
  "id": "string",
  "title": "string",
  "status": "string",
  "projectId": "string",
  "project": {
    "id": "string",
    "name": "string"
  },
  "createdAt": "string",
  "updatedAt": "string"
}
```

### DELETE /incidents/:id

Delete an incident.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Incident deleted successfully"
}
```

## Threats Endpoints

### GET /threats

Get all threats with optional filtering.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `severity` (optional) - Filter by severity: `low`, `medium`, `high`, `critical`
- `limit` (optional) - Number of results (default: 50)
- `offset` (optional) - Number of results to skip (default: 0)

**Response:**

```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "severity": "string",
    "createdAt": "string"
  }
]
```

### POST /threats

Create a new threat.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "severity": "low" | "medium" | "high" | "critical"
}
```

**Response:**

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "severity": "string",
  "createdAt": "string"
}
```

### GET /threats/:id

Get a specific threat by ID.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "severity": "string",
  "createdAt": "string"
}
```

### PUT /threats/:id

Update a threat.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "severity": "low" | "medium" | "high" | "critical"
}
```

**Response:**

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "severity": "string",
  "createdAt": "string"
}
```

### DELETE /threats/:id

Delete a threat.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Threat deleted successfully"
}
```

### GET /threats/analysis

Get AI-powered threat analysis.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "analysis": {
    "totalThreats": 42,
    "severityBreakdown": {
      "critical": 5,
      "high": 12,
      "medium": 15,
      "low": 10
    },
    "recentThreats": [
      {
        "id": "string",
        "title": "string",
        "severity": "string",
        "createdAt": "string"
      }
    ],
    "aiRecommendations": [
      "Implement additional input validation",
      "Enable rate limiting on API endpoints",
      "Update security headers configuration"
    ]
  },
  "message": "AI analysis completed successfully"
}
```

## Projects Endpoints

### GET /projects

Get all projects.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "ownerId": "string",
    "owner": {
      "id": "string",
      "displayName": "string"
    },
    "incidents": [
      {
        "id": "string",
        "title": "string",
        "status": "string"
      }
    ],
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### POST /projects

Create a new project.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "string",
  "description": "string" // optional
}
```

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "ownerId": "string",
  "owner": {
    "id": "string",
    "displayName": "string"
  },
  "incidents": [],
  "createdAt": "string",
  "updatedAt": "string"
}
```

### GET /projects/:id

Get a specific project by ID.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "ownerId": "string",
  "owner": {
    "id": "string",
    "displayName": "string"
  },
  "incidents": [
    {
      "id": "string",
      "title": "string",
      "status": "string"
    }
  ],
  "createdAt": "string",
  "updatedAt": "string"
}
```

### PUT /projects/:id

Update a project.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "string",
  "description": "string" // optional
}
```

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "ownerId": "string",
  "owner": {
    "id": "string",
    "displayName": "string"
  },
  "incidents": [
    {
      "id": "string",
      "title": "string",
      "status": "string"
    }
  ],
  "createdAt": "string",
  "updatedAt": "string"
}
```

### DELETE /projects/:id

Delete a project.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Project deleted successfully"
}
```

## Reports Endpoints

### POST /reports/generate

Generate a new report.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "string",
  "type": "summary" | "comprehensive" | "detailed",
  "projectId": "string" // optional
}
```

**Response:**

```json
{
  "id": "string",
  "title": "string",
  "type": "string",
  "message": "Report generated successfully"
}
```

### GET /reports/:id/download

Download a generated report.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "createdAt": "string",
  "downloadUrl": "string"
}
```

## Search Endpoints

### GET /search

Perform a global search across all entities.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `q` (required) - Search query string

**Response:**

```json
{
  "threats": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "severity": "string",
      "createdAt": "string"
    }
  ],
  "incidents": [
    {
      "id": "string",
      "title": "string",
      "status": "string",
      "project": {
        "id": "string",
        "name": "string"
      },
      "createdAt": "string"
    }
  ],
  "projects": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "owner": {
        "id": "string",
        "displayName": "string"
      },
      "createdAt": "string"
    }
  ],
  "totalResults": 15
}
```

### GET /search/threats

Search specifically in threats.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `q` (required) - Search query string

**Response:**

```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "severity": "string",
    "createdAt": "string"
  }
]
```

### GET /search/incidents

Search specifically in incidents.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `q` (required) - Search query string

**Response:**

```json
[
  {
    "id": "string",
    "title": "string",
    "status": "string",
    "project": {
      "id": "string",
      "name": "string"
    },
    "createdAt": "string"
  }
]
```

## Users Endpoints

### GET /users

Get all users (admin only).

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": "string",
    "email": "string",
    "displayName": "string",
    "role": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### GET /users/:id

Get a specific user by ID.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": "string",
  "email": "string",
  "displayName": "string",
  "role": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### PUT /users/:id

Update a user.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "displayName": "string",
  "role": "string" // optional
}
```

**Response:**

```json
{
  "id": "string",
  "email": "string",
  "displayName": "string",
  "role": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### DELETE /users/:id

Delete a user (admin only).

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "User deleted successfully"
}
```

## Error Codes

| Code               | Description               |
| ------------------ | ------------------------- |
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED`     | Authentication required   |
| `FORBIDDEN`        | Insufficient permissions  |
| `NOT_FOUND`        | Resource not found        |
| `CONFLICT`         | Resource already exists   |
| `INTERNAL_ERROR`   | Server error              |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **Other endpoints**: 100 requests per minute per user

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643270400
```

## Pagination

For endpoints that return lists, pagination is supported:

**Query Parameters:**

- `limit` - Number of results per page (default: 50, max: 100)
- `offset` - Number of results to skip (default: 0)

**Response Headers:**

```
X-Total-Count: 150
X-Page-Count: 3
```

## WebSocket Support

For real-time updates, WebSocket connections are available at:

```
ws://localhost:4000/ws
```

**Authentication:**
Send the JWT token as a query parameter:

```
ws://localhost:4000/ws?token=<jwt-token>
```

**Events:**

- `incident.created` - New incident created
- `incident.updated` - Incident status changed
- `threat.created` - New threat detected
- `threat.updated` - Threat information updated

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @xai-tech/api-client
```

```typescript
import { XAITechClient } from "@xai-tech/api-client";

const client = new XAITechClient({
  baseUrl: "http://localhost:4000/api",
  token: "your-jwt-token",
});

// Get all incidents
const incidents = await client.incidents.getAll();

// Create a new threat
const threat = await client.threats.create({
  title: "SQL Injection Attempt",
  description: "Multiple SQL injection payloads detected",
  severity: "high",
});
```

### Python

```bash
pip install xai-tech-api
```

```python
from xai_tech import XAITechClient

client = XAITechClient(
    base_url='http://localhost:4000/api',
    token='your-jwt-token'
)

# Get all incidents
incidents = client.incidents.get_all()

# Create a new threat
threat = client.threats.create(
    title='SQL Injection Attempt',
    description='Multiple SQL injection payloads detected',
    severity='high'
)
```

## Testing the API

### Using curl

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get incidents (with token)
curl -X GET http://localhost:4000/api/incidents \
  -H "Authorization: Bearer <your-token>"

# Create a threat
curl -X POST http://localhost:4000/api/threats \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Threat","description":"Test description","severity":"medium"}'
```

### Using Postman

1. Import the API collection from the `/docs/postman` directory
2. Set the base URL to `http://localhost:4000/api`
3. Use the login endpoint to get a token
4. Set the token in the Authorization header for subsequent requests

## API Versioning

The API uses URL versioning. Current version is v1:

```
http://localhost:4000/api/v1/incidents
```

Future versions will be available at:

- v2: `http://localhost:4000/api/v2/`
- v3: `http://localhost:4000/api/v3/`

## Changelog

### v1.0.0 (Current)

- Initial API release
- Authentication and authorization
- CRUD operations for incidents, threats, projects
- Report generation
- Global search functionality
- Real-time WebSocket support

## Support

For API support and questions:

- **Documentation**: [API Docs](https://docs.xai-tech.com/api)
- **GitHub Issues**: [Report bugs](https://github.com/xai-tech/cyber-sentinel-x/issues)
- **Email**: api-support@xai-tech.com
- **Discord**: [Join our community](https://discord.gg/xai-tech)

---

**API Version**: v1.0.0  
**Last Updated**: January 27, 2024
