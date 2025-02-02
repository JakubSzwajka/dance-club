serve:
	pnpm run dev

compile-schema:
	curl http://localhost:8000/api/openapi.json > openapi.json
	npx openapi-typescript openapi.json  -o ./src/lib/api/schema.d.ts