from django.urls import path
from . import views

urlpatterns = [
    path('total-views', views.totalViews, name = "api-total-views"),
    path("prices", views.day_ahead_prices, name="api-day-ahead-prices"),
]