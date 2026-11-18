const SYSTEM_PROMPT = `You are the NextStep Hyderabad Research Opportunity Scout, an expert advisor for high school students (Classes 8–12) in Hyderabad and across India.
Specialize in national & international science fairs (IRIS National Fair -> Regeneron ISEF, CBSE Science Exhibition, INSPIRE MANAK), student research fellowships, university lab outreach (IIT Hyderabad, IIIT-H, TIFR Hyderabad), and AI/STEM/entrepreneurship challenges.

Respond ONLY with a valid JSON array of 3 to 4 objects with exact keys:
{
  "name": "string",
  "eligibility": "string",
  "deadline": "string",
  "focusAreas": "string",
  "howToApply": "string"
}`;

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'method_not_allowed' }, { status: 405 });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return Response.json({ error: 'scout_not_configured' }, { status: 503 });
  }

  let body: { query?: unknown };
  try {
    body = (await req.json()) as { query?: unknown };
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const query = typeof body.query === 'string' ? body.query.trim() : '';
  if (!query || query.length > 500) {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }

  // TODO(bot launch): add per-IP rate limiting via Netlify Blobs (e.g. 20 req/day)

  const upstream = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: `Student query: ${query}` }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!upstream.ok) {
    return Response.json({ error: 'upstream_error' }, { status: 502 });
  }

  const payload = (await upstream.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const raw = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';

  try {
    const parsed = JSON.parse(raw.replace(/```json|```/gi, '').trim());
    if (!Array.isArray(parsed)) throw new Error('not_array');
    return Response.json(parsed);
  } catch {
    return Response.json({ error: 'parse_error' }, { status: 502 });
  }
};
