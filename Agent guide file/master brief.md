service:
  name: 엑스플로디 (XploreD)
  slogan:
    kr: "아이디어에서 결과물까지, 디자이너의 검증된 키트."
    en: "The Designer's Survival Kit."
  core_mission:
    description: >
      Reduce decision fatigue for solo and founder-designers through highly curated,
      production-ready, system-level resource aggregation.
    principles:
      - "Do not list excessive resources; prioritize decision speed."
      - "Focus on 'Verified Kits' that cover the workflow from idea to output."
      - "Maintain high-signal curation for the Korean production environment."

target_audience:
  - id: solo_startup_designer
    description: "Works without a senior mentor. Needs reliable tools for fast independent decisions."
  - id: founder_designer
    description: "Builds and scales own services. Needs tools that bridge design and business."
  - id: generalist_designer
    description: "Handles end-to-end tasks from UI to production infrastructure."

brand_identity:
  concept: "Modern Control Tower"
  personality: [Trustworthy, Systematic, Professional]
  visual_principles:
    style: "High-Tech Dashboard"
    specs:
      - "Dark mode: Required"
      - "Precision: 1px thin-line & strict grid"
      - "Point Color: Emerald (#50C878) for status indicators"

information_architecture:
  primary_categories:
    - id: AI_Automation
      tags: [image, text, music, etc]
      desc: "Intelligence tools for planning and repetitive tasks."
    - id: Design_System
      tags: [blueprint, kit, code]
      desc: "Blueprints and component libraries from global leaders."
    - id: References
      tags: [analysis, color, font, icon, screen, image, brand, domain]
      desc: "Strategic insights and structural analysis for decision making."
      key_tag: "analysis (Focus on HTML-to-design and structural breakdown)"
    - id: Platforms
      tags: [no-code, collaboration, management]
      desc: "Infrastructure for production and team collaboration."
    - id: Assets
      tags: [3d, mockup, illustration]
      desc: "High-quality raw materials for design detailing."
    - id: Production
      tags: [print, infra, logistics]
      desc: "Specialized infrastructure for Korean production and business."

ai_behavior_rules:
  recommendation_policy:
    - "Connect Idea → Reference → Production in every consultation."
    - "Tag resources strictly using the defined Taxonomy."
    - "Use 'Explored Tip' to provide professional context (Why this tool?)."
  response_structure:
    - "Categorized output aligned with the 6 primary categories."
    - "Minimalist but analytical explanation."
    - "Highlight the 'Survival Advantage' for solo designers."

data_schema_reference:
  main_fields: [Title, Category, Tag, Tagline, Explored_Tip, URL]
  constraints: "Tags must be a subset of the assigned Category's tag list."

technical_environment:
  platform: Antigravity
  data_source: Airtable API
  constraints: "Ensure high-fidelity rendering for 1px lines and grid systems."
