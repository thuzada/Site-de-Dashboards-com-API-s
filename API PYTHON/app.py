from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

df = pd.read_csv("C:/Users/zeusp/OneDrive/Documents/aprendendo web/API PYTHON/survey_results_public.csv")

@app.route("/linguagens-por-area")
def linguagens_por_area():
    df_filtrado = df[["DevType", "LanguageHaveWorkedWith"]].dropna()
    dados = {}

    for _, linha in df_filtrado.iterrows():
        areas = str(linha["DevType"]).split(";")
        linguagens = str(linha["LanguageHaveWorkedWith"]).split(";")
        
        for area in areas:
            if area not in dados:
                dados[area] = {}
            for linguagem in linguagens:
                dados[area][linguagem] = dados[area].get(linguagem, 0) + 1

    top_areas = sorted(dados.items(), key=lambda x: sum(x[1].values()), reverse=True)[:3]

    resultado = {}
    for area, linguagens in top_areas:
        top_linguagens = sorted(linguagens.items(), key=lambda x: x[1], reverse=True)[:5]
        resultado[area] = dict(top_linguagens)

    return jsonify(resultado)

@app.route("/vagas-por-linguagem")
def vagas_por_linguagem():
    linguagens = ["JavaScript", "Python", "Java", "C#", "PHP", "C++"]
    resultado = {}

    app_id = "c1443a1d"
    app_key = "0be4ab2ea9194ca2773b8ab6a4d9fbb7"
    pais = "br"

    for linguagem in linguagens:
        url = f"https://api.adzuna.com/v1/api/jobs/{pais}/search/1?app_id={app_id}&app_key={app_key}&what={linguagem}&results_per_page=1"
        resposta = requests.get(url)
        if resposta.status_code == 200:
            dados = resposta.json()
            resultado[linguagem] = dados.get("count", 0)
        else:
            resultado[linguagem] = 0

    return jsonify(resultado)

@app.route("/salario-por-linguagem")
def salario_por_linguagem():
    df_salario = df[["LanguageHaveWorkedWith", "ConvertedCompYearly"]].dropna()
    df_salario = df_salario[df_salario["ConvertedCompYearly"] < 300000]

    linguagens_salario = {}

    for _, linha in df_salario.iterrows():
        linguagens = str(linha["LanguageHaveWorkedWith"]).split(";")
        salario = float(linha["ConvertedCompYearly"])
        for linguagem in linguagens:
            if linguagem not in linguagens_salario:
                linguagens_salario[linguagem] = []
            linguagens_salario[linguagem].append(salario)

    resultado = {}
    for linguagem, salarios in linguagens_salario.items():
        if len(salarios) >= 20:
            media = sum(salarios) / len(salarios)
            resultado[linguagem] = round(media)

    return jsonify(resultado)

@app.route("/popularidade-ides")
def popularidade_ides():
    dados = {
        'IntelliJ IDEA': 84,
        'VS Code': 31,
        'Eclipse': 28,
    }
    return jsonify(dados)

if __name__ == "__main__":
    app.run(debug=True)
