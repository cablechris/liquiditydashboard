"""
Test script to debug the ETL process
"""
import os
import sys
import traceback

print("===== TESTING ETL PROCESS =====")
print(f"Current directory: {os.getcwd()}")
print(f"Python version: {sys.version}")
print(f"Python executable: {sys.executable}")
print("Files in current directory:")
for root, dirs, files in os.walk('.', topdown=True, maxdepth=1):
    for name in files:
        print(f"  - {name}")
    for name in dirs:
        print(f"  + {name}")

print("\n===== Attempting to import modules =====")
try:
    import pandas as pd
    print(f"Pandas version: {pd.__version__}")
    
    import requests
    print(f"Requests version: {requests.__version__}")
    
    from bs4 import BeautifulSoup
    print("BeautifulSoup imported successfully")
    
    print("All required modules imported successfully")
except ImportError as e:
    print(f"Error importing modules: {e}")
    print("Make sure to install requirements with: pip install -r etl/requirements.txt")
    sys.exit(1)

print("\n===== Attempting to run ETL script =====")
try:
    # Run the ETL script with detailed error handling
    exec(open("etl/fetch_data.py").read())
    print("ETL script completed successfully")
except Exception as e:
    print(f"Error running ETL script: {e}")
    print("\nDetailed traceback:")
    traceback.print_exc()
    sys.exit(2) 