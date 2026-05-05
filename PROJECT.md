# Conversation Signal Lab

A new web project for extracting useful, probabilistic signals from short conversations.

## Core idea

A short conversation can reveal measurable language patterns: recurring word clouds, topic affinity, framing habits, confidence markers, curiosity style, and media/content vibe. The product turns those signals into percentages, evidence, and suggested follow-up prompts that improve confidence.

## Important boundary

This should be consent-first and evidence-first. It should not claim to know hidden private traits, rank someone's intellect, or covertly profile people. The safer product language is:

- communication style
- topic affinity
- media-affinity vibe
- confidence level
- lexical density
- curiosity/ideation style
- suggested questions to improve signal quality

## MVP

- Paste a short conversation sample.
- Tokenize and build a word cloud.
- Score channel/content affinity vibes:
  - public broadcast / emergency-info
  - Discovery / science explainer
  - business / productivity media
  - entertainment / culture feed
- Score communication signals:
  - systems thinking
  - exploratory idea velocity
  - social inference focus
  - lexical density
- Generate subtle follow-up prompts to collect better signal.

## Next model layer

Replace static keyword scoring with a transparent local pipeline:

1. Token frequency and phrase extraction.
2. Domain lexicons per media/content archetype.
3. Conversation features: sentence length, question density, certainty markers, hedging, abstract/concrete noun ratio.
4. Confidence calibration based on sample length and evidence diversity.
5. Optional LLM explanation layer that cites only text evidence.

## Product direction

Potential names:

- SignalCloud
- Vibeprint
- Conversation Signal Lab
- Pattern Static
- Social Spectrometer

Best first use cases:

- sales/customer discovery prep
- support personalization
- matching content recommendations
- coaching better follow-up questions
- research interviews and user testing
