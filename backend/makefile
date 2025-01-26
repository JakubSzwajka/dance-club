serve:
	python3 manage.py runserver

makemigrations:
	python3 manage.py makemigrations

migrate: 
	python3 manage.py migrate

createsuperuser:
	python3 manage.py createsuperuser


ci:
	ruff check --fix
	ruff format 
	pyright .

reseed: 
	rm -f db.sqlite3
	python3 manage.py migrate
	python3 manage.py seed_test_data
