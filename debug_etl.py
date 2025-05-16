"""
Debug script for FRED ETL process
"""
import os
import sys
import traceback

print("===== DEBUG: FRED ETL PROCESS =====")
print(f"Current directory: {os.getcwd()}")

# Change to the script directory to ensure proper path resolution
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)
print(f"Changed to directory: {os.getcwd()}")

# Check for FRED API key
fred_key = os.getenv("FRED_API_KEY", "")
if not fred_key:
    print("WARNING: FRED_API_KEY environment variable is not set")
    print("The script will run but may not fetch real data")
else:
    print("FRED_API_KEY is set")

# Check for required directories
data_dir = os.path.join(os.getcwd(), "data")
web_public = os.path.join(os.getcwd(), "web", "public")
series_dir = os.path.join(web_public, "series")

# Create directories if they don't exist
os.makedirs(data_dir, exist_ok=True)
os.makedirs(web_public, exist_ok=True)
os.makedirs(series_dir, exist_ok=True)

print(f"Data directory: {data_dir} - {'exists' if os.path.exists(data_dir) else 'created'}")
print(f"Web public: {web_public} - {'exists' if os.path.exists(web_public) else 'created'}")
print(f"Series directory: {series_dir} - {'exists' if os.path.exists(series_dir) else 'created'}")

try:
    print("\n===== Importing required modules =====")
    import pandas as pd
    import requests
    from bs4 import BeautifulSoup
    print("All modules imported successfully")
except ImportError as e:
    print(f"ERROR importing modules: {e}")
    print("Please run: pip install -r etl/requirements.txt")
    sys.exit(1)

# Run the ETL script
print("\n===== Running the fetch_data.py script =====")
try:
    script_path = os.path.join(os.getcwd(), "etl", "fetch_data.py")
    print(f"Script path: {script_path}")
    
    # Create initial data if history.parquet doesn't exist
    history_path = os.path.join(data_dir, "history.parquet")
    if not os.path.exists(history_path):
        print("history.parquet not found, creating initial data...")
        try:
            exec(open(os.path.join(os.getcwd(), "etl", "create_initial_data.py")).read())
            print("Initial data created successfully")
        except Exception as e:
            print(f"ERROR creating initial data: {e}")
            traceback.print_exc()
    
    # Run the fetch data script
    exec(open(script_path).read())
    print("\n===== ETL script completed successfully =====")
except Exception as e:
    print(f"\nERROR running ETL script: {e}")
    print("\nDetailed traceback:")
    traceback.print_exc()
    sys.exit(1) 