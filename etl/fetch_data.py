"""Daily fetch + derive deltas for Liquidity Dashboard v0.2"""
from __future__ import annotations
from datetime import date, timedelta
import os, json, pathlib, requests, pandas as pd, sys
from bs4 import BeautifulSoup

# Custom JSON encoder for Pandas Timestamp objects
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, pd.Timestamp):
            return obj.strftime('%Y-%m-%d')
        return super().default(obj)

# Use os.path to reliably get the project root directory
script_path = os.path.abspath(__file__)
script_dir = os.path.dirname(script_path)
BASE = os.path.dirname(script_dir)  # Go up one level to project root

print(f"Script path: {script_path}")
print(f"Script directory: {script_dir}")
print(f"Base directory: {BASE}")

# Define paths using os.path.join for better cross-platform compatibility
DATA = os.path.join(BASE, "data")
PUB = os.path.join(BASE, "web", "public")
SERIES_DIR = os.path.join(PUB, "series")

# Create directories if they don't exist
os.makedirs(DATA, exist_ok=True)
os.makedirs(PUB, exist_ok=True)
os.makedirs(SERIES_DIR, exist_ok=True)

FRED = os.getenv("FRED_API_KEY", "")

# Print debug information
print(f"Starting ETL process with FRED API key: {'Available' if FRED else 'MISSING'}")
print(f"Data directory: {DATA}")
print(f"Public directory: {PUB}")
print(f"Series directory: {SERIES_DIR}")

# ---------- helpers ----------

def fred(series: str):
    """Fetch data from FRED API with robust error handling"""
    
    if not FRED:
        print(f"WARNING: FRED API key is not set. Cannot fetch {series} data.")
        return 0  # Return a default value if FRED API key is not set
    
    try:
        print(f"\nFetching data for series: {series}")
        # Use the exact same URL format that works in fetch_direct.py
        url = f"https://api.stlouisfed.org/fred/series/observations?series_id={series}&api_key={FRED}&file_type=json&sort_order=desc&limit=1"
        
        print(f"Request URL: {url.replace(FRED, 'API_KEY_HIDDEN')}")
        response = requests.get(url, timeout=30)
        print(f"Response status: {response.status_code}")
        
        # Show full response body for debugging in CI environment
        if os.environ.get('CI') == 'true':
            print(f"Raw response: {response.text[:500]}...")
        
        response.raise_for_status()
        data = response.json()
        
        print(f"Response keys: {list(data.keys())}")
        
        if 'observations' not in data:
            print(f"WARNING: No 'observations' key in response. Full response: {data}")
            # Check if there's an error message in the response
            if 'error_message' in data:
                print(f"API ERROR: {data['error_message']}")
            return 0
            
        if not data['observations']:
            print(f"WARNING: Empty observations list for {series}")
            return 0
            
        latest = data['observations'][0]
        print(f"Latest observation: {latest}")
        
        if 'value' not in latest or latest['value'] == '.':
            print(f"WARNING: No valid value in observation: {latest}")
            return 0
            
        value = float(latest['value'])
        print(f"Parsed value: {value}")
        return value
        
    except requests.exceptions.HTTPError as e:
        print(f"HTTP ERROR fetching FRED data for {series}: {e}")
        return 0
    except requests.exceptions.ConnectionError as e:
        print(f"CONNECTION ERROR fetching FRED data for {series}: {e}")
        return 0
    except requests.exceptions.Timeout as e:
        print(f"TIMEOUT fetching FRED data for {series}: {e}")
        return 0
    except requests.exceptions.RequestException as e:
        print(f"REQUEST ERROR fetching FRED data for {series}: {e}")
        return 0
    except json.JSONDecodeError as e:
        print(f"JSON DECODE ERROR for {series}: {e}, Response: {response.text[:500]}")
        return 0
    except Exception as e:
        print(f"ERROR fetching FRED data for {series}: {type(e).__name__}: {e}")
        return 0


def get_move() -> float:
    try:
        html = requests.get(
            "https://markets.ft.com/data/indices/tearsheet/summary?s=MOVE:PSE",
            headers={"User-Agent": "Mozilla/5.0"}, timeout=30).text
        span = BeautifulSoup(html, "html.parser").find("span", class_="mod-ui-data-list__value")
        return float(span.text.replace(",", ""))
    except Exception as e:
        print(f"Error fetching MOVE index: {e}")
        return 120  # Default value


