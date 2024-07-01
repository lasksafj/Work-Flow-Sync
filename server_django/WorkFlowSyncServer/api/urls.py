from django.urls import path
from . import views

urlpatterns = [
    path("some_view/<int:number>/", views.some_view, name="some-view"),
]