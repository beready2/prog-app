#!/usr/bin/env bash
# Non-régression : compare le rendu des séances à la référence de tests/baseline/.
# Usage : bash tests/run.sh            → compare
#         bash tests/run.sh --update   → régénère la référence (seulement après un changement VOULU et vérifié)
set -e; cd "$(dirname "$0")/.."
python3 tests/check.py
CAS="2026-11-10:maison 2026-11-17:maison 2026-11-24:maison 2026-12-01:maison 2026-12-10:maison 2026-12-10:lyon"
rc=0
for c in $CAS; do d=${c%%:*}; m=${c##*:}; out=$(mktemp)
  node tests/dump.js index.html "$d" "$m" "$out"
  grep -q 'ERRS \[\]' "$out" || { echo "ERREUR JS : $d $m"; tail -1 "$out"; rc=1; }
  if [ "$1" = "--update" ]; then cp "$out" "tests/baseline/$d-$m.txt"; echo "référence mise à jour : $d $m"
  elif ! diff -q "tests/baseline/$d-$m.txt" "$out" >/dev/null; then echo "DIFFÉRENCE : $d $m"; diff "tests/baseline/$d-$m.txt" "$out" | head -20; rc=1
  else echo "identique : $d $m"; fi
done
exit $rc
