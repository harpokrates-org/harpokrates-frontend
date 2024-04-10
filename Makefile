commit:
	npx git-cz 

run-dev-wasm:
	npm run build:wasm
	npm run dev

.PHONY: commit