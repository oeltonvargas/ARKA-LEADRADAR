import React, { useState } from 'react';
import { Search, TrendingUp, Target, FileText, Download, Loader2, BarChart3, Settings } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState('claude');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    niche: '',
    mainGoal: '',
    budget: '',
    competitors: '',
    currentChallenges: ''
  });
  const [analysis, setAnalysis] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPromptForAI = () => {
    return `Você é um especialista em tráfego pago e análise de mercado. Analise as seguintes informações e gere um relatório estratégico completo:

INFORMAÇÕES DO CLIENTE:
- Nome: ${formData.clientName}
- Nicho: ${formData.niche}
- Objetivo Principal: ${formData.mainGoal}
- Budget Mensal: ${formData.budget}
- Concorrentes Identificados: ${formData.competitors}
- Desafios Atuais: ${formData.currentChallenges}

Por favor, retorne APENAS um objeto JSON (sem markdown, sem backticks) com esta estrutura:

{
  "analise_mercado": {
    "contexto": "Análise do mercado e momento atual do nicho",
    "oportunidades": ["oportunidade1", "oportunidade2", "oportunidade3"],
    "ameacas": ["ameaça1", "ameaça2"]
  },
  "analise_concorrentes": [
    {
      "concorrente": "Nome",
      "estrategias_identificadas": ["estratégia1", "estratégia2"],
      "pontos_fortes": ["ponto1", "ponto2"],
      "gaps_oportunidade": ["gap1", "gap2"]
    }
  ],
  "estrategia_segmentacao": {
    "publicos_alvo": [
      {
        "nome": "Público 1",
        "caracteristicas": ["caract1", "caract2"],
        "justificativa": "Por que segmentar este público"
      }
    ],
    "recomendacao_canais": {
      "facebook_instagram": {
        "justificativa": "Por que usar",
        "budget_sugerido": "X%"
      },
      "google_ads": {
        "justificativa": "Por que usar",
        "budget_sugerido": "X%"
      }
    }
  },
  "plano_criativo": {
    "tipos_conteudo": [
      {
        "formato": "Nome do formato",
        "objetivo": "Objetivo deste formato",
        "exemplo_mensagem": "Exemplo de copy/abordagem"
      }
    ],
    "elementos_chave": ["elemento1", "elemento2", "elemento3"]
  },
  "metricas_sucesso": {
    "kpis_principais": [
      {
        "metrica": "Nome da métrica",
        "meta": "Valor alvo",
        "explicacao": "Por que esta métrica importa"
      }
    ]
  },
  "cronograma_execucao": {
    "fase1": {
      "nome": "Nome da fase",
      "duracao": "X semanas",
      "acoes": ["ação1", "ação2"]
    },
    "fase2": {
      "nome": "Nome da fase",
      "duracao": "X semanas",
      "acoes": ["ação1", "ação2"]
    },
    "fase3": {
      "nome": "Nome da fase",
      "duracao": "X semanas",
      "acoes": ["ação1", "ação2"]
    }
  },
  "proximos_passos": ["passo1", "passo2", "passo3"]
}`;
  };

  const analyzeWithClaude = async () => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: getPromptForAI() }]
      })
    });

    const data = await response.json();
    return data.content.filter(item => item.type === 'text').map(item => item.text).join('');
  };

  const analyzeWithGPT = async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'Você é um especialista em tráfego pago. Retorne APENAS JSON válido.' },
          { role: 'user', content: getPromptForAI() }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const analyzeWithGemini = async () => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: getPromptForAI() }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
      })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  const analyzeWithAI = async () => {
    setLoading(true);
    try {
      let responseText = '';
      if (selectedAI === 'claude') responseText = await analyzeWithClaude();
      else if (selectedAI === 'gpt') responseText = await analyzeWithGPT();
      else responseText = await analyzeWithGemini();

      const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
      setAnalysis(JSON.parse(cleanedResponse));
      setStep(3);
    } catch (error) {
      alert(`Erro: ${error.message}\n\nVerifique sua chave de API.`);
    } finally {
      setLoading(false);
    }
  };

  const generatePDFContent = () => {
    if (!analysis) return '';
    const aiNames = { claude: 'Claude AI', gpt: 'ChatGPT', gemini: 'Google Gemini' };
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 40px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
    .header h1 { margin: 0; font-size: 32px; }
    .header p { margin: 10px 0 0 0; opacity: 0.9; }
    .section { margin-bottom: 40px; page-break-inside: avoid; }
    .section-title { color: #667eea; font-size: 24px; border-bottom: 3px solid #667eea; padding-bottom: 10px; margin-bottom: 20px; }
    .subsection { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .subsection-title { color: #764ba2; font-size: 18px; margin-bottom: 15px; font-weight: bold; }
    .info-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 10px 0; }
    .competitor-card { background: white; border: 2px solid #e0e0e0; padding: 20px; border-radius: 8px; margin-bottom: 15px; }
    .audience-card { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 10px 0; }
    .metric-card { background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin: 10px 0; }
    ul { margin: 10px 0; padding-left: 25px; }
    li { margin: 8px 0; }
    .highlight { background: #fff3cd; padding: 2px 6px; border-radius: 3px; }
    .timeline { border-left: 3px solid #667eea; padding-left: 20px; margin: 20px 0; }
    .phase { margin-bottom: 25px; }
    .phase-title { font-weight: bold; color: #764ba2; font-size: 18px; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎯 ARCA SCAN - Relatório Estratégico</h1>
    <p>Análise Completa de Tráfego Pago e Inteligência de Mercado</p>
    <p><strong>Cliente:</strong> ${formData.clientName} | <strong>Nicho:</strong> ${formData.niche}</p>
    <p style="font-size: 12px; opacity: 0.8;">Gerado com: ${aiNames[selectedAI]}</p>
  </div>

  <div class="section">
    <div class="section-title">📊 INFORMAÇÕES DO CLIENTE</div>
    <div class="info-box">
      <strong>Objetivo Principal:</strong> ${formData.mainGoal}
    </div>
    <div class="info-box">
      <strong>Budget Mensal:</strong> ${formData.budget}
    </div>
    <div class="info-box">
      <strong>Desafios Atuais:</strong> ${formData.currentChallenges}
    </div>
  </div>

  <div class="section">
    <div class="section-title">🌍 ANÁLISE DE MERCADO</div>
    <div class="subsection">
      <div class="subsection-title">Contexto de Mercado</div>
      <p>${analysis.analise_mercado.contexto}</p>
    </div>
    <div class="subsection">
      <div class="subsection-title">✅ Oportunidades Identificadas</div>
      <ul>
        ${analysis.analise_mercado.oportunidades.map(op => `<li>${op}</li>`).join('')}
      </ul>
    </div>
    <div class="subsection">
      <div class="subsection-title">⚠️ Ameaças e Desafios</div>
      <ul>
        ${analysis.analise_mercado.ameacas.map(am => `<li>${am}</li>`).join('')}
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🔍 ANÁLISE DE CONCORRENTES</div>
    <p><em>Baseado nos concorrentes identificados: ${formData.competitors}</em></p>
    ${analysis.analise_concorrentes.map(conc => `
      <div class="competitor-card">
        <h3 style="color: #667eea; margin-top: 0;">${conc.concorrente}</h3>
        <div style="margin: 15px 0;">
          <strong>Estratégias Identificadas:</strong>
          <ul>
            ${conc.estrategias_identificadas.map(est => `<li>${est}</li>`).join('')}
          </ul>
        </div>
        <div style="margin: 15px 0;">
          <strong>Pontos Fortes:</strong>
          <ul>
            ${conc.pontos_fortes.map(pf => `<li>${pf}</li>`).join('')}
          </ul>
        </div>
        <div style="background: #d4edda; padding: 10px; border-radius: 5px;">
          <strong>🎯 Gaps de Oportunidade (onde você pode vencer):</strong>
          <ul>
            ${conc.gaps_oportunidade.map(gap => `<li>${gap}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <div class="section-title">🎯 ESTRATÉGIA DE SEGMENTAÇÃO</div>
    <div class="subsection">
      <div class="subsection-title">Públicos-Alvo Recomendados</div>
      ${analysis.estrategia_segmentacao.publicos_alvo.map(pub => `
        <div class="audience-card">
          <h4 style="margin-top: 0; color: #856404;">${pub.nome}</h4>
          <p><strong>Características:</strong></p>
          <ul>
            ${pub.caracteristicas.map(car => `<li>${car}</li>`).join('')}
          </ul>
          <p><strong>Por que segmentar este público:</strong><br>${pub.justificativa}</p>
        </div>
      `).join('')}
    </div>
    <div class="subsection">
      <div class="subsection-title">Recomendação de Canais</div>
      <div style="margin: 15px 0;">
        <h4>Facebook & Instagram Ads</h4>
        <p>${analysis.estrategia_segmentacao.recomendacao_canais.facebook_instagram.justificativa}</p>
        <p class="highlight">Budget Sugerido: ${analysis.estrategia_segmentacao.recomendacao_canais.facebook_instagram.budget_sugerido}</p>
      </div>
      <div style="margin: 15px 0;">
        <h4>Google Ads</h4>
        <p>${analysis.estrategia_segmentacao.recomendacao_canais.google_ads.justificativa}</p>
        <p class="highlight">Budget Sugerido: ${analysis.estrategia_segmentacao.recomendacao_canais.google_ads.budget_sugerido}</p>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🎨 PLANO CRIATIVO</div>
    <div class="subsection">
      <div class="subsection-title">Tipos de Conteúdo Recomendados</div>
      ${analysis.plano_criativo.tipos_conteudo.map(tipo => `
        <div style="background: white; border: 1px solid #dee2e6; padding: 15px; margin: 10px 0; border-radius: 5px;">
          <h4 style="color: #667eea; margin-top: 0;">${tipo.formato}</h4>
          <p><strong>Objetivo:</strong> ${tipo.objetivo}</p>
          <p><strong>Exemplo de Mensagem/Copy:</strong><br><em>"${tipo.exemplo_mensagem}"</em></p>
        </div>
      `).join('')}
    </div>
    <div class="subsection">
      <div class="subsection-title">Elementos-Chave para Criativos</div>
      <ul>
        ${analysis.plano_criativo.elementos_chave.map(elem => `<li>${elem}</li>`).join('')}
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="section-title">📈 MÉTRICAS DE SUCESSO</div>
    <p><em>Como vamos medir o sucesso desta estratégia:</em></p>
    ${analysis.metricas_sucesso.kpis_principais.map(kpi => `
      <div class="metric-card">
        <h4 style="margin-top: 0; color: #0c5460;">${kpi.metrica}</h4>
        <p><strong>Meta:</strong> ${kpi.meta}</p>
        <p><strong>Por que esta métrica importa:</strong><br>${kpi.explicacao}</p>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <div class="section-title">📅 CRONOGRAMA DE EXECUÇÃO</div>
    <div class="timeline">
      <div class="phase">
        <div class="phase-title">Fase 1: ${analysis.cronograma_execucao.fase1.nome}</div>
        <p><strong>Duração:</strong> ${analysis.cronograma_execucao.fase1.duracao}</p>
        <ul>
          ${analysis.cronograma_execucao.fase1.acoes.map(acao => `<li>${acao}</li>`).join('')}
        </ul>
      </div>
      <div class="phase">
        <div class="phase-title">Fase 2: ${analysis.cronograma_execucao.fase2.nome}</div>
        <p><strong>Duração:</strong> ${analysis.cronograma_execucao.fase2.duracao}</p>
        <ul>
          ${analysis.cronograma_execucao.fase2.acoes.map(acao => `<li>${acao}</li>`).join('')}
        </ul>
      </div>
      <div class="phase">
        <div class="phase-title">Fase 3: ${analysis.cronograma_execucao.fase3.nome}</div>
        <p><strong>Duração:</strong> ${analysis.cronograma_execucao.fase3.duracao}</p>
        <ul>
          ${analysis.cronograma_execucao.fase3.acoes.map(acao => `<li>${acao}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🚀 PRÓXIMOS PASSOS</div>
    <ol>
      ${analysis.proximos_passos.map(passo => `<li style="margin: 15px 0; font-size: 16px;">${passo}</li>`).join('')}
    </ol>
  </div>

  <div class="footer">
    <p><strong>Relatório gerado por ARCA SCAN</strong></p>
    <p>Análise estratégica de tráfego pago baseada em inteligência artificial</p>
    <p style="font-size: 12px; margin-top: 20px;">Data de geração: ${new Date().toLocaleDateString('pt-BR')}</p>
  </div>
</body>
</html>`;
  };

  const downloadPDF = () => {
    const blob = new Blob([generatePDFContent()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arca-scan-${formData.clientName.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAIInfo = (ai) => {
    const info = {
      claude: { name: 'Claude', color: 'purple', link: 'https://console.anthropic.com/' },
      gpt: { name: 'ChatGPT', color: 'green', link: 'https://platform.openai.com/api-keys' },
      gemini: { name: 'Gemini', color: 'blue', link: 'https://makersuite.google.com/app/apikey' }
    };
    return info[ai];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 size={40} />
            <h1 className="text-4xl font-bold">ARCA SCAN</h1>
          </div>
          <p className="text-lg opacity-90">Análise Estratégica Multi-IA</p>
        </div>

        {step === 1 && (
          <>
            <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Settings className="text-purple-600" />
                Selecione a IA
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {['claude', 'gpt', 'gemini'].map(ai => (
                  <button
                    key={ai}
                    onClick={() => setSelectedAI(ai)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedAI === ai ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="font-bold">{getAIInfo(ai).name}</div>
                  </button>
                ))}
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-800 mb-3">Chave de API necessária</p>
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Cole sua chave de API"
                  className="w-full p-3 border-2 rounded-lg focus:outline-none mb-2"
                />
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-xs text-blue-600"
                  >
                    {showApiKey ? 'Ocultar' : 'Mostrar'}
                  </button>
                  
                    href={getAIInfo(selectedAI).link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 underline"
                  >
                    Obter chave →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Informações do Cliente</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nome do Cliente *</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    className="w-full p-3 border-2 rounded-lg focus:outline-none"
                    placeholder="Ex: Loja Virtual Fashion"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Nicho *</label>
                  <input
                    type="text"
                    value={formData.niche}
                    onChange={(e) => handleInputChange('niche', e.target.value)}
                    className="w-full p-3 border-2 rounded-lg focus:outline-none"
                    placeholder="Ex: E-commerce de moda feminina"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Objetivo Principal *</label>
                  <textarea
                    value={formData.mainGoal}
                    onChange={(e) => handleInputChange('mainGoal', e.target.value)}
                    className="w-full p-3 border-2 rounded-lg focus:outline-none"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Budget Mensal *</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full p-3 border-2 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Concorrentes *</label>
                  <textarea
                    value={formData.competitors}
                    onChange={(e) => handleInputChange('competitors', e.target.value)}
                    className="w-full p-3 border-2 rounded-lg focus:outline-none"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Desafios Atuais *</label>
                  <textarea
                    value={formData.currentChallenges}
                    onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
                    className="w-full p-3 border-2 rounded-lg focus:outline-none"
                    rows="3"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (!apiKey) {
                    alert('Por favor, insira sua chave de API!');
                    return;
                  }
                  if (!formData.clientName || !formData.niche) {
                    alert('Preencha todos os campos obrigatórios!');
                    return;
                  }
                  setStep(2);
                }}
                className="w-full mt-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-bold"
              >
                Continuar para Análise
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Análise Estratégica</h2>
            {!loading && (
              <>
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <p><strong>Cliente:</strong> {formData.clientName}</p>
                  <p><strong>IA:</strong> {getAIInfo(selectedAI).name}</p>
                </div>
                <button
                  onClick={analyzeWithAI}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-bold"
                >
                  Iniciar Análise
                </button>
              </>
            )}
            {loading && (
              <div className="text-center py-12">
                <Loader2 className="animate-spin mx-auto mb-4 text-purple-600" size={48} />
                <p>Analisando...</p>
              </div>
            )}
          </div>
        )}

        {step === 3 && analysis && (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Relatório Pronto!</h2>
            <button
              onClick={downloadPDF}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-bold mb-4 flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Baixar Relatório
            </button>
            <button
              onClick={() => {
                setStep(1);
                setAnalysis(null);
                setFormData({ clientName: '', niche: '', mainGoal: '', budget: '', competitors: '', currentChallenges: '' });
              }}
              className="w-full bg-gray-200 py-3 rounded-lg"
            >
              Nova Análise
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
