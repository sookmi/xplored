service_name: XploreD

market_context:
domestic_competitors:
- name: Surfit
strength: large scale content curation
weakness: tool-focused discovery is inefficient

```
- name: Design Compass
  strength: deep expert analysis
  weakness: lacks production-ready assets

- name: YozmIT
  strength: broad IT insight
  weakness: not optimized for fast tool filtering

- name: DesignBase
  strength: beginner education
  weakness: lacks advanced professional systems
```

global_competitors:
- name: Product Hunt
strength: global trend discovery
weakness: limited Korean production relevance

```
- name: Mobbin
  strength: UI reference archive
  weakness: no production or asset layer
```

positioning_principles:

- id: P1
name: End-to-End Completion
rule: Always connect AI → System → Production tools in recommendation.
- id: P2
name: Korea-Optimized Practicality
rule: Prefer tools that support Korean production environment when relevant.
- id: P3
name: Curated Minimalism
rule: Recommend fewer, highly validated tools instead of long lists.

ai_decision_rules:

- when_user_asks_for: "design reference"
must_include: ["reference tool", "production option"]
- when_user_asks_for: "AI tool recommendation"
must_connect_to: ["design system", "real production workflow"]
- avoid:
    - generic tool list
    - trend-only recommendations
    - high-volume unfiltered suggestions
