from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_GET
from random import randint
from .services import fetch_day_ahead_prices

import pandas as pd
# Create your views here.

def totalViews(request):
    return JsonResponse({
        "labels": ["January", "February", "March", "April", "May", "June", "July"],
        "data": [randint(1000*1, 1000*(i+1)) for i in range(7)]
    })

@require_GET
def day_ahead_prices(request):
    """
    GET /api/prices/?zone=LT&date=YYYY-MM-DD
    Returns JSON array of 24 hourly prices.
    """

    zone = request.GET.get("zone", "LT")

    date_str = request.GET.get("date")
    if not date_str:
        date_str = (
            pd.Timestamp.now(tz="Europe/Vilnius")
            .normalize()
            .tz_localize(None)  
            - pd.Timedelta(days=1)
        ).strftime("%Y-%m-%d")

    try:
        local = pd.Timestamp(date_str, tz="Europe/Vilnius")
        utc_date = local.tz_convert("UTC").normalize()
    except Exception as e:
        return JsonResponse(
            {"error": f"Bad date: {e}"}, status=400
        )

    try:
        series = fetch_day_ahead_prices(zone, utc_date)
    except Exception as e:
        return JsonResponse(
            {"error": f"Entsoe API error: {e}"}, status=502
        )


    payload = [
        {"timestamp": ts.isoformat(), "price": float(price)}
        for ts, price in series.items()
    ]
    return JsonResponse(payload, safe=False)