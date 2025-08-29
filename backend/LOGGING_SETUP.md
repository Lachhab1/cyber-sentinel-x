# XAI-Tech Backend Logging & Monitoring Setup

## Overview

This backend now includes a comprehensive logging and monitoring solution using:

- **Grafana**: Dashboard and visualization
- **Loki**: Log aggregation and storage
- **Promtail**: Log collection and shipping
- **Winston**: Structured logging in the application

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Backend   │───▶│  Promtail   │───▶│    Loki     │◀───│   Grafana   │
│  (Winston)  │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Quick Start

1. **Start the complete stack:**

   ```bash
   ./start-dev.sh
   ```

2. **Access Grafana:**
   - URL: http://localhost:3000
   - Username: admin
   - Password: admin123

3. **View logs in Grafana:**
   - Go to Explore
   - Select Loki datasource
   - Query: `{job="applogs"}`

## Log Structure

### Application Logs

Logs are structured in JSON format with the following fields:

```json
{
  "time": "2024-01-01T12:00:00.000Z",
  "level": "info",
  "message": "User logged in successfully",
  "context": "AuthService",
  "userId": "123",
  "email": "user@example.com"
}
```

### Log Levels

- **error**: Application errors and exceptions
- **warn**: Warning messages
- **info**: General information
- **debug**: Debug information
- **verbose**: Verbose logging

## Using the Logger Service

### Basic Usage

```typescript
import { LoggerService } from "../common/services/logger.service";

@Injectable()
export class MyService {
  constructor(private logger: LoggerService) {}

  async someMethod() {
    this.logger.log("This is an info message", "MyService");
    this.logger.warn("This is a warning", "MyService");
    this.logger.error("This is an error", "MyService");
  }
}
```

### Structured Logging

```typescript
// Log with metadata
this.logger.logWithMetadata(
  "User action performed",
  { userId: "123", action: "login", ip: "192.168.1.1" },
  "AuthService"
);

// Log errors with context
this.logger.logErrorWithMetadata(
  "Database connection failed",
  error,
  { database: "postgres", operation: "connect" },
  "DatabaseService"
);
```

## Grafana Dashboards

### Default Dashboard

The application includes a pre-configured dashboard with:

- Log volume over time
- Log levels distribution
- Recent logs viewer

### Custom Queries

Common Loki queries for the application:

```logql
# All application logs
{job="applogs"}

# Error logs only
{job="applogs", level="error"}

# Logs from specific service
{job="applogs", context="AuthService"}

# Logs containing specific text
{job="applogs"} |= "login"

# Logs from last hour
{job="applogs"} | json | timestamp > now() - 1h
```

## Configuration

### Environment Variables

```env
# Logging Configuration
LOG_LEVEL=info
LOG_DIR=logs

# Grafana Configuration
GRAFANA_URL=http://localhost:3000
LOKI_URL=http://localhost:3100
```

### Log Rotation

Logs are automatically rotated:

- Maximum file size: 20MB
- Retention period: 14 days
- Daily rotation with date pattern

## Monitoring Alerts

### Setting up Alerts in Grafana

1. Go to Alerting in Grafana
2. Create a new alert rule
3. Use Loki queries to define conditions
4. Configure notification channels

### Example Alert Queries

```logql
# High error rate
rate({job="applogs", level="error"}[5m]) > 0.1

# Failed login attempts
rate({job="applogs"} |= "Failed login attempt"[5m]) > 5
```

## Troubleshooting

### Common Issues

1. **Grafana not accessible:**
   - Check if Docker containers are running: `docker-compose ps`
   - Check container logs: `docker-compose logs grafana`

2. **No logs appearing:**
   - Verify Promtail is running: `docker-compose logs promtail`
   - Check log file permissions
   - Verify Loki is accessible: `curl http://localhost:3100/ready`

3. **High log volume:**
   - Adjust log level in environment variables
   - Review log rotation settings
   - Consider log filtering

### Useful Commands

```bash
# View all container logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Check service status
docker-compose ps

# Restart services
docker-compose restart

# Clean up and restart
docker-compose down && docker-compose up -d
```

## Performance Considerations

1. **Log Volume**: Monitor log volume and adjust retention policies
2. **Storage**: Ensure sufficient disk space for log storage
3. **Query Performance**: Use appropriate time ranges and filters in Grafana
4. **Resource Usage**: Monitor CPU and memory usage of logging stack

## Security

1. **Access Control**: Change default Grafana credentials in production
2. **Network Security**: Use reverse proxy and SSL in production
3. **Log Sensitivity**: Avoid logging sensitive information (passwords, tokens)
4. **Audit Logs**: Monitor access to logging infrastructure

## Production Deployment

For production deployment:

1. Use external PostgreSQL database
2. Configure persistent volumes for logs
3. Set up proper authentication for Grafana
4. Configure log retention policies
5. Set up monitoring alerts
6. Use SSL/TLS for all connections
