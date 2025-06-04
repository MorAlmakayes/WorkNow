blue()   { echo -e "\033[1;34m$1\033[0m"; }
green()  { echo -e "\033[1;32m$1\033[0m"; }
red()    { echo -e "\033[1;31m$1\033[0m"; }

# === Cleanup function ===
cleanup() {
  echo
  blue "🧹 Cleaning up..."
  if [ -n "$REACT_PID" ]; then
    kill $REACT_PID 2>/dev/null
    blue "🛑 React stopped (PID: $REACT_PID)"
  fi
  if [ -n "$FLASK_PID" ]; then
    kill $FLASK_PID 2>/dev/null
    blue "🛑 Flask stopped (PID: $FLASK_PID)"
  fi
  exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT

# === Start Flask backend ===
blue "🔄 Starting Flask backend..."

cd server || exit 1
source venv/bin/activate

PORT=5001
while lsof -i:$PORT >/dev/null 2>&1; do
  red "⚠️  Port $PORT in use, trying next..."
  PORT=$((PORT + 1))
done

export FLASK_APP=app.py
export FLASK_ENV=development
export FLASK_PORT=$PORT

python3 app.py --port=$PORT &
FLASK_PID=$!
cd ..

sleep 2
if ! curl -s "http://localhost:$PORT" >/dev/null; then
  red "❌ Flask failed to start"
  cleanup
fi
green "🟢 Flask running on port $PORT"

# === Update React proxy ===
PACKAGE_JSON="client/package.json"
PROXY_LINE="  \"proxy\": \"http://localhost:$PORT\","
blue "🔧 Updating React proxy..."
sed -i.bak '/\"proxy\":/d' "$PACKAGE_JSON"
sed -i.bak "s/}$/,\n$PROXY_LINE\n}/" "$PACKAGE_JSON"

# === Start React frontend ===
cd client || exit 1
export NODE_OPTIONS=--openssl-legacy-provider

blue "🚀 Starting React frontend..."
npm start &
REACT_PID=$!

# === Wait and clean ===
wait $REACT_PID
cleanup