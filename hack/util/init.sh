#!/bin/bash
set -euo pipefail

# All of util functions should set `set -uo pipefail`
# -u:

#todo translate
#set -euo pipefail 是一条常见的 Bash 脚本设置，用于改变脚本的默认行为。让我们逐个解释这些选项的含义：
#set -e（或者简写为 set -o errexit）启用错误终止功能。当设置了 set -e 后，脚本会在任何非零返回值的命令处立即终止。这有助于在脚本中及时捕获并处理错误。
#set -u（或者简写为 set -o nounset）启用未定义变量检查。当设置了 set -u 后，如果脚本中使用了未定义的变量，会导致脚本终止执行。这有助于避免在使用未初始化或不存在的变量时出现错误。
#set -o pipefail 设置管道命令的返回值。在默认情况下，管道命令的返回值是最后一个命令的返回值。但是使用 set -o pipefail 后，如果管道中的任何一个命令返回了非零值，整个管道的返回值将是非零值。这有助于更好地处理管道中的错误情况。
#set -o 是用来设置或取消设置各种选项的 Bash 内置命令。
#将这些选项组合在一起，set -euo pipefail 用于在 Bash 脚本中启用严格的错误处理和错误检查。这样可以帮助开发人员更早地发现和处理潜在的问题，并提高脚本的可靠性。
#以下是一个示例，演示了如何使用 set -euo pipefail：

cd "$(dirname "${BASH_SOURCE[0]}")"
SHELL_FOLDER=$(pwd)
REPO_ROOT=$(cd ../../ && pwd)




function util:init:init_scripts() {
  for script in "b-log.sh" "verify.sh" "constant.sh" "misc.sh"
  do
    # shellcheck disable=SC1090
    source "${REPO_ROOT}"/hack/util/"${script}"
  done
  LOG_LEVEL_DEBUG
}

function util:init:internal_init_scripts() {
  source "${REPO_ROOT}"/hack/util/b-log.sh
  LOG_LEVEL_DEBUG
}
