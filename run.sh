# === Utility functions ===
blue()   { echo -e "\033[1;34m$1\033[0m"; }
green()  { echo -e "\033[1;32m$1\033[0m"; }
red()    { echo -e "\033[1;31m$1\033[0m"; }

# === Step 1: Find available port for Flask ===
PORT=5001
while lsof -i:$PORT >/dev/null 2>&1; do
  red "⚠️  Port $PORT in use, trying next..."
  PORT=$((PORT + 1))
done
green "✅ Flask will use port $PORT"

# === Step 2: Start Flask server ===
blue "🔄 Starting Flask server on port $PORT..."
cd server || exit 1
source venv/bin/activate

export FLASK_APP=app.py
export FLASK_ENV=development
export FLASK_PORT=$PORT

python3 app.py --port=$PORT &
FLASK_PID=$!
cd ..

sleep 2  # Give Flask time to boot

if ! curl -s "http://localhost:$PORT" >/dev/null; then
  red "❌ Flask failed to start on port $PORT"
  kill $FLASK_PID 2>/dev/null
  exit 1
fi

green "🟢 Flask is running on http://localhost:$PORT"

# === Step 3: Update React proxy in package.json ===
PROXY_LINE="  \"proxy\": \"http://localhost:$PORT\","
PACKAGE_JSON="client/package.json"

blue "🔧 Updating React proxy to http://localhost:$PORT..."
sed -i.bak '/"proxy":/d' "$PACKAGE_JSON"
sed -i.bak "s/}$/,\n$PROXY_LINE\n}/" "$PACKAGE_JSON"

# === Step 4: Start React ===
cd client || exit 1
export NODE_OPTIONS=--openssl-legacy-provider

blue "📦 Installing dependencies..."
npm install

blue "🚀 Starting React..."
npm start &
REACT_PID=$!

sleep 3
# open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null

# === Step 5: Wait for React to exit, then clean up Flask ===
wait $REACT_PID
blue "🧹 Stopping Flask server (PID: $FLASK_PID)..."
kill $FLASK_PID