"""
Fetch latest readings, evaluate status, write parquet & JSON for the dashboard.
Run:  python fetch_data.py
"""
from datetime import date
import os, json, pathlib, requests, pandas as pd
from bs4 import BeautifulSoup

DATA_DIR = pathlib.Path(__file__).parent.parent / "data"
PUBLIC_DIR = pathlib.Path(__file__).parent.parent / "web" / "public"
DATA_DIR.mkdir(exist_ok=True)
PUBLIC_DIR.mkdir(exist_ok=True)

# ---------- helper funcs ----------

def fred(series: str, api=os.getenv("FRED_API_KEY")) -> float:
    url = (
        "https://api.stlouisfed.org/fred/series/observations"
        f"?series_id={series}&file_type=json&api_key={api}"
    )
    obs = requests.get(url, timeout=30).json()["observations"][-1]
    return float(obs["value"]) if obs["value"] != "." else None


def get_move() -> float:
    html = requests.get(
        "https://markets.ft.com/data/indices/tearsheet/summary?s=MOVE:PSE",
        timeout=30,
        headers={"User-Agent": "Mozilla/5.0"},
    ).text
    soup = BeautifulSoup(html, "html.parser")
    span = soup.find("span", class_="mod-ui-data-list__value")
    return float(span.text.replace(",", ""))


def get_srf() -> float:
    url = "https://markets.newyorkfed.org/api/soma/srf/search?startDate=&endDate="
    df = pd.read_csv(url)
    return df["total_submitted"].iloc[-1] / 1e6  # USD million


def get_auction_stats():
    base = "https://www.treasurydirect.gov"
    url = base + "/auctions/results/"
    tbl = pd.read_html(url)[0]
    bills = tbl[tbl["Security Type"].str.contains("Bill")]
    bill_share = len(bills) / len(tbl)
    tails = (tbl["High Yield"] - tbl["When Issued"]) * 100  # bp
    worst_tail = tails.max()
    return round(bill_share, 2), round(worst_tail, 2)

# ---------- main ----------

today = date.today().isoformat()
data = {
    "date": today,
    "on_rrp": fred("RRPONTSYD"),
    "reserves": fred("WRBWFRBL"),
    "move": get_move(),
    "srf": get_srf(),
}
bs, tail = get_auction_stats()
data.update({"bill_share": bs, "tail_bp": tail})

# ---------- status colours ----------
status = {}
status["on_rrp"] = "red" if data["on_rrp"] < 50_000 else "amber" if data["on_rrp"] < 100_000 else "green"
status["reserves"] = "red" if data["reserves"] < 2_500_000 else "amber" if data["reserves"] < 3_000_000 else "green"
status["move"] = "red" if data["move"] >= 140 else "amber" if data["move"] >= 120 else "green"
status["srf"] = "red" if data["srf"] >= 100_000 else "amber" if data["srf"] >= 25_000 else "green"
status["tail"] = "red" if (bs > 0.6 and tail >= 4) else "amber" if (bs > 0.6 or tail >= 4) else "green"

data["status"] = status

# ---------- save ----------
DATA_DIR.joinpath(f"{today}.parquet").write_bytes(pd.Series(data).to_frame("value").to_parquet())
PUBLIC_DIR.joinpath("dashboard.json").write_text(json.dumps(data, indent=2)) 