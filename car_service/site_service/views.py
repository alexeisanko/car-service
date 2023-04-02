from django.views.generic import TemplateView
from event_calendar.models import TypesOfServices
from customization.models import Reviews, Team, DescriptionOfServices


class HomePageView(TemplateView):
    template_name = 'service/home_page.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context['type_service_car'] = TypesOfServices.objects.filter(is_available_to_client=True).filter(
            is_repair_for_minibus=False)
        context['type_service_minibus'] = TypesOfServices.objects.filter(is_available_to_client=True).filter(
            is_repair_for_minibus=True)
        context['custom_services_id'] = DescriptionOfServices.objects.all().values('id').order_by('id')
        context['reviews'] = Reviews.objects.all()
        context['team'] = Team.objects.all()
        return context
# Create your views here.
