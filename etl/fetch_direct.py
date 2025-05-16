"""
Direct FRED API fetch script
This script directly fetches data from FRED API using the API key without any processing
"""
import os
import sys
import json
import requests
from datetime import date

def main():
    """Main function to fetch data directly from FRED API"""
    
    # Get API key from environment
    api_key = os.environ.get('FRED_API_KEY', '')
    if not api_key:
        print("ERROR: FRED_API_KEY environment variable not set")
        sys.exit(1)
    
    print(f"Using FRED API key: {api_key[:4]}...{api_key[-4:]}")
    
    series_ids = [
        'RRPONTSYD',  # ON-RRP
        'WRBWFRBL',   # Reserves
        'DFF',        # Federal Funds Rate
        'T10Y2Y',     # 10-Year Treasury Constant Maturity Minus 2-Year
    ]
    
    results = {}
    
    for series_id in series_ids:
        print(f"\nFetching data for series: {series_id}")
        
        # First, get series information
        try:
            info_url = f"https://api.stlouisfed.org/fred/series?series_id={series_id}&api_key={api_key}&file_type=json"
            info_response = requests.get(info_url, timeout=30)
            info_response.raise_for_status()
            info_data = info_response.json()
            
            print(f"Series info status: {info_response.status_code}")
            print(f"Series title: {info_data.get('seriess', [{}])[0].get('title', 'Unknown')}")
            
        except Exception as e:
            print(f"Error fetching series info: {e}")
        
        # Then, get the latest observation
        try:
            obs_url = f"https://api.stlouisfed.org/fred/series/observations?series_id={series_id}&api_key={api_key}&file_type=json&sort_order=desc&limit=1"
            obs_response = requests.get(obs_url, timeout=30)
            obs_response.raise_for_status()
            obs_data = obs_response.json()
            
            print(f"Observations status: {obs_response.status_code}")
            print(f"Response keys: {list(obs_data.keys())}")
            
            if 'observations' in obs_data and obs_data['observations']:
                latest = obs_data['observations'][0]
                print(f"Latest observation: {latest}")
                
                # Add to results
                results[series_id] = {
                    'date': latest.get('date'),
                    'value': latest.get('value')
                }
            else:
                print("No observations found")
                
        except Exception as e:
            print(f"Error fetching observations: {e}")
    
    # Print summary of results
    print("\n--- SUMMARY OF RESULTS ---")
    print(f"Data as of: {date.today().isoformat()}")
    for series_id, data in results.items():
        print(f"{series_id}: {data.get('value')} ({data.get('date')})")
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 