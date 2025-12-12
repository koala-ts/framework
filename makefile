IMAGE_NAME ?= koalats-framework

.PHONY: build bash start rebuild

start: build bash

build:
	@if ! docker images | grep -q $(IMAGE_NAME); then \
		docker build -t $(IMAGE_NAME) . ; \
	fi

bash:
	docker run --rm -it --name $(IMAGE_NAME)-container -v ${PWD}:/app $(IMAGE_NAME) /bin/sh

rebuild:
	docker build --no-cache -t $(IMAGE_NAME) .
