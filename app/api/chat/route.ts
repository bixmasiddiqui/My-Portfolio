import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// ─── Types ────────────────────────────────────────────────────────────────────

type EmbeddedChunk = {
  source: string
  content: string
  embedding: number[]
}

type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// ─── Vector utils ─────────────────────────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

// ─── Embeddings cache (persists across requests in the same runtime) ──────────

let embeddingsCache: EmbeddedChunk[] | null = null

function loadEmbeddings(): EmbeddedChunk[] {
  if (embeddingsCache) return embeddingsCache

  const embeddingsPath = path.join(process.cwd(), 'data', 'embeddings.json')

  if (!fs.existsSync(embeddingsPath)) {
    return []
  }

  const raw = fs.readFileSync(embeddingsPath, 'utf-8')
  embeddingsCache = JSON.parse(raw) as EmbeddedChunk[]
  return embeddingsCache
}

// ─── RAG retrieval ────────────────────────────────────────────────────────────

async function retrieveContext(query: string, topK = 5): Promise<string> {
  const chunks = loadEmbeddings()

  if (chunks.length === 0) {
    return ''
  }

  const embeddingModel = genai.getGenerativeModel({ model: 'gemini-embedding-001' })
  const result = await embeddingModel.embedContent(query)
  const queryEmbedding = result.embedding.values

  const scored = chunks.map(chunk => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }))

  scored.sort((a, b) => b.score - a.score)
  const topChunks = scored.slice(0, topK)

  return topChunks
    .map(c => `[Source: ${c.source}]\n${c.content}`)
    .join('\n\n---\n\n')
}

// ─── System prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(context: string): string {
  const hasContext = context.trim().length > 0

  return `You are Bisma's AI portfolio assistant. You answer questions about Bisma — her background, projects, skills, and experience.

You are friendly, concise, and enthusiastic about Bisma's work. Speak about Bisma in the third person ("she", "her") unless answering a direct question like "Are you available?" in which case you can say "Yes, Bisma is available."

Guidelines:
- Keep answers concise (2-4 sentences for simple questions, more for complex ones)
- Be specific — mention real project names, technologies, and metrics when relevant
- If asked about something not covered in the context, say you don't have that info but suggest they use the contact form
- Never make up information about Bisma
- Format lists with bullet points for readability when listing multiple items
- Be warm and professional

${hasContext ? `Here is relevant information about Bisma to answer the question:\n\n${context}` : `No specific context was retrieved. Answer based on your general knowledge about Bisma's portfolio, or politely say you don't have that information.`}`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { messages: Message[] }
    const { messages } = body

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUserMessage) {
      return new Response(JSON.stringify({ error: 'No user message found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // RAG: retrieve relevant context
    const context = await retrieveContext(lastUserMessage.content)
    const systemPrompt = buildSystemPrompt(context)

    const chatModel = genai.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt,
    })

    // Convert prior messages to Gemini history format (exclude last user message)
    const nonSystemMessages = messages.filter(m => m.role !== 'system')
    const history = nonSystemMessages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const chat = chatModel.startChat({ history })
    const streamResult = await chat.sendMessageStream(lastUserMessage.content)

    // Return a streaming text response
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamResult.stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err) {
    console.error('[Chat API Error]', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
