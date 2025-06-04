# === Setup Script for First-Time Environment Configuration ===
blue()   { echo -e "\033[1;34m$1\033[0m"; }
green()  { echo -e "\033[1;32m$1\033[0m"; }
red()    { echo -e "\033[1;31m$1\033[0m"; }

# === Python Backend Setup ===
blue "🐍 Setting up Python backend (Flask)..."
cd server || exit 1

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

source venv/bin/activate

# Upgrade pip and install Python dependencies
blue "📦 Installing Python packages..."
pip install --upgrade pip
pip install -r requirements.txt

deactivate
cd ..

# === React Frontend Setup ===
blue "⚛️ Setting up React frontend..."
cd client || exit 1

blue "📦 Installing Node.js packages..."
npm install

cd ..
green "✅ Setup complete! You can now run the project using ./run.sh"