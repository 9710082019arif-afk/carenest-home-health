#!/usr/bin/env bash
# Mongo dump (Emergent) → restore (AWS).
#
# Dump (run where Emergent MONGO_URL is available):
#   EMERGENT_MONGO_URL=... EMERGENT_DB_NAME=... ./mongo_migrate.sh dump
#
# Restore (on EC2):
#   MONGO_URL=... TARGET_DB=carenest DUMP_DIR=./dump/olddb ./mongo_migrate.sh restore
set -euo pipefail

CMD="${1:-}"
TS=$(date +%Y%m%d%H%M%S)

dump() {
  : "${EMERGENT_MONGO_URL:?set EMERGENT_MONGO_URL}"
  : "${EMERGENT_DB_NAME:?set EMERGENT_DB_NAME}"
  OUT="${OUT_DIR:-./carenest-mongo-dump-$TS}"
  mkdir -p "$OUT"
  mongodump --uri="$EMERGENT_MONGO_URL" --db="$EMERGENT_DB_NAME" --out="$OUT"
  tar -czf "${OUT}.tgz" -C "$OUT" .
  echo "Dump written to ${OUT}.tgz"
}

restore() {
  : "${MONGO_URL:?set MONGO_URL}"
  : "${DUMP_DIR:?set DUMP_DIR to extracted dump/<db> folder}"
  TARGET_DB="${TARGET_DB:-carenest}"
  SOURCE_DB="${SOURCE_DB:-}"
  if [[ -z "$SOURCE_DB" ]]; then
    SOURCE_DB=$(basename "$DUMP_DIR")
  fi
  mongorestore --uri="$MONGO_URL" --drop \
    --nsFrom="${SOURCE_DB}.*" --nsTo="${TARGET_DB}.*" \
    "$DUMP_DIR"
  echo "Restore complete → $TARGET_DB"
  mongosh "$MONGO_URL/$TARGET_DB" --quiet --eval '
    ["leads","appointments","contacts","careers","newsletter","chat_messages"].forEach(c=>{
      print(c, db.getCollection(c).countDocuments({}))
    })
  '
}

case "$CMD" in
  dump) dump ;;
  restore) restore ;;
  *)
    echo "Usage: $0 dump|restore" >&2
    exit 1
    ;;
esac
