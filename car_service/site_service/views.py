from django.views.generic import TemplateView
from event_calendar.models import TypesOfServices


class HomePageView(TemplateView):
    template_name = 'service/home_page.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context['type_service'] = TypesOfServices.objects.filter(is_available_to_client=True)
        return context
# Create your views here.
