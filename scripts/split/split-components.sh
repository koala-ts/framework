set -e

# Process every generated repository declared in splitsh.json.
while IFS=$'\t' read -r component prefix; do
  split_commit=$(splitsh-lite --prefix="$prefix")
  echo "$component $split_commit"

  if [ "$SYNC" != true ]; then
    continue
  fi

  remote_url="https://x-access-token:${SPLITTER_TOKEN}@github.com/koala-ts/${component}.git"

  if [ "$SOURCE_TYPE" = tag ]; then
    # Major/minor `.0` releases tag every component; unchanged patch releases are skipped.
    is_minor_or_major_release=false
    if [[ "$SOURCE_BRANCH" =~ ^v?[0-9]+\.[0-9]+\.0($|[-+]) ]]; then
      is_minor_or_major_release=true
    fi

    if [ "$is_minor_or_major_release" = false ] && previous_tag=$(git describe --tags --abbrev=0 "${SOURCE_BRANCH}^"); then
      if git diff --quiet "$previous_tag" "$SOURCE_BRANCH" -- "$prefix"; then
        echo "Skipping $component@$SOURCE_BRANCH because it has not changed since $previous_tag."
        continue
      fi
    fi

    git push "$remote_url" "${split_commit}:refs/tags/${SOURCE_BRANCH}"
    continue
  fi

  git push "$remote_url" "${split_commit}:refs/heads/${SOURCE_BRANCH}"
done < <(node -p "Object.entries(require('./splitsh.json').subtrees).map(([name, path]) => name + '\\t' + path).join('\\n')")
