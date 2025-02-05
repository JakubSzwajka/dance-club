serve:
	uv run manage.py runserver

makemigrations:
	uv run manage.py makemigrations

migrate: 
	uv run manage.py migrate

createsuperuser:
	uv run manage.py createsuperuser


ci:
	ruff check --fix
	ruff format 
	pyright .

reseed: 
	rm -f db.sqlite3
	rm -rf reviews/migrations/00*
	rm -rf accounts/migrations/00*
	rm -rf classes/migrations/00*
	
	uv run manage.py makemigrations
	uv run manage.py migrate
	DJANGO_SUPERUSER_PASSWORD=Test1234! DJANGO_SUPERUSER_EMAIL=szwajkajakub@gmail.com uv run manage.py createsuperuser --noinput
	uv run manage.py seed_test_data
