"""
Fallback data generator for Liquidity Dashboard
This script generates realistic data when the FRED API is unavailable
"""
import os
import sys
import json
import pathlib
import pandas as pd
from datetime import date, timedelta
import traceback

def generate_fallback_data():
    """Generate realistic fallback data when FRED API fails"""
    try:
        # Get absolute paths
        script_dir = os.path.dirname(os.path.abspath(__file__))
        base_dir = os.path.dirname(script_dir)
        data_dir = os.path.join(base_dir, "data")
        public_dir = os.path.join(base_dir, "web", "public")
        series_dir = os.path.join(public_dir, "series")
        
        # Create directories if they don't exist
        os.makedirs(data_dir, exist_ok=True)
        os.makedirs(public_dir, exist_ok=True)
        os.makedirs(series_dir, exist_ok=True)
        
        print(f"Generating fallback data (FRED API unavailable)")
        print(f"Base directory: {base_dir}")
        print(f"Data directory: {data_dir}")
        print(f"Public directory: {public_dir}")
        print(f"Series directory: {series_dir}")
        
        # Generate current date and realistic values
        today = date.today()
        
        # Create data point for today
        row = {
            "date": today.isoformat(),
            "on_rrp": 120000,  # $120B
            "reserves": 2900000,  # $2.9T
            "move": 135,
            "srf": 18000,  # $18B
            "bill_share": 0.73,
            "tail_bp": 3.5,
        }
        
        # Create or load history file
        hist_path = os.path.join(data_dir, "history.parquet")
        if os.path.exists(hist_path):
            print(f"Loading existing history from {hist_path}")
            hist = pd.read_parquet(hist_path)
        else:
            print(f"Creating new history file at {hist_path}")
            # Generate data for the past 365 days
            dates = []
            on_rrp_values = []
            reserves_values = []
            move_values = []
            srf_values = []
            bill_share_values = []
            tail_bp_values = []
            
            for i in range(365, -1, -1):
                d = today - timedelta(days=i)
                dates.append(d)
                # Generate data with trends
                on_rrp_values.append(2000000 - (i * 5000))  # Declining trend
                reserves_values.append(3500000 - (i * 2000))  # Declining trend
                move_values.append(100 + (15 * (365-i)/365))  # Rising trend
                srf_values.append(5000 + (15000 * ((365-i)/365)**2))  # Rising exponential
                bill_share_values.append(0.5 + (i/1000))  # Slightly increasing
                tail_bp_values.append(2 + (i/500))  # Slightly increasing
            
            # Create DataFrame
            data = {
                'date': dates,
                'on_rrp': on_rrp_values,
                'reserves': reserves_values,
                'move': move_values,
                'srf': srf_values,
                'bill_share': bill_share_values,
                'tail_bp': tail_bp_values
            }
            hist = pd.DataFrame(data).set_index('date')
        
        # Add today's row to history
        new_row = pd.DataFrame([row])
        new_row['date'] = pd.to_datetime(new_row['date'])
        new_row = new_row.set_index('date')
        hist = pd.concat([hist, new_row]).drop_duplicates(keep="last")
        
        # Keep last 365 days and save
        hist = hist.tail(365)
        hist.to_parquet(hist_path)
        print(f"Updated history saved with {len(hist)} records")
        
        # Calculate status indicators
        status = {}
        status["on_rrp"] = "red" if row["on_rrp"] < 50_000 else "amber" if row["on_rrp"] < 100_000 else "green"
        status["reserves"] = "red" if row["reserves"] < 2_500_000 else "amber" if row["reserves"] < 3_000_000 else "green"
        status["move"] = "red" if row["move"] >= 140 else "amber" if row["move"] >= 120 else "green"
        status["srf"] = "red" if row["srf"] >= 100_000 else "amber" if row["srf"] >= 25_000 else "green"
        status["tail"] = "red" if (row["bill_share"] > 0.6 and row["tail_bp"] >= 4) else "amber" if (row["bill_share"] > 0.6 or row["tail_bp"] >= 4) else "green"
        row["status"] = status
        
        # Save dashboard.json
        dash_path = os.path.join(public_dir, "dashboard.json")
        with open(dash_path, 'w') as f:
            json.dump(row, f, indent=2)
        print(f"Dashboard JSON saved to {dash_path}")
        
        # Generate series JSON files
        metrics = ["on_rrp", "reserves", "move", "srf"]
        for metric in metrics:
            series_data = hist[[metric]].reset_index()
            series_data = series_data.rename(columns={metric: "value"})
            series_path = os.path.join(series_dir, f"{metric}.json")
            with open(series_path, 'w') as f:
                f.write(series_data.to_json(orient="records", date_format='iso'))
            print(f"{metric} series JSON saved to {series_path}")
        
        # Generate funding combined series
        funding_data = hist[["bill_share", "tail_bp"]].reset_index()
        funding_data["value"] = (funding_data["bill_share"] * 100) + (funding_data["tail_bp"] / 10)
        funding_data = funding_data[["date", "value"]]
        funding_path = os.path.join(series_dir, "funding.json")
        with open(funding_path, 'w') as f:
            f.write(funding_data.to_json(orient="records", date_format='iso'))
        print(f"Funding series JSON saved to {funding_path}")
        
        # Generate individual bill_share and tail_bp series
        bill_share_data = hist[["bill_share"]].rename(columns={"bill_share": "value"}).reset_index()
        tail_bp_data = hist[["tail_bp"]].rename(columns={"tail_bp": "value"}).reset_index()
        with open(os.path.join(series_dir, "bill_share.json"), 'w') as f:
            f.write(bill_share_data.to_json(orient="records", date_format='iso'))
        with open(os.path.join(series_dir, "tail_bp.json"), 'w') as f:
            f.write(tail_bp_data.to_json(orient="records", date_format='iso'))
        
        print("Fallback data generation completed successfully")
        return True
    except Exception as e:
        print(f"Error generating fallback data: {e}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    generate_fallback_data() 