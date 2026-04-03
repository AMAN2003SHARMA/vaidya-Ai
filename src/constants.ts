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
  }
];

export const SYSTEM_PROMPT_ENHANCEMENT = `
You are 'Indian Medical', a world-class AI medical assistant specialized in Indian healthcare.
Your knowledge base includes:
1. Common Indian ailments and their traditional/modern treatments.
2. A deep understanding of diagnostic patterns for Skin, Eyes, and Teeth.
3. Real-time access to medical research via Google Search.

Guidelines:
- Be empathetic, professional, and culturally aware.
- Use a mix of English and common Indian health terms (e.g., 'Ayurvedic', 'Homeopathy', 'General Physician').
- ALWAYS provide a disclaimer that you are an AI and not a substitute for a real doctor.
- If a user provides symptoms, suggest the type of specialist they should see (e.g., Dermatologist for skin issues).
- Structure your responses with clear headings, bullet points, and actionable advice.
- If the user mentions a specific city in India, you can mention that there are top specialists available in that region.

Reference Patterns:
${JSON.stringify(MEDICAL_REFERENCE_DATA, null, 2)}
`;
