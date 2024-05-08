#!/bin/bash
# Copyright 2022 The Karmada Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"
SHELL_FOLDER=$(pwd)
REPO_ROOT=$(cd ../ && pwd)

source "${REPO_ROOT}"/hack/util/init.sh && util:init:init_scripts

function usage() {
    echo "This script will clean resources created by local-up-karmada.sh."
    echo "Usage: hack/local-down-karmada.sh [-k] [-h]"
    echo "Parameters:"
    echo "        k: keep the local images"
    echo "        h: print help information"
}

keep_images="false"
while getopts 'kh' OPT; do
  case $OPT in
      k) keep_images="true";;
      h)
        usage
        exit 0
        ;;
      ?)
        usage
        exit 1
        ;;
  esac
done

#step1 remove kind clusters
INFO "Start removing kind clusters"
kind delete cluster --name "${HOST_CLUSTER_NAME:-"karmada-host"}"
kind delete cluster --name "${MEMBER_CLUSTER_1_NAME:-"member1"}"
kind delete cluster --name "${MEMBER_CLUSTER_2_NAME:-"member2"}"
kind delete cluster --name "${PULL_MODE_CLUSTER_NAME:-"member3"}"
INFO "Remove kind clusters successfully."

#step2. remove kubeconfig
INFO "Start removing kubeconfig"
KUBECONFIG_PATH=${KUBECONFIG_PATH:-"${HOME}/.kube"}
MAIN_KUBECONFIG=${MAIN_KUBECONFIG:-"${KUBECONFIG_PATH}/karmada.config"}
MEMBER_CLUSTER_KUBECONFIG=${MEMBER_CLUSTER_KUBECONFIG:-"${KUBECONFIG_PATH}/members.config"}
if [ -f "${MAIN_KUBECONFIG}" ] ; then
    rm ${MAIN_KUBECONFIG}
    INFO "Remove kubeconfig ${MAIN_KUBECONFIG} successfully."
fi
if [ -f "${MEMBER_CLUSTER_KUBECONFIG}" ] ; then
    rm ${MEMBER_CLUSTER_KUBECONFIG}
    INFO "Remove kubeconfig ${MEMBER_CLUSTER_KUBECONFIG} successfully."
fi
INFO "Remove kubeconfig successfully."

#step3. remove docker images
INFO "Start removing images"
version="latest"
registry="docker.io/karmada"
images=(
  "${registry}/karmada-controller-manager:${version}"
  "${registry}/karmada-scheduler:${version}"
  "${registry}/karmada-descheduler:${version}"
  "${registry}/karmada-webhook:${version}"
  "${registry}/karmada-scheduler-estimator:${version}"
  "${registry}/karmada-aggregated-apiserver:${version}"
  "${registry}/karmada-search:${version}"
)
if [[ "${keep_images}" == "false" ]] ; then
  for ((i=0;i<${#images[*]};i++)); do
    docker rmi ${images[i]} || true
  done
  INFO "Remove images successfully."
else
  INFO "Skip removing images as required."
fi

INFO "Local Karmada is removed successfully."
