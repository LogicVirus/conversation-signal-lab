import { useMemo, useState } from 'react'
import './App.css'

type SignalScore = {
  label: string
  score: number
  evidence: string[]
  description: string
}

type ChannelProfile = {
  label: string
  score: number
  vibe: string
  keywords: string[]
}

const fillerWords = new Set(['like', 'you', 'know', 'just', 'really', 'kind', 'sort', 'basically', 'actually'])

const channelProfiles: ChannelProfile[] = [
  {
    label: 'Public broadcast / emergency-info vibe',
    score: 0,
    vibe: 'Civic, practical, broad-audience language. Think local news, weather, emergency updates, public-service framing.',
    keywords: ['public', 'everybody', 'emergency', 'weather', 'local', 'safety', 'community', 'broadcast', 'alert', 'official'],
  },
  {
    label: 'Discovery / science-explainer vibe',
    score: 0,
    vibe: 'Curiosity-first, mechanism-seeking, science/tooling language. Good fit for discovery, experiments, nature, engineering, systems.',
    keywords: ['science', 'data', 'pattern', 'calculate', 'detect', 'extrapolate', 'system', 'network', 'experiment', 'evidence'],
  },
  {
    label: 'Business / productivity-media vibe',
    score: 0,
    vibe: 'Optimization, strategy, workflow, outcomes, and practical leverage. Useful for founder/product conversations.',
    keywords: ['project', 'users', 'stats', 'framework', 'product', 'market', 'workflow', 'optimize', 'growth', 'business'],
  },
  {
    label: 'Entertainment / culture-feed vibe',
    score: 0,
    vibe: 'Story, celebrity, sports, media references, and socially contagious topics. Better detected when examples are present.',
    keywords: ['show', 'watch', 'movie', 'sports', 'music', 'celebrity', 'story', 'trend', 'viral', 'episode'],
  },
]

