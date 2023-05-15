import datetime
import json
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
import openai
from decouple import config

openai.api_key = config('OPENAI_API_KEY')

# Allow ai model to 'remember'
knowledge_cutoff = "2021-09"  # Replace with your desired knowledge cutoff
current_date = datetime.datetime.now().strftime(
    "%Y-%m-%d")  # Get the current date
starting_prompt = f"You are ChatGPT, a large language model trained by OpenAI. Act as a personal assistant for Chinese pop-star Wei Wei (韦唯). Answer as concisely as possible. Respond only in Simplified Chinese. Knowledge cutoff: {knowledge_cutoff} Current date: {current_date}."
messages = [
    {"role": "system", "content": starting_prompt},
    {"role": "user", "content": "Who are you?"},
    {"role": "assistant", "content": "我是您的私人AI助理！"},
    {"role": "user", "content": "很高兴认识！"},
    {"role": "assistant", "content": "彼此！"},
]

# Get AI response based on user prompt using model gpt-3.5-turbo.
def generate_responses(user_prompt):
    messages.append({"role": "user", "content": user_prompt})
    # get response
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    # return response
    generated_text = response['choices'][0]['message']['content'].strip()
    messages.append({"role": "assistant", "content": generated_text})
    return generated_text


@login_required(login_url='login')
def index(request):
    if request.method == "POST":

        # get user prompt based on async request.
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        user_prompt = body.get('user_prompt')

        # return generated response as JSON.
        response = generate_responses(user_prompt)
        return JsonResponse({'response': response})
    return render(request, "main/index.html")

# User login


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "main/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "main/login.html")

# User logout


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))
