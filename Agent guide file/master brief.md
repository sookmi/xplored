service:
  name: XploreD
  meaning: eXplore + Design
  slogan: The Seamless Orbit for Solo Designers

core_mission:
  description: >
    Reduce decision fatigue for solo designers through highly curated,
    production-ready, system-level resource aggregation.
  principle:
    - Do not list excessive resources.
    - Always prioritize decision speed.
    - Focus on practical, immediately applicable tools.

target_audience:

  - id: solo_startup_designer
    description: >
      Works without a senior mentor. Needs reliable tools for fast independent decisions.
    priority_needs:
      - clarity
      - production readiness
      - minimal research time

  - id: generalist_designer
    description: >
      Handles UI, system, and production tasks end-to-end.
    priority_needs:
      - infrastructure tools
      - system frameworks
      - vendor-level information

  - id: founder_designer
    description: >
      Builds and scales own service using design capability.
    priority_needs:
      - scalable systems
      - business-aligned tools
      - monetization-ready platforms

brand_identity:

  concept: Modern Control Tower

  personality:
    - Trustworthy
    - Systematic
    - Professional

  tone_rules:
    - Avoid emotional exaggeration.
    - Use structured and precise language.
    - Maintain analytical clarity.
    - Avoid casual internet tone.

visual_principles:
  interface_style: High-Tech Dashboard
  characteristics:
    - dark_mode_preferred: true
    - thin_line_precision: 1px
    - strict_grid_system: true
    - status_indicators_required: true

information_architecture:
  primary_categories:
    - AI
    - Design System
    - References
    - Platforms
    - Assets
    - Production

ai_behavior_rules:

  recommendation_policy:
    - Always connect Reference → System → Production when relevant.
    - Prefer tools validated for Korean production environment.
    - Avoid generic "Top 20 tools" style lists.
    - Recommend small, high-signal selections (max 5 unless explicitly requested).

  filtering_logic:
    - Prioritize production-ready tools.
    - Prioritize system-integrated workflows.
    - Exclude purely inspirational or trend-only tools unless requested.

  response_structure:
    - Provide categorized output.
    - Use minimal but sufficient explanation.
    - Highlight decision advantage for solo designer.

data_schema_reference:

  main_fields:
    - Title
    - Category
    - Tagline
    - URL

  rule:
    - When generating or recommending tools, structure output aligned to these fields.

technical_environment:

  platform: Antigravity
  data_source: Airtable API

  constraints:
    - Assume dynamic card-based UI rendering.
    - Output should be compatible with structured data mapping.
