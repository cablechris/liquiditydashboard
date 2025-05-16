"""Daily fetch + derive deltas for Liquidity Dashboard v0.2"""
from __future__ import annotations
from datetime import date, timedelta
import os, json, pathlib, requests, pandas as pd
from bs4 import BeautifulSoup

BASE = pathlib.Path(__file__).parent.parent
DATA = BASE / "data"; DATA.mkdir(exist_ok=True)
PUB  = BASE / "web" / "public"; PUB.mkdir(exist_ok=True)
SERIES_DIR = PUB / "series"; SERIES_DIR.mkdir(exist_ok=True)
FRED = os.getenv("FRED_API_KEY", "")

# ---------- helpers ----------

def fred(series: str):
    url = ("https://api.stlouisfed.org/fred/series/observations"
           f"?series_id={series}&file_type=json&api_key={FRED}")
    obs = requests.get(url, timeout=30).json()["observations"][-1]
    return float(obs["value"]) if obs["value"] != "." else None


def get_move() -> float:
    html = requests.get(
        "https://markets.ft.com/data/indices/tearsheet/summary?s=MOVE:PSE",
        headers={"User-Agent": "Mozilla/5.0"}, timeout=30).text
    span = BeautifulSoup(html, "html.parser").find("span", class_="mod-ui-data-list__value")
    return float(span.text.replace(",", ""))


def get_srf() -> float:
    url = "https://markets.newyorkfed.org/api/soma/srf/search?startDate=&endDate="
    df  = pd.read_csv(url)
    return df["total_submitted"].iloc[-1] / 1e6  # USD mn


def get_bills_tails():
    url = "https://www.treasurydirect.gov/auctions/results/"
    df  = pd.read_html(url)[0]
    bills = df[df["Security Type"].str.contains("Bill")]
    bill_share = round(len(bills) / len(df), 2)
    tails = (df["High Yield"] - df["When Issued"]) * 100  # bp
    worst = round(tails.max(), 2)
    return bill_share, worst

# ---------- pull ----------
row = {
    "date": date.today().isoformat(),
    "on_rrp":   fred("RRPONTSYD"),
    "reserves": fred("WRBWFRBL"),
    "move":     get_move(),
    "srf":      get_srf(),
}
row["bill_share"], row["tail_bp"] = get_bills_tails()

# Round billions to one decimal for smoother sparklines
row["on_rrp"] = round(row["on_rrp"], 0)
row["reserves"] = round(row["reserves"], 0)

# ---------- history ----------
hist_path = DATA / "history.parquet"
hist = pd.read_parquet(hist_path) if hist_path.exists() else pd.DataFrame()
hist = pd.concat([hist, pd.DataFrame([row]).set_index("date")]).drop_duplicates(keep="last")
hist.to_parquet(hist_path)

# keep only last 10 years (3650 days)
hist = hist.tail(3650)

# Option B: ensure daily frequency with forward-fill
hist = hist.resample('D').ffill()

# ---------- derived fields ----------
# 30‑day delta for ON‑RRP  & days‑to‑empty at current pace
if len(hist) >= 31:
    row["on_rrp_delta30"] = row["on_rrp"] - hist.iloc[-31]["on_rrp"]
    avg_outflow = abs(hist["on_rrp"].diff(30).iloc[-1]) / 30
    row["on_rrp_days_to_zero"] = round(row["on_rrp"] / avg_outflow, 1) if avg_outflow else None
else:
    row["on_rrp_delta30"] = None; row["on_rrp_days_to_zero"] = None

# Week‑on‑week reserves change
if len(hist) >= 8:
    row["reserves_wow"] = row["reserves"] - hist.iloc[-8]["reserves"]
else:
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
dash = PUB / "dashboard.json"; dash.write_text(json.dumps(row, indent=2))
# spark json (30 pts)
PUB.joinpath("sparks.json").write_text(hist.tail(30).reset_index().to_json(orient="records"))
# auction panel json (12 m)
PUB.joinpath("auctions.json").write_text(hist[["bill_share","tail_bp"]].tail(365).reset_index().to_json(orient="records")) 

# Generate individual series JSON files with daily frequency
metrics = ["on_rrp", "reserves", "move", "srf"]
for metric in metrics:
    series_data = hist[[metric]].reset_index()
    series_data = series_data.rename(columns={metric: "value"})
    series_path = SERIES_DIR / f"{metric}.json"
    series_path.write_text(series_data.to_json(orient="records"))

# Generate funding combined series (bill_share and tail_bp)
funding_data = hist[["bill_share", "tail_bp"]].reset_index()
# Create a composite 'value' that is normalized to show both metrics
funding_data["value"] = (funding_data["bill_share"] * 100) + (funding_data["tail_bp"] / 10)
funding_data = funding_data[["date", "value"]]
funding_path = SERIES_DIR / "funding.json"
funding_path.write_text(funding_data.to_json(orient="records"))

# Also output individual bill_share and tail_bp series
bill_share_data = hist[["bill_share"]].rename(columns={"bill_share": "value"}).reset_index()
tail_bp_data = hist[["tail_bp"]].rename(columns={"tail_bp": "value"}).reset_index()
SERIES_DIR.joinpath("bill_share.json").write_text(bill_share_data.to_json(orient="records"))
SERIES_DIR.joinpath("tail_bp.json").write_text(tail_bp_data.to_json(orient="records")) 