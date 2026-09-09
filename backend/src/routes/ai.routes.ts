import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { aiConsultSchema, interactionCheckSchema, ocrSchema } from '../validators/schemas.js';

const router = Router();
router.use(requireAuth);

function getAI(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not configured');
  return new GoogleGenAI({ apiKey: key });
}

// ── POST /api/ai/consult ─────────────────────────────────────────────────────
router.post('/consult', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { question, medicationContext, allergies } = aiConsultSchema.parse(req.body);
    const ai = getAI();

    const contextBlocks: string[] = [];
    if (medicationContext?.length) {
      contextBlocks.push(`Patient's current medications: ${medicationContext.join(', ')}.`);
    }
    if (allergies) {
      contextBlocks.push(`Known allergies: ${allergies}.`);
    }

    const systemPrompt = [
      'You are Dr. Julian Scott, a licensed clinical pharmacist at GenericMed.',
      'Provide accurate, evidence-based answers about medications, dosing, interactions, and generic equivalents.',
      'Always recommend consulting a physician for diagnosis or treatment changes.',
      'Keep responses concise (under 200 words) and patient-friendly.',
      ...contextBlocks,
    ].join(' ');

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: question,
      config: { systemInstruction: systemPrompt, maxOutputTokens: 512 },
    });

    res.json({ answer: response.text });
  } catch (error) {
    next(error);
  }
});

// ── POST /api/ai/interactions ────────────────────────────────────────────────
router.post('/interactions', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { medications, allergies } = interactionCheckSchema.parse(req.body);
    const ai = getAI();

    const allergyNote = allergies ? ` Patient allergies: ${allergies}.` : '';

    const prompt = [
      `Analyze the following medications for potential drug-drug interactions: ${medications.join(', ')}.${allergyNote}`,
      'Return a JSON array with this exact shape (no markdown, no explanation, just JSON):',
      '[{"drug1":"","drug2":"","severity":"minor"|"moderate"|"major"|"contraindicated","description":"","recommendation":""}]',
      'If there are no interactions, return an empty array: []',
    ].join(' ');

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    });

    let interactions: unknown = [];
    try {
      interactions = JSON.parse(response.text ?? '[]');
    } catch {
      interactions = [];
    }

    res.json({ interactions, checkedMedications: medications });
  } catch (error) {
    next(error);
  }
});

// ── POST /api/ai/ocr ─────────────────────────────────────────────────────────
router.post('/ocr', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { imageBase64, mimeType } = ocrSchema.parse(req.body);
    const ai = getAI();

    const prompt = [
      'Extract prescription information from this image.',
      'Return a JSON object with this exact shape (no markdown, just JSON):',
      '{"medicationName":"","strength":"","form":"","doctorName":"","doctorNpi":"","clinicName":"","clinicPhone":"","sig":"","qtyPrescribed":0,"refillsTotal":0,"daysSupply":0}',
      'Use empty string for missing text fields and 0 for missing numbers.',
    ].join(' ');

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: imageBase64 } },
        ],
      } as Parameters<typeof ai.models.generateContent>[0]['contents'],
      config: {
        maxOutputTokens: 512,
        responseMimeType: 'application/json',
      },
    });

    let extracted: unknown = {};
    try {
      extracted = JSON.parse(response.text ?? '{}');
    } catch {
      extracted = {};
    }

    res.json({ extracted });
  } catch (error) {
    next(error);
  }
});

export { router as aiRouter };
