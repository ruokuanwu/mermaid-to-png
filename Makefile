.PHONY: build clean package install test

EXT_DIR := $(shell pwd)
OUT_DIR := out
SRC_DIR := src

build:
	pnpm compile

watch:
	pnpm run watch

clean:
	rm -rf $(OUT_DIR)

package: build
	npx vsce package --no-yarn --allow-missing-repository

package-prepass: build
	npx vsce package --no-yarn --passphrase

install: package
	code --install-extension mermaid-to-png-*.vsix --force

test:
	@echo "No tests configured"
