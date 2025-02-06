# My Dance Club - Backend

Django-based backend using SQLite for development (no additional database setup needed).

## Setup

1. Install Python 3.13
2. Install uv: `pip install uv`
3. Install dependencies: `uv pip install --system`

## Development

Common commands:
```bash
make serve          # Start server
make reseed        # Reset database with test data
make ci            # Run linting
```

## Docker

```bash
docker build -t my-dance-club-backend .
docker run -p 8000:8000 my-dance-club-backend
``` 
