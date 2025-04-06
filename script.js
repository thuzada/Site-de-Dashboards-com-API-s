// GRAFICO 1 
const token = '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';

async function buscarLinguagensPopulares() {
  const resposta = await fetch('https://api.github.com/search/repositories?q=stars:>1&sort=stars&per_page=100', {
    headers: {
      Authorization: `token ${token}`
    }
  });

  const dados = await resposta.json();

  const linguagens = {};

  dados.items.forEach(repo => {
    const linguagem = repo.language;
    if (linguagem) {
      linguagens[linguagem] = (linguagens[linguagem] || 0) + 1;
    }
  });

  const labels = Object.keys(linguagens);
  const valores = Object.values(linguagens);

  const cores = labels.map(() => '#' + Math.floor(Math.random()*16777215).toString(16));

  const ctx = document.getElementById('graficoPopulares').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Popularidade (Top 100 GitHub)',
        data: valores,
        backgroundColor: cores
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

buscarLinguagensPopulares();

// GRAFICO LATERAL API EM PYTHON
async function carregarGraficoPorArea() {
  const resposta = await fetch('http://127.0.0.1:5000/linguagens-por-area');
  const dados = await resposta.json();

  const ctx = document.getElementById('graficoPorArea').getContext('2d');
  const linguagens = new Set();
  const datasets = [];

  const cores = ['#ff6384', '#36a2eb', '#ffce56'];

  Object.entries(dados).forEach(([area, linguas], index) => {
    const labels = Object.keys(linguas);
    labels.forEach(l => linguagens.add(l));

    datasets.push({
      label: area,
      data: labels.map(l => linguas[l]),
      backgroundColor: cores[index],
    });
  });

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Array.from(linguagens),
      datasets: datasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Linguagens mais usadas por área',
        },
      },
    },
  });
}

carregarGraficoPorArea();



// GRAFICO 2

async function carregarGraficoVagas() {
  const resposta = await fetch('http://127.0.0.1:5000/vagas-por-linguagem');
  const dados = await resposta.json();

  const ctx = document.getElementById('graficoVagas').getContext('2d');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(dados),
      datasets: [{
        label: 'Vagas por linguagem',
        data: Object.values(dados),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right'
        },
        title: {
          display: true,
          text: 'Comparativo entre linguagens em vagas de emprego'
        }
      }
    }
  });
}

carregarGraficoVagas();

// GRAFICO 3 
async function carregarTabelaSalarios() {
  const resposta = await fetch('http://127.0.0.1:5000/salario-por-linguagem');
  const dados = await resposta.json();

  const container = document.getElementById('tabelaSalarios');

  const tabela = document.createElement('table');
  const cabecalho = document.createElement('tr');

  const thLinguagem = document.createElement('th');
  thLinguagem.textContent = 'Linguagem';

  const thSalario = document.createElement('th');
  thSalario.textContent = 'Salário Médio (USD)';

  cabecalho.appendChild(thLinguagem);
  cabecalho.appendChild(thSalario);
  tabela.appendChild(cabecalho);

  Object.entries(dados).forEach(([linguagem, salario]) => {
    const linha = document.createElement('tr');
    const tdLing = document.createElement('td');
    tdLing.textContent = linguagem;
    const tdSal = document.createElement('td');
    tdSal.textContent = `$${salario.toLocaleString()}`;
    linha.appendChild(tdLing);
    linha.appendChild(tdSal);
    tabela.appendChild(linha);
  });

  container.appendChild(tabela);
}

carregarTabelaSalarios();
//Grafico 4
async function carregarGraficoIDEs() {
  const resposta = await fetch('http://127.0.0.1:5000/popularidade-ides');
  const dados = await resposta.json();

  const ctx = document.getElementById('graficoIDEs').getContext('2d');
  new Chart(ctx, {
      type: 'bar',
      data: {
          labels: Object.keys(dados),
          datasets: [{
              label: 'Popularidade das IDEs em 2025',
              data: Object.values(dados),
              backgroundColor: [
                  'rgba(75, 192, 192, 0.2)',
                  // Adicione cores adicionais conforme necessário
              ],
              borderColor: [
                  'rgba(75, 192, 192, 1)',
                  // Adicione cores adicionais conforme necessário
              ],
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          plugins: {
              title: {
                  display: true,
                  text: 'Popularidade das IDEs em 2025'
              }
          },
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}

carregarGraficoIDEs();
