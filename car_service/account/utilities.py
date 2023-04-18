from site_service.models import Clients
from account.models import MyUser


def create_new_user(name, email, phone, password):
    client, created = Clients.objects.update_or_create(email=email, defaults={'full_name': name, 'phone': phone})
    new_user = MyUser(email=email, client=client, is_active=True, is_admin=False)
    new_user.set_password(password)
    new_user.save()
    return new_user
