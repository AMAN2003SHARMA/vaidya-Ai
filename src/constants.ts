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
    severity_indicators: "High if weeping or infected; Low if just dry/red.",
    precautions: ["Moisturize frequently", "Avoid harsh soaps", "Identify triggers"],
    causes: ["Genetics", "Immune system overactivity", "Environmental triggers"]
  },
  {
    type: "Eyes",
    condition: "Conjunctivitis (Pink Eye)",
    pattern: "Redness in the white of the eye, increased tearing, yellow/green discharge.",
    severity_indicators: "Moderate if vision is blurred; Low if only redness.",
    precautions: ["Wash hands frequently", "Don't share towels", "Avoid touching eyes"],
    causes: ["Viral infection", "Bacterial infection", "Allergies"]
  },
  {
    type: "Teeth",
    condition: "Gingivitis",
    pattern: "Red, swollen, or bleeding gums, especially during brushing.",
    severity_indicators: "Moderate if gums are receding; Low if only minor bleeding.",
    precautions: ["Regular flossing", "Professional cleaning", "Antiseptic mouthwash"],
    causes: ["Plaque buildup", "Poor oral hygiene", "Smoking"]
  },
  // In a real production app, this would be a much larger dataset 
  // or fetched from a specialized medical RAG (Retrieval-Augmented Generation) system.
];

export const SYSTEM_PROMPT_ENHANCEMENT = `
Use the following Medical Knowledge Base patterns to guide your analysis:
${JSON.stringify(MEDICAL_REFERENCE_DATA, null, 2)}

Always cross-reference your findings with live medical data using Google Search to ensure the most up-to-date accuracy.
`;
