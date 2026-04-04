import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { GoogleGenAI, Type } from '@google/genai';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Upload, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle2, 
  Activity,
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { SYSTEM_PROMPT_ENHANCEMENT } from '../constants';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AnalysisResult {
  predicted_disease: string;
  severity_percentage: number;
  confidence_score: number;
  visual_markers: string[];
  precautions: string[];
  causes: string[];
}

export default function Dashboard() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [type, setType] = useState<'Skin' | 'Eyes' | 'Teeth'>('Skin');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setResult(null);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setError('');

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API Key is missing. Please set GEMINI_API_KEY in your environment variables.');
      }
      const ai = new GoogleGenAI({ apiKey });
      const base64Data = image.split(',')[1];
      const model = 'gemini-3.1-pro-preview';
      
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data
              }
            },
            {
              text: `Analyze this medical image of ${type}. 
              
              ${SYSTEM_PROMPT_ENHANCEMENT}
              
              Return a JSON object with: predicted_disease (string), severity_percentage (number 0-100), confidence_score (number 0-100), visual_markers (array of strings), precautions (array of strings), and causes (array of strings). 
              
              Be professional, accurate, and cross-reference with live medical research using Google Search.
              
              IMPORTANT: Return ONLY the JSON object, no other text.`
            }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          tools: [{ googleSearch: {} }],
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              predicted_disease: { type: Type.STRING },
              severity_percentage: { type: Type.NUMBER },
              confidence_score: { type: Type.NUMBER },
              visual_markers: { type: Type.ARRAY, items: { type: Type.STRING } },
              precautions: { type: Type.ARRAY, items: { type: Type.STRING } },
              causes: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['predicted_disease', 'severity_percentage', 'confidence_score', 'visual_markers', 'precautions', 'causes']
          }
        }
      });

      const text = response.text || '';
      let analysis: AnalysisResult;
      
      try {
        // Try to find JSON in the response text if it's not pure JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        analysis = JSON.parse(jsonStr) as AnalysisResult;
      } catch (parseErr) {
        console.error('Failed to parse AI response:', text);
        throw new Error('The AI model returned an invalid response format. Please try again.');
      }

      if (!analysis.predicted_disease) {
        throw new Error('The AI model could not identify a condition. Please provide a clearer image.');
      }

      setResult(analysis);

      // Save to Firestore
      if (auth.currentUser) {
        const path = 'diagnostics';
        try {
          await addDoc(collection(db, path), {
            uid: auth.currentUser.uid,
            type,
            imageUrl: image, // In real app, upload to Storage first
            predictedDisease: analysis.predicted_disease,
            severityPercentage: analysis.severity_percentage,
            confidenceScore: analysis.confidence_score,
            visualMarkers: analysis.visual_markers,
            precautions: analysis.precautions,
            causes: analysis.causes,
            timestamp: serverTimestamp()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, path);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to analyze image. Please try again with a clearer photo.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    { name: 'Severity', value: result.severity_percentage },
    { name: 'Healthy', value: 100 - result.severity_percentage }
  ] : [];

  const COLORS = ['#ef4444', '#e2e8f0'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Diagnostic Dashboard</h1>
          <p className="text-gray-500">Upload a photo for instant AI-powered health analysis</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
          {(['Skin', 'Eyes', 'Teeth'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setType(t); setImage(null); setResult(null); }}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                type === t 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div 
            {...getRootProps()} 
            className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6 ${
              isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white hover:border-indigo-400'
            }`}
          >
            <input {...getInputProps()} />
            {image ? (
              <>
                <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                  Change Image
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-lg font-semibold text-gray-900">Click or drag to upload</p>
                <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG (Max 5MB)</p>
              </div>
            )}
          </div>

          <button
            onClick={analyzeImage}
            disabled={!image || loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing with Vaidya AI...
              </>
            ) : (
              <>
                <Activity className="w-6 h-6" />
                Start Analysis
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Analysis Complete
                  </span>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                    {result.predicted_disease}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                      <Sparkles className="w-3 h-3" />
                      Confidence: {result.confidence_score}%
                    </div>
                  </div>
                </div>
                <div className="w-32 h-32 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius={35}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{result.severity_percentage}%</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Severity</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-bold text-gray-900">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    Visual Markers
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.visual_markers.map((marker, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-md border border-gray-200">
                        {marker}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-bold text-gray-900">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Possible Causes
                  </h3>
                  <ul className="space-y-2">
                    {result.causes.map((cause, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-bold text-gray-900">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Precautions
                  </h3>
                  <ul className="space-y-2">
                    {result.precautions.map((pre, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        {pre}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-sm text-indigo-900 leading-relaxed">
                  Based on this diagnosis, we recommend consulting a specialist. You can find nearby doctors in the <strong>Find Doctors</strong> tab.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Analysis Yet</h3>
              <p className="text-gray-500 max-w-xs">
                Upload an image and click "Start Analysis" to see AI-powered medical insights here.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
