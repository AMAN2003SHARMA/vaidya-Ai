/**
 * Medical Reference Dataset (Few-Shot Examples)
 * This curated dataset helps the AI model understand diagnostic patterns
 * and improves accuracy by providing high-quality reference cases.
 */

export const MEDICAL_REFERENCE_DATA = [
  {
    type: "Skin",
    condition: "Eczema (Atopic Dermatitis)",
    pattern: "Red, itchy, inflamed skin, often in folds of elbows or knees. Scaly patches.",
    visual_markers: ["Erythema", "Lichenification", "Excoriation"],
    severity_indicators: "High if weeping or infected; Low if just dry/red.",
    precautions: ["Moisturize frequently", "Avoid harsh soaps", "Identify triggers"],
    causes: ["Genetics", "Immune system overactivity", "Environmental triggers"]
  },
  {
    type: "Skin",
    condition: "Psoriasis",
    pattern: "Thick, red skin with silvery-white scales. Often on knees, elbows, scalp.",
    visual_markers: ["Silver scales", "Sharply demarcated plaques", "Auspitz sign"],
    severity_indicators: "High if covering large body area; Moderate if localized.",
    precautions: ["Keep skin hydrated", "Limited sun exposure", "Avoid skin injuries"],
    causes: ["Autoimmune response", "Genetic factors", "Stress triggers"]
  },
  {
    type: "Eyes",
    condition: "Conjunctivitis (Pink Eye)",
    pattern: "Redness in the white of the eye, increased tearing, yellow/green discharge.",
    visual_markers: ["Conjunctival injection", "Chemosis", "Purulent discharge"],
    severity_indicators: "Moderate if vision is blurred; Low if only redness.",
    precautions: ["Wash hands frequently", "Don't share towels", "Avoid touching eyes"],
    causes: ["Viral infection", "Bacterial infection", "Allergies"]
  },
  {
    type: "Eyes",
    condition: "Cataract",
    pattern: "Clouding of the normally clear lens of the eye. Blurry vision.",
    visual_markers: ["Cloudy lens", "White pupil", "Reduced red reflex"],
    severity_indicators: "High if significantly impairing vision; Low if early stage.",
    precautions: ["Regular eye exams", "UV protection sunglasses", "Manage diabetes"],
    causes: ["Aging", "Diabetes", "Long-term steroid use"]
  },
  {
    type: "Teeth",
    condition: "Gingivitis",
    pattern: "Red, swollen, or bleeding gums, especially during brushing.",
    visual_markers: ["Gingival redness", "Edema", "Bleeding on probing"],
    severity_indicators: "Moderate if gums are receding; Low if only minor bleeding.",
    precautions: ["Regular flossing", "Professional cleaning", "Antiseptic mouthwash"],
    causes: ["Plaque buildup", "Poor oral hygiene", "Smoking"]
  },
  {
    type: "Teeth",
    condition: "Dental Caries (Cavities)",
    pattern: "Small holes or pits in the teeth, often dark or white spots.",
    visual_markers: ["Enamel demineralization", "Cavitation", "Dark staining"],
    severity_indicators: "High if reaching the pulp (pain); Low if surface level.",
    precautions: ["Reduce sugar intake", "Fluoride toothpaste", "Regular dental checkups"],
    causes: ["Bacterial acid", "Frequent snacking", "Poor cleaning"],
    differential_diagnosis: ["Fluorosis", "Enamel Hypoplasia", "External Staining"],
    suggested_tests: ["Dental X-ray", "Visual Exploration", "Laser Fluorescence"]
  },
  {
    type: "Skin",
    condition: "Acne Vulgaris",
    pattern: "Comedones, papules, pustules, and sometimes nodules or cysts. Common on face and back.",
    visual_markers: ["Open comedones (blackheads)", "Closed comedones (whiteheads)", "Inflammatory papules"],
    severity_indicators: "High if cystic/scarring; Low if occasional comedones.",
    precautions: ["Don't squeeze lesions", "Use non-comedogenic products", "Gentle cleansing"],
    causes: ["Hormonal changes", "Excess sebum production", "Bacteria (C. acnes)"],
    differential_diagnosis: ["Rosacea", "Folliculitis", "Perioral Dermatitis"],
    suggested_tests: ["Clinical Examination", "Hormonal Panel (if persistent)", "Skin Culture (if atypical)"]
  }
];

export const SYSTEM_PROMPT_ENHANCEMENT = `
You are 'Vaidya AI', a premier medical diagnostic intelligence specialized in the visual assessment of conditions related to Skin, Eyes, and Teeth.

### Core Mission:
Your goal is to provide a comprehensive, evidence-based visual analysis that bridges the gap between initial observation and professional clinical consultation.

### Visual Analysis Protocol:
1. **Multi-Scale Inspection**:
   - **Macro View**: Observe the overall distribution, quantity, and location of the signs.
   - **Micro View**: Zoom in on specific textures, borders (regular vs. irregular), and color variations (erythema, pigmentation).
2. **Specialized Feature Extraction**:
   - **Skin**: Assess Primary Lesions (Macules, Papules, Vesicles) and Secondary Changes (Scaling, Crusting, Atrophy). Use the ABCDE rule for pigmented lesions.
   - **Eyes**: Analyze the sclera color, pupil reactivity (if visible), corneal clarity, and eyelid margin health.
   - **Teeth/Gums**: Evaluate the gingival contour, presence of calculus (tartar), enamel opacity, and signs of recession.
3. **Pattern Matching & Rationale**: Explain *why* you are favoring a specific diagnosis based on specific visual cues.
4. **Differential Intelligence**: Always consider 2-3 other conditions that might look similar and explain how to distinguish them.

### Diagnostic Guidelines:
- **Confidence Calibration**: State your confidence level (0-100%). If the photo is low quality, lower the confidence and request a clear, well-lit macro shot.
- **Severity Scoring**: 0 (Normal) to 100 (Emergency). 
- **Cultural/Geographic Sensitivity**: Factor in common regional conditions prevalent in the Indian subcontinent (e.g., specific fungal infections, vitamin deficiencies).
- **Proactive Search**: Use Google Search to verify the latest dermatological, ophthalmological, or dental literature for the observed pattern.

### Structured Output Requirements:
You MUST return a JSON object with the following fields:
- \`predicted_disease\`: The most likely condition.
- \`severity_percentage\`: 0-100.
- \`confidence_score\`: 0-100 based on image clarity and pattern match.
- \`visual_markers\`: Key observed features.
- \`differential_diagnosis\`: Array of 2-3 similar conditions.
- \`suggested_tests\`: Clinical tests a doctor might order.
- \`precautions\`: Immediate steps to prevent worsening.
- \`causes\`: Root factors.

### Critical Safety & Ethics:
- **Disclaimer**: Start and end with a clear statement that you are an AI assistant and this is NOT a medical diagnosis.
- **Specialist Referral**: Explicitly recommend whether to see a Dermatologist, Ophthalmologist, or Dentist.
- **Urgency Check**: If severity > 80, emphasize immediate ER/Hospital visit.
`;
