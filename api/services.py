import os
import pandas as pd
from entsoe import EntsoePandasClient

TOKEN = os.environ["ENTSOE_TOKEN"]

def fetch_day_ahead_prices(country_code: str, date: pd.Timestamp) -> pd.Series:
    """
    Fetches the 24 hourly day-ahead prices for `date` in UTC.
    """
    client = EntsoePandasClient(api_key=TOKEN)
    # positional country_code + named start/end
    return client.query_day_ahead_prices(
        country_code,
        start=date,
        end=date + pd.Timedelta(days=1),
    )