const starterText = `A simple conversation can be recorded and signal can be extrapolated from a short conversation by matching word clouds and patterns. You can sometimes tell what network someone likely watches because each provider has a vibe: public broadcast, emergency situations, Discovery science, and so on. I want percentages and suggested subtle questions that improve detection.`

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function topWords(tokens: string[]) {
  const counts = new Map<string, number>()
  for (const token of tokens) {
    if (token.length < 4 || fillerWords.has(token)) continue
    counts.set(token, (counts.get(token) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 18)
    .map(([word, count]) => ({ word, count }))
}

function percent(value: number) {
  return `${Math.round(value)}%`
}

function scoreChannels(tokens: string[]) {
  const tokenSet = new Set(tokens)
  const scored = channelProfiles.map((profile) => {
    const hits = profile.keywords.filter((keyword) => tokenSet.has(keyword))
    return {
      ...profile,
      score: hits.length === 0 ? 4 : Math.min(92, 22 + hits.length * 14),
      keywords: hits.length ? hits : profile.keywords.slice(0, 3),
    }
  })

  const total = scored.reduce((sum, item) => sum + item.score, 0) || 1
  return scored
    .map((item) => ({ ...item, score: (item.score / total) * 100 }))
    .sort((a, b) => b.score - a.score)
}

function buildSignals(text: string, tokens: string[], top: ReturnType<typeof topWords>): SignalScore[] {
  const avgWordLength = tokens.length ? tokens.join('').length / tokens.length : 0
  const questionCount = (text.match(/\?/g) ?? []).length
  const commaCount = (text.match(/,/g) ?? []).length
  const uniqueRatio = tokens.length ? new Set(tokens).size / tokens.length : 0
  const dataWords = ['data', 'calculate', 'pattern', 'percentages', 'stats', 'detect', 'extrapolate', 'signal'].filter((word) => tokens.includes(word))
  const socialWords = ['someone', 'users', 'conversation', 'talk', 'people', 'public'].filter((word) => tokens.includes(word))

  return [
    {
      label: 'Systems thinking',
      score: Math.min(96, 34 + dataWords.length * 10 + uniqueRatio * 25),
      evidence: dataWords,
      description: 'Looks for pattern, model, measurement, and abstraction language — not IQ, just thinking style signals.',
    },
    {
      label: 'Exploratory / idea velocity',
      score: Math.min(94, 38 + Math.min(tokens.length, 120) / 2 + commaCount * 1.4),
      evidence: top.slice(0, 5).map((item) => item.word),
      description: 'Long chains of connected concepts suggest high ideation speed and loose first-draft exploration.',
    },
    {
      label: 'Social inference focus',
      score: Math.min(92, 28 + socialWords.length * 11 + questionCount * 6),
      evidence: socialWords,
      description: 'Detects interest in other people, conversation strategy, audience fit, and behavioral cues.',
    },
    {
      label: 'Lexical density',
      score: Math.min(90, 20 + avgWordLength * 8 + uniqueRatio * 28),
      evidence: [`avg word ${avgWordLength.toFixed(1)} chars`, `${Math.round(uniqueRatio * 100)}% unique`],
      description: 'A rough language-complexity metric. Useful as one input, never a person-ranking score.',
    },
  ]
}

function suggestedPrompts(channels: ReturnType<typeof scoreChannels>) {
  const top = channels[0]
  return [
    `When something big happens, where do you usually check first: local alerts, social feeds, TV, YouTube, or a specific app?`,
    `If you had 20 minutes to watch something useful, would you pick news, science, business, repairs, history, or entertainment?`,
    `Do you trust quick headlines, long explainers, official alerts, or people you already follow?`,
    top ? `Since the strongest current match is “${top.label}”, ask for one recent example they found useful and compare the nouns/verbs they use.` : '',
  ].filter(Boolean)
}

function App() {
  const [text, setText] = useState(starterText)
  const analysis = useMemo(() => {
    const tokens = tokenize(text)
    const words = topWords(tokens)
    const channels = scoreChannels(tokens)
    const signals = buildSignals(text, tokens, words)
    return { tokens, words, channels, signals, prompts: suggestedPrompts(channels) }
  }, [text])

  return (
    <main className="shell">
      <section className="hero-panel">
        <p className="eyebrow">Conversation Signal Lab</p>
        <h1>Extract useful patterns from short conversations — carefully.</h1>
        <p className="hero-copy">
          Paste a short exchange and get word-cloud clues, communication-style signals, likely media-affinity vibes,
          and follow-up questions that improve confidence. Built for consent-based insight, not covert profiling.
        </p>
      </section>

      <section className="workspace">
        <div className="input-card">
          <label htmlFor="conversation">Conversation sample</label>
          <textarea
            id="conversation"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste 3–12 sentences here..."
          />
          <div className="stats-row">
            <span>{analysis.tokens.length} words</span>
            <span>{new Set(analysis.tokens).size} unique</span>
            <span>{analysis.words.length} cloud terms</span>
          </div>
        </div>

        <div className="insight-card guardrail">
          <h2>Guardrail</h2>
          <p>
            The app should report probabilities and evidence, not facts about a person. Avoid sensitive traits, hidden surveillance,
            or “intellect scores.” Use communication-style labels and confidence instead.
          </p>
        </div>
      </section>

      <section className="grid two">
        <div className="insight-card">
          <h2>Word cloud</h2>
          <div className="word-cloud">
            {analysis.words.map((item) => (
              <span key={item.word} style={{ fontSize: `${0.9 + item.count * 0.22}rem` }}>
                {item.word}
              </span>
            ))}
          </div>
        </div>

        <div className="insight-card">
          <h2>Likely media-affinity vibes</h2>
          <div className="stack">
            {analysis.channels.map((channel) => (
              <article className="score-row" key={channel.label}>
                <div>
                  <strong>{channel.label}</strong>
                  <p>{channel.vibe}</p>
                  <small>Matched: {channel.keywords.join(', ')}</small>
                </div>
                <span>{percent(channel.score)}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid two">
        <div className="insight-card">
          <h2>Communication signals</h2>
          <div className="stack">
            {analysis.signals.map((signal) => (
              <article className="signal" key={signal.label}>
                <div className="signal-head">
                  <strong>{signal.label}</strong>
                  <span>{percent(signal.score)}</span>
                </div>
                <div className="meter"><i style={{ width: `${signal.score}%` }} /></div>
                <p>{signal.description}</p>
                <small>{signal.evidence.length ? `Evidence: ${signal.evidence.join(', ')}` : 'Evidence: weak/none yet'}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="insight-card">
          <h2>Subtle follow-up prompts</h2>
          <ol className="prompts">
            {analysis.prompts.map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}

export default App
