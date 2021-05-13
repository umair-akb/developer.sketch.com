#!/bin/sh

LOCAL_ASSISTANTS_PATH=_deps/sketch-assistants
LOCAL_ASSISTANTS_OUT_PATH=_assistants/docs
REL_ASSISTANTS_PACKAGE_UTILS=packages/utils/src
REL_ASSISTANTS_PACKAGE_TYPES=packages/types/src
SKIP_INSTALL=0
SKIP_FETCH=0

# Loop through command arguments
while [ "$1" != "" ];
do
   case $1 in
   -t  | --docs-only ) shift
                          SKIP_INSTALL=1
                          SKIP_FETCH=1
                		      ;;
   -NI  | --skip-install )  shift
   						            SKIP_INSTALL=1
			                    ;;
   -NF  | --skip-fetch  )  shift
                          SKIP_FETCH=1
                          ;;
   *)
    shift
                          ;;
    esac
done

TYPEDOC_BIN=`which typedoc &>/dev/null`

if [[ $? -ne 0 ]]; then

  TYPEDOC_BIN="$PWD/node_modules/typedoc/bin/typedoc"

  if ! [ -x "$(command -v $TYPEDOC_BIN)" ]; then
    echo "Error: typedoc not found on system. Did you run \"npm install\"?" >&2
    exit 1
  fi

fi

if [[ $SKIP_FETCH -eq 0 ]]; then
  read -e -p "Enter path for sketch-assistants repo (or empty for git clone):" ASSISTANTS_PATH

  ASSISTANTS_PATH=${ASSISTANTS_PATH:-$LOCAL_ASSISTANTS_PATH}

  if [[ ! -d $ASSISTANTS_PATH ]]; then

    git clone git@github.com:sketch-hq/sketch-assistants.git $ASSISTANTS_PATH

    if [[ $? -ne 0 ]]; then
      echo "Failed to fetch sketch-assistants repo"
      exit 1
    else
      echo "Successfully fetched sketch-assistants repo"
    fi
  else
    echo "sketch-assistants repo found. Git clone skipped."
  fi
else
  echo "Fetching sketch-assistants repo skipped"

  ASSISTANTS_PATH=$LOCAL_ASSISTANTS_PATH

  if [[ ! -d $ASSISTANTS_PATH ]]; then
    echo "Error: local assistants path not found"
    exit 1
  fi
fi

ABS_ASSISTANTS_PATH=$([[ "$ASSISTANTS_PATH" = /* ]] && echo "$ASSISTANTS_PATH" || echo "$PWD/$ASSISTANTS_PATH")
ASSISTANTS_PACKAGE_TYPES=$ABS_ASSISTANTS_PATH/$REL_ASSISTANTS_PACKAGE_TYPES
ASSISTANTS_PACKAGE_UTILS=$ABS_ASSISTANTS_PATH/$REL_ASSISTANTS_PACKAGE_UTILS

ABS_ASSISTANTS_PKG_TYPES=$([[ "$ASSISTANTS_PACKAGE_TYPES" = /* ]] && echo "$ASSISTANTS_PACKAGE_TYPES" || echo "$PWD/$ASSISTANTS_PACKAGE_TYPES")
ABS_ASSISTANTS_PKG_UTILS=$([[ "$ASSISTANTS_PACKAGE_UTILS" = /* ]] && echo "$ASSISTANTS_PACKAGE_UTILS" || echo "$PWD/$ASSISTANTS_PACKAGE_UTILS")

if [[ $SKIP_INSTALL -eq 0 ]]; then
  echo "Installing sketch-assistants dependency ..."

  CMD_YARN="yarn"
  CMD_NPM="npm install"
  CMD_YARN_BUILD="yarn build"

  INSTALL_RESULT=$(cd "$ABS_ASSISTANTS_PATH"; $CMD_NPM >&2)
  if [[ $? -ne 0 ]]; then
    echo "Failed to install sketch-assistants"
    exit 1
  fi

  # Install packages
  echo "Installing sketch-assistants types..."
  $(cd "$ABS_ASSISTANTS_PKG_TYPES"; npm install >&2)
  if [[ $? -ne 0 ]]; then
    echo "Failed to install sketch-assistants/packages/types"
    exit 1
  fi

  echo "Installing sketch-assistants utils..."
  $(cd "$ABS_ASSISTANTS_PKG_UTILS"; npm install >&2)
  if [[ $? -ne 0 ]]; then
    echo "Failed to install sketch-assistants/packages/utils"
    exit 1
  fi

  echo "Building yarn packages workspaces"
  $(cd "$ABS_ASSISTANTS_PATH"; yarn install >&2; sh build.sh >&2)
  if [[ $? -ne 0 ]]; then
    echo "Failed to build yarn workspaces"
    exit 1
  fi

  echo "Successfully installed sketch-assistants dependency"
else
  echo "Skipped installing sketch-assistants dependency"
fi

echo "Generating TypeDoc documentation ..."

if [[ -d $LOCAL_ASSISTANTS_OUT_PATH ]]; then
  rm -rf $LOCAL_ASSISTANTS_OUT_PATH
fi

ABS_LOCAL_ASSISTANTS_OUT=$([[ "$LOCAL_ASSISTANTS_OUT_PATH" = /* ]] && echo "$LOCAL_ASSISTANTS_OUT_PATH" || echo "$PWD/$LOCAL_ASSISTANTS_OUT_PATH")

TYPEDOC_PARAMS="--excludeExternals --exclude \"**/**/*test*/*\""

CMD_TYPEDOC_PACKAGE_TYPES="$TYPEDOC_BIN $TYPEDOC_PARAMS --out $ABS_LOCAL_ASSISTANTS_OUT/types $ABS_ASSISTANTS_PKG_TYPES"
CMD_TYPEDOC_PACKAGE_UTILS="$TYPEDOC_BIN $TYPEDOC_PARAMS --out $ABS_LOCAL_ASSISTANTS_OUT/utils $ABS_ASSISTANTS_PKG_UTILS"

$(cd "$ABS_ASSISTANTS_PATH"; $CMD_TYPEDOC_PACKAGE_TYPES >&2)

$(cd "$ABS_ASSISTANTS_PATH"; $CMD_TYPEDOC_PACKAGE_UTILS >&2)


