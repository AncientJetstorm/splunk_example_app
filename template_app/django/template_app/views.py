from django.contrib.auth.decorators import login_required
from splunkdj.decorators.render import render_to

@render_to('template_app:home.html')
@login_required
def home(request):
    return {
        "message": "Hello World from template_app!",
        "app_name": "template_app"
    }