import requests

data = {'name': 'Raz'}
r = requests.post("https://localhost:8080/signup", data=data,verify=False)
print(r.body)