"""
Initialize the Liquidity Dashboard with sample data.
This script creates a starter history.parquet file with synthetic data.
"""

import pandas as pd
import numpy as np
import pathlib
from datetime import datetime, timedelta

# Create paths
BASE = pathlib.Path(__file__).parent.parent
DATA = BASE / "data"
DATA.mkdir(exist_ok=True)

# Generate dates for the past 365 days
end_date = datetime.now().date()
start_date = end_date - timedelta(days=365)
dates = pd.date_range(start=start_date, end=end_date, freq='D')

# Create synthetic data with realistic trends
np.random.seed(42)  # For reproducibility

# ON-RRP: Declining from around 2T to 500B
on_rrp = np.linspace(2_000_000, 500_000, len(dates))
on_rrp = on_rrp + np.random.normal(0, 50000, len(dates))  # Add some noise

# Reserves: Around 3.5T with some fluctuations
reserves = np.random.normal(3_500_000, 200_000, len(dates))

# MOVE index: Around 110-130 with volatility
move = np.random.normal(120, 15, len(dates))

# SRF: Low values with occasional spikes
srf = np.random.exponential(5000, len(dates))

# Bill share: Between 0.4 and 0.7
bill_share = np.random.uniform(0.4, 0.7, len(dates))

# Tail bp: Between 0.5 and 5
tail_bp = np.random.gamma(2, 1, len(dates))

# Create DataFrame
df = pd.DataFrame({
    'date': dates,
    'on_rrp': on_rrp,
    'reserves': reserves,
    'move': move,
    'srf': srf,
    'bill_share': bill_share,
    'tail_bp': tail_bp
})

# Set date as index
df = df.set_index('date')

# Round values for consistency
df['on_rrp'] = df['on_rrp'].round(0)
df['reserves'] = df['reserves'].round(0)
df['move'] = df['move'].round(1)
df['srf'] = df['srf'].round(1)
df['bill_share'] = df['bill_share'].round(2)
df['tail_bp'] = df['tail_bp'].round(2)

# Save as parquet
hist_path = DATA / "history.parquet"
df.to_parquet(hist_path)

print(f"Created initial history with {len(df)} days of data")
print(f"Saved to {hist_path}")
print(f"Sample data:")
print(df.tail()) 