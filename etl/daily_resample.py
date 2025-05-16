#!/usr/bin/env python
"""
This script reads the existing JSON series files with monthly data,
resamples them to daily frequency with forward-fill, and writes
the updated JSON files back.
"""

import json
import pathlib
import pandas as pd
from datetime import datetime

# Setup paths
BASE = pathlib.Path(__file__).parent.parent
PUBLIC = BASE / "web" / "public"
SERIES_DIR = PUBLIC / "series"

def resample_json_to_daily(json_path):
    """
    Reads a JSON file with date/value pairs, resamples to daily frequency,
    and writes the result back to the same file.
    """
    # Read the JSON file
    with open(json_path, 'r') as f:
        data = json.load(f)
    
    # Convert to DataFrame
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    df = df.set_index('date')
    
    # Resample to daily frequency with forward-fill
    df_daily = df.resample('D').ffill()
    
    # Reset index and convert dates back to string format
    df_daily = df_daily.reset_index()
    df_daily['date'] = df_daily['date'].dt.strftime('%Y-%m-%d')
    
    # Write back to the same file
    with open(json_path, 'w') as f:
        json.dump(df_daily.to_dict(orient='records'), f, indent=2)
    
    print(f"Resampled {json_path} from {len(data)} points to {len(df_daily)} points")

def main():
    # Process all JSON files in the series directory
    for json_path in SERIES_DIR.glob('*.json'):
        resample_json_to_daily(json_path)
    
    print("All series files have been resampled to daily frequency.")

if __name__ == "__main__":
    main() 