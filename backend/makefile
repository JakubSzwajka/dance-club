serve:
	uv run manage.py runserver

serve-docker:
	make migrate
	make createsuperuser
	make serve

makemigrations:
	uv run manage.py makemigrations

migrate: 
	uv run manage.py migrate

createsuperuser:
	DJANGO_SUPERUSER_PASSWORD=Test1234! DJANGO_SUPERUSER_EMAIL=szwajkajakub@gmail.com DJANGO_SUPERUSER_USERNAME=admin-szwajka uv run manage.py createsuperuser --noinput


ci:
	ruff check --fix
	ruff format 
	pyright .



seed-db:
	uv run manage.py seed_test_data_google --yaml-file ./dance_schools_20250206_224702.yaml

remove-migrations:
	rm -rf reviews/migrations/00*
	rm -rf accounts/migrations/00*
	rm -rf classes/migrations/00*

reseed: 
	rm -f db.sqlite3
	make remove-migrations
	
	uv run manage.py makemigrations
	uv run manage.py migrate
	make createsuperuser
	make seed-db

cleanup-db:
	uv run manage.py cleanup_database