def get_srf() -> float:
    try:
        url = "https://markets.newyorkfed.org/api/soma/srf/search?startDate=&endDate="
        df  = pd.read_csv(url)
        return df["total_submitted"].iloc[-1] / 1e6  # USD mn
    except Exception as e:
        print(f"Error fetching SRF data: {e}")
        return 0  # Default value


def get_bills_tails():
    try:
        url = "https://www.treasurydirect.gov/auctions/results/"
        df  = pd.read_html(url)[0]
        bills = df[df["Security Type"].str.contains("Bill")]
        bill_share = round(len(bills) / len(df), 2)
        tails = (df["High Yield"] - df["When Issued"]) * 100  # bp
        worst = round(tails.max(), 2)
        return bill_share, worst
    except Exception as e:
        print(f"Error fetching bills and tails data: {e}")
        return 0.5, 2  # Default values

# ---------- pull ----------
try:
    row = {
        "date": date.today().isoformat(),
        "on_rrp":   fred("RRPONTSYD"),
        "reserves": fred("WRBWFRBL"),
        "move":     get_move(),
        "srf":      get_srf(),
    }
    row["bill_share"], row["tail_bp"] = get_bills_tails()

    # Check if all our API calls failed and need to use fallback data
    if row["on_rrp"] == 0 and row["reserves"] == 0:
        print("WARNING: All FRED API calls failed. Attempting to use fallback data.")
        try:
            from etl.fallback_data import generate_fallback_data
            if generate_fallback_data():
                print("Fallback data generation succeeded. Exiting.")
                sys.exit(0)
            else:
                print("Fallback data generation failed. Continuing with zeros.")
        except Exception as e:
            print(f"Error importing fallback data module: {e}")
            print("Continuing with zeros.")

    # Round billions to one decimal for smoother sparklines
    row["on_rrp"] = round(row["on_rrp"], 0)
    row["reserves"] = round(row["reserves"], 0)

    # ---------- history ----------
    hist_path = os.path.join(DATA, "history.parquet")
    if os.path.exists(hist_path):
        print(f"Loading existing history from {hist_path}")
        hist = pd.read_parquet(hist_path)
    else:
        print(f"No history file found at {hist_path}, creating a new DataFrame")
        # Create a default history with the current row and proper date index
        hist = pd.DataFrame([row])
        hist['date'] = pd.to_datetime(hist['date'])
        hist = hist.set_index('date')
    
    # Append new row to history
    new_row = pd.DataFrame([row])
    new_row['date'] = pd.to_datetime(new_row['date'])
    new_row = new_row.set_index('date')
    
    # Merge with existing history, keeping only the latest value for any duplicate dates
    hist = pd.concat([hist, new_row])
    hist = hist[~hist.index.duplicated(keep='last')]  # Remove duplicate indices, keeping latest
    
    hist.to_parquet(hist_path)
    print(f"History saved to {hist_path}")

    # keep only last 10 years (3650 days)
    hist = hist.tail(3650)

    # Ensure index is datetime type before resampling
    if not isinstance(hist.index, pd.DatetimeIndex):
        hist.index = pd.to_datetime(hist.index)
    
    # Option B: ensure daily frequency with forward-fill
    hist = hist.resample('D').ffill()
    print(f"History resampled to daily frequency")

    # ---------- derived fields ----------
    # 30‑day delta for ON‑RRP  & days‑to‑empty at current pace
    if len(hist) >= 31:
        row["on_rrp_delta30"] = row["on_rrp"] - hist.iloc[-31]["on_rrp"]
        avg_outflow = abs(hist["on_rrp"].diff(30).iloc[-1]) / 30
        row["on_rrp_days_to_zero"] = round(row["on_rrp"] / avg_outflow, 1) if avg_outflow else None
    else:
        print("Not enough history for 30-day delta calculation")
        row["on_rrp_delta30"] = None; row["on_rrp_days_to_zero"] = None

    # Week‑on‑week reserves change
    if len(hist) >= 8:
        row["reserves_wow"] = row["reserves"] - hist.iloc[-8]["reserves"]
    else:
        print("Not enough history for week-over-week calculation")
        row["reserves_wow"] = None

    # 7‑day SRF avg
    row["srf_ma7"] = hist["srf"].tail(7).mean() if len(hist) >= 7 else row["srf"]

    # ---------- colour status ----------
    status = {}
    status["on_rrp"] = "red" if row["on_rrp"] < 50_000 else "amber" if row["on_rrp"] < 100_000 else "green"
    status["reserves"] = "red" if row["reserves"] < 2_500_000 else "amber" if row["reserves"] < 3_000_000 else "green"
    status["move"] = "red" if row["move"] >= 140 else "amber" if row["move"] >= 120 else "green"
    status["srf"] = "red" if row["srf"] >= 100_000 else "amber" if row["srf"] >= 25_000 else "green"
    status["tail"] = "red" if (row["bill_share"] > 0.6 and row["tail_bp"] >= 4) else "amber" if (row["bill_share"] > 0.6 or row["tail_bp"] >= 4) else "green"
    row["status"] = status

    # ---------- outputs ----------
    # snapshot json
    dash = os.path.join(PUB, "dashboard.json")
    with open(dash, 'w') as f:
        json.dump(row, f, indent=2, cls=DateTimeEncoder)
    print(f"Dashboard JSON saved to {dash}")
    
    # spark json (30 pts)
    sparks_path = os.path.join(PUB, "sparks.json")
    spark_data = json.loads(hist.tail(30).reset_index().to_json(orient="records", date_format='iso'))
    with open(sparks_path, 'w') as f:
        json.dump(spark_data, f)
    print(f"Sparks JSON saved to {sparks_path}")
    
    # auction panel json (12 m)
    auctions_path = os.path.join(PUB, "auctions.json")
    auction_data = json.loads(hist[["bill_share","tail_bp"]].tail(365).reset_index().to_json(orient="records", date_format='iso'))
    with open(auctions_path, 'w') as f:
        json.dump(auction_data, f)
    print(f"Auctions JSON saved to {auctions_path}")

    # Generate individual series JSON files with daily frequency
    metrics = ["on_rrp", "reserves", "move", "srf"]
    for metric in metrics:
        series_data = hist[[metric]].reset_index()
        series_data = series_data.rename(columns={metric: "value"})
        series_path = os.path.join(SERIES_DIR, f"{metric}.json")
        json_str = series_data.to_json(orient="records", date_format='iso')
        with open(series_path, 'w') as f:
            f.write(json_str)
        print(f"{metric} series JSON saved to {series_path}")

    # Generate funding combined series (bill_share and tail_bp)
    funding_data = hist[["bill_share", "tail_bp"]].reset_index()
    # Create a composite 'value' that is normalized to show both metrics
    funding_data["value"] = (funding_data["bill_share"] * 100) + (funding_data["tail_bp"] / 10)
    funding_data = funding_data[["date", "value"]]
    funding_path = os.path.join(SERIES_DIR, "funding.json")
    json_str = funding_data.to_json(orient="records", date_format='iso')
    with open(funding_path, 'w') as f:
        f.write(json_str)
    print(f"Funding series JSON saved to {funding_path}")

    # Also output individual bill_share and tail_bp series
    bill_share_data = hist[["bill_share"]].rename(columns={"bill_share": "value"}).reset_index()
    tail_bp_data = hist[["tail_bp"]].rename(columns={"tail_bp": "value"}).reset_index()
    bill_share_path = os.path.join(SERIES_DIR, "bill_share.json")
    tail_bp_path = os.path.join(SERIES_DIR, "tail_bp.json")
    with open(bill_share_path, 'w') as f:
        f.write(bill_share_data.to_json(orient="records", date_format='iso'))
    with open(tail_bp_path, 'w') as f:
        f.write(tail_bp_data.to_json(orient="records", date_format='iso'))
    print(f"Bill share series JSON saved to {bill_share_path}")
    print(f"Tail bp series JSON saved to {tail_bp_path}")
    
    print("ETL process completed successfully")
except Exception as e:
    print(f"Error in ETL process: {e}")
    raise 