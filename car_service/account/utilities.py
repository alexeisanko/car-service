from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.http.request import HttpRequest
from django.contrib import messages

from account.tokens import account_activation_token
from account.models import MyUser
from site_service.models import Clients
from account.models import MyUser


def create_new_user(name, email, phone, password):
    client, created = Clients.objects.update_or_create(email=email, defaults={'full_name': name, 'phone': phone})
    new_user = MyUser(email=email, client=client, is_admin=False)
    new_user.is_active = False
    new_user.set_password(password)
    new_user.save()
    return new_user


def activate_email(request: HttpRequest, user: MyUser, to_email: str, name_user: str):
    mail_subject = "Activate your user account."
    message = render_to_string("account/template_activate_account.html", {
        'user': name_user,
        'domain': get_current_site(request).domain,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': account_activation_token.make_token(user),
        "protocol": 'https' if request.is_secure() else 'http'
    })
    email = EmailMessage(mail_subject, message, to=[to_email])
    if email.send():
        messages.success(request, f'Dear <b>{name_user}</b>, please go to you email <b>{to_email}</b> inbox and click on \
                received activation link to confirm and complete the registration. <b>Note:</b> Check your spam folder.')
    else:
        messages.error(request, f'Problem sending email to {to_email}, check if you typed it correctly.')


def activate_user(uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = MyUser.objects.get(pk=uid)
    except:
        user = None

    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return user
    else:
        return False