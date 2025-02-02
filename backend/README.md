# Dance DNA - Backend

Backend service for Dance DNA application built with Django.

## Prerequisites

- Python 3.11 or higher
- Poetry (Python package manager)

## Installation

1. Install Poetry if you haven't already:
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

2. Add Poetry to your PATH (add this to your shell profile):
```bash
export PATH="$HOME/.local/bin:$PATH"
```

3. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

4. Install dependencies using Poetry:
```bash
poetry install
```

## Development

1. Activate the virtual environment:
```bash
poetry shell
```

2. Run migrations:
```bash
poetry run python manage.py migrate
```

3. Start the development server:
```bash
poetry run python manage.py runserver
```

## Managing Dependencies

- Add a new package:
```bash
poetry add package-name
```

- Add a development package:
```bash
poetry add --group dev package-name
```

- Update all packages:
```bash
poetry update
```

- Show installed packages:
```bash
poetry show
```

## Code Quality

This project uses Ruff for linting and formatting. To run:

```bash
poetry run ruff check .  # for linting
poetry run ruff format .  # for formatting
```

## Testing

Run tests using pytest:

```bash
poetry run pytest
```

## Project Structure

- `accounts/` - User authentication and management
- `classes/` - Dance classes management
- `mydanceclub/` - Core application logic 