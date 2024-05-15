GOOS 					?= $(shell go env GOOS)
GOARCH 					?= $(shell go env GOARCH)
VERSION 				?= $(shell hack/version.sh)
# Images management
REGISTRY				?= "docker.io/karmada"
REGISTRY_USER_NAME  	?= ""
REGISTRY_PASSWORD   	?= ""
REGISTRY_SERVER_ADDRESS ?= ""

TARGETS := karmada-dashboard-api


# Build binary.
#
# Args:
#   GOOS:   OS to build.
#   GOARCH: Arch to build.
#
# Example:
#   make
#   make all
#   make karmada-dashboard-api GOOS=linux
.PHONY: $(TARGETS)
$(TARGETS):
	BUILD_PLATFORMS=$(GOOS)/$(GOARCH) hack/build.sh $@


# Build image.
#
# Args:
#   GOARCH:      Arch to build.
#   OUTPUT_TYPE: Destination to save image(docker/registry).
#
# Example:
#   make images
#   make image-karmada-dashboard-api
#   make image-karmada-dashboard-api GOARCH=arm64
IMAGE_TARGET=$(addprefix image-, $(TARGETS))
.PHONY: $(IMAGE_TARGET)
$(IMAGE_TARGET):
	set -e;\
	target=$$(echo $(subst image-,,$@));\
	make $$target GOOS=linux;\
	VERSION=$(VERSION) REGISTRY=$(REGISTRY) BUILD_PLATFORMS=linux/$(GOARCH) hack/docker.sh $$target