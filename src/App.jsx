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

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f3e8ff, #dbeafe)',
      padding: '24px'
    },
    maxWidth: {
      maxWidth: '896px',
      margin: '0 auto'
    },
    header: {
      background: 'linear-gradient(to right, #9333ea, #3b82f6)',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      padding: '32px',
      marginBottom: '32px',
      color: 'white'
    },
    headerTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    h1: {
      fontSize: '36px',
      fontWeight: 'bold',
      margin: 0
    },
    subtitle: {
      fontSize: '18px',
      opacity: 0.9
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '32px',
      marginBottom: '24px'
    },
    cardSmall: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    buttonGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      marginBottom: '16px'
    },
    aiButton: {
      padding: '16px',
      borderRadius: '8px',
      border: '2px solid',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: 'white',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    aiButtonActive: {
      borderColor: '#9333ea',
      background: '#f3e8ff'
    },
    aiButtonInactive: {
      borderColor: '#e5e7eb'
    },
    infoBox: {
      background: '#eff6ff',
      borderLeft: '4px solid #3b82f6',
      padding: '16px',
      borderRadius: '8px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      marginBottom: '8px'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      resize: 'vertical'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    button: {
      width: '100%',
      background: 'linear-gradient(to right, #9333ea, #3b82f6)',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '32px'
    },
    buttonGreen: {
      background: 'linear-gradient(to right, #16a34a, #0d9488)',
      marginBottom: '16px'
    },
    buttonGray: {
      background: '#e5e7eb',
      color: '#374151',
      marginTop: '0'
    },
    summaryBox: {
      background: '#eff6ff',
      padding: '24px',
      borderRadius: '8px',
      marginBottom: '24px'
    },
    smallText: {
      fontSize: '14px',
      color: '#3b82f6',
      marginBottom: '12px'
    },
    loader: {
      textAlign: 'center',
      padding: '48px 0'
    }
  };

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
    .section { margin-bottom: 40px; }
    .section-title { color: #667eea; font-size: 24px; border-bottom: 3px solid #667eea; padding-bottom: 10px; margin-bottom: 20px; }
    ul { margin: 10px 0; padding-left: 25px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎯 ARCA SCAN - Relatório Estratégico</h1>
    <p><strong>Cliente:</strong> ${formData.clientName} | <strong>Nicho:</strong> ${formData.niche}</p>
    <p style="font-size: 12px;">Gerado com: ${aiNames[selectedAI]}</p>
  </div>
  <div class="section">
    <div class="section-title">📊 ANÁLISE DE MERCADO</div>
    <p>${analysis.analise_mercado.contexto}</p>
    <h3>Oportunidades:</h3>
    <ul>${analysis.analise_mercado.oportunidades.map(op => `<li>${op}</li>`).join('')}</ul>
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
      claude: { name: 'Claude', link: 'https://console.anthropic.com/' },
      gpt: { name: 'ChatGPT', link: 'https://platform.openai.com/api-keys' },
      gemini: { name: 'Gemini', link: 'https://makersuite.google.com/app/apikey' }
    };
    return info[ai];
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <BarChart3 size={40} />
            <h1 style={styles.h1}>ARCA SCAN</h1>
          </div>
          <p style={styles.subtitle}>Análise Estratégica Multi-IA</p>
        </div>

        {step === 1 && (
          <>
            <div style={styles.cardSmall}>
              <h3 style={styles.sectionTitle}>
                <Settings size={20} color="#9333ea" />
                Selecione a IA
              </h3>
              <div style={styles.buttonGrid}>
                {['claude', 'gpt', 'gemini'].map(ai => (
                  <button
                    key={ai}
                    onClick={() => setSelectedAI(ai)}
                    style={{
                      ...styles.aiButton,
                      ...(selectedAI === ai ? styles.aiButtonActive : styles.aiButtonInactive)
                    }}
                  >
                    {getAIInfo(ai).name}
                  </button>
                ))}
              </div>
              <div style={styles.infoBox}>
                <p style={styles.smallText}>Chave de API necessária</p>
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Cole sua chave de API"
                  style={styles.input}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
                  >
                    {showApiKey ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <a href={getAIInfo(selectedAI).link} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
                    Obter chave →
                  </a>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Informações do Cliente</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome do Cliente *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  style={styles.input}
                  placeholder="Ex: Loja Virtual Fashion"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Nicho *</label>
                <input
                  type="text"
                  value={formData.niche}
                  onChange={(e) => handleInputChange('niche', e.target.value)}
                  style={styles.input}
                  placeholder="Ex: E-commerce de moda feminina"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Objetivo Principal *</label>
                <textarea
                  value={formData.mainGoal}
                  onChange={(e) => handleInputChange('mainGoal', e.target.value)}
                  style={styles.textarea}
                  rows="3"
                  placeholder="Ex: Aumentar vendas em 30% nos próximos 3 meses"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Budget Mensal *</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  style={styles.input}
                  placeholder="Ex: R$ 5.000,00"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Concorrentes *</label>
                <textarea
                  value={formData.competitors}
                  onChange={(e) => handleInputChange('competitors', e.target.value)}
                  style={styles.textarea}
                  rows="3"
                  placeholder="Ex: Concorrente A, Concorrente B, Concorrente C"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Desafios Atuais *</label>
                <textarea
                  value={formData.currentChallenges}
                  onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
                  style={styles.textarea}
                  rows="3"
                  placeholder="Ex: Custo por aquisição muito alto"
                />
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
                style={styles.button}
              >
                Continuar para Análise
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div style={styles.card}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Análise Estratégica</h2>
            {!loading && (
              <>
                <div style={styles.summaryBox}>
                  <p><strong>Cliente:</strong> {formData.clientName}</p>
                  <p><strong>IA:</strong> {getAIInfo(selectedAI).name}</p>
                </div>
                <button onClick={analyzeWithAI} style={styles.button}>
                  Iniciar Análise
                </button>
              </>
            )}
            {loading && (
              <div style={styles.loader}>
                <Loader2 size={48} color="#9333ea" style={{ animation: 'spin 1s linear infinite' }} />
                <p>Analisando...</p>
              </div>
            )}
          </div>
        )}

        {step === 3 && analysis && (
          <div style={styles.card}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Relatório Pronto!</h2>
            <button onClick={downloadPDF} style={{ ...styles.button, ...styles.buttonGreen }}>
              <Download size={20} />
              Baixar Relatório
            </button>
            <button
              onClick={() => {
                setStep(1);
                setAnalysis(null);
                setFormData({ clientName: '', niche: '', mainGoal: '', budget: '', competitors: '', currentChallenges: '' });
              }}
              style={{ ...styles.button, ...styles.buttonGray }}
            >
              Nova Análise
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
