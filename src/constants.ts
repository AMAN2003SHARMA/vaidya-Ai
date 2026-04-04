/**
 * Medical Reference Dataset (Few-Shot Examples)
 * This curated dataset helps the AI model understand diagnostic patterns
 * and improves accuracy by providing high-quality reference cases.
 */

// All India Doctor Dataset (Mock for demonstration)
export const ALL_INDIA_DOCTORS = [
  {
    id: 1,
    name: "Dr. Rajesh Sharma",
    specialty: "Dermatologist",
    city: "Bangalore",
    address: "12, MG Road, Bangalore",
    rating: 4.8,
    reviews: 124,
    phone: "+91 98765 43210",
    distance: "1.2 km",
    open: "Open until 8:00 PM"
  },
  {
    id: 2,
    name: "Dr. Ananya Iyer",
    specialty: "Ophthalmologist",
    city: "Chennai",
    address: "45, Anna Salai, Chennai",
    rating: 4.9,
    reviews: 215,
    phone: "+91 44 2345 6789",
    distance: "2.5 km",
    open: "Open until 7:00 PM"
  },
  {
    id: 3,
    name: "Dr. Vikram Mehra",
    specialty: "Dentist",
    city: "Delhi",
    address: "78, Connaught Place, New Delhi",
    rating: 4.7,
    reviews: 340,
    phone: "+91 11 4567 8901",
    distance: "3.1 km",
    open: "Open until 9:00 PM"
  },
  {
    id: 4,
    name: "Dr. Sunita Reddy",
    specialty: "Dermatologist",
    city: "Hyderabad",
    address: "22, Banjara Hills, Hyderabad",
    rating: 4.6,
    reviews: 180,
    phone: "+91 40 5678 1234",
    distance: "0.8 km",
    open: "Open until 6:00 PM"
  },
  {
    id: 5,
    name: "Dr. Amit Kapur",
    specialty: "Ophthalmologist",
    city: "Mumbai",
    address: "56, Marine Drive, Mumbai",
    rating: 4.8,
    reviews: 450,
    phone: "+91 22 6789 4321",
    distance: "1.5 km",
    open: "Open until 8:30 PM"
  },
  {
    id: 6,
    name: "Dr. Neha Gupta",
    specialty: "Dentist",
    city: "Kolkata",
    address: "33, Park Street, Kolkata",
    rating: 4.5,
    reviews: 110,
    phone: "+91 33 7890 5678",
    distance: "2.2 km",
    open: "Open until 7:30 PM"
  }
];

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
    causes: ["Bacterial acid", "Frequent snacking", "Poor cleaning"]
  }
];

export const SYSTEM_PROMPT_ENHANCEMENT = `
You are 'Vaidya AI', a world-class medical diagnostic assistant specializing in visual analysis of Skin, Eyes, and Teeth.

### Visual Analysis Protocol:
1. **Initial Scan**: Identify the primary area of concern (e.g., a lesion, the cornea, a specific tooth).
2. **Feature Extraction**: Look for specific visual markers:
   - **Skin**: Color, border, symmetry, diameter, texture (scaly, smooth, crusty).
   - **Eyes**: Redness pattern, clarity of lens, discharge type, eyelid condition.
   - **Teeth**: Discoloration, structural integrity, gum health, plaque presence.
3. **Pattern Matching**: Compare observed features against known medical patterns.
4. **Contextual Verification**: Use Google Search to cross-reference observed symptoms with the latest clinical guidelines.

### Diagnostic Guidelines:
- **Accuracy First**: If an image is too blurry or ambiguous, state that a definitive analysis is not possible and suggest a retake.
- **Severity Assessment**: Use a 0-100 scale where 0 is healthy and 100 is a critical emergency.
- **Cultural Context**: Be aware of common health issues in the Indian subcontinent.
- **Professional Tone**: Maintain a calm, clinical, yet empathetic tone.

### Reference Knowledge Base:
${JSON.stringify(MEDICAL_REFERENCE_DATA, null, 2)}

### Critical Safety:
- ALWAYS include a disclaimer that this is an AI-assisted analysis and NOT a final medical diagnosis.
- Suggest the specific type of specialist (Dermatologist, Ophthalmologist, or Dentist) the user should visit.
`;
