commit:
	npx git-cz 

run-dev-wasm:
	npm run build:wasm
	npm run dev

build-prod:
	npm run build

run-prod:
	cp -fr ./.next/static .next/standalone/.next/static
	cp -fr public .next/standalone/public
	node .next/standalone/server.js

.PHONY: commit