IMAGE_NAME ?= koalats-framework
CONTAINER_NAME ?= $(IMAGE_NAME)-container
HOST_PORT ?= 3000

.PHONY: build bash start stop

start:
	@if docker ps --format '{{.Names}}' | grep -qx $(CONTAINER_NAME); then \
		echo "$(CONTAINER_NAME) is already running"; \
	else \
		docker run --rm --detach --name $(CONTAINER_NAME) --publish $(HOST_PORT):3000 --volume $(CURDIR):/app $(IMAGE_NAME) tail -f /dev/null; \
	fi

build:
	docker build --no-cache -t $(IMAGE_NAME) .

bash:
	docker exec --interactive --tty $(CONTAINER_NAME) /bin/sh

stop:
	@if docker container inspect $(CONTAINER_NAME) >/dev/null 2>&1; then \
		docker rm --force $(CONTAINER_NAME); \
	fi
