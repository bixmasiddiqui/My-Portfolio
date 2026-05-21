/**
 * Ingest script — reads markdown data files, chunks them, generates
 * Gemini embeddings, and writes data/embeddings.json for use by the
 * chat API route.
 *
 * Usage:
 *   GEMINI_API_KEY=AIza... node scripts/ingest.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenerativeAI } from '@google/generative-ai'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'data')
const OUTPUT = path.join(DATA_DIR, 'embeddings.json')

const SOURCES = ['about.md', 'projects.md', 'skills.md', 'experience.md']
const CHUNK_SIZE = 600   // characters per chunk
const CHUNK_OVERLAP = 80 // overlap between chunks

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const embeddingModel = genai.getGenerativeModel({ model: 'gemini-embedding-001' })

/** Split text into overlapping chunks */
function chunkText(text, source) {
  const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
  const chunks = []
  let current = ''

  for (const para of paragraphs) {
    if ((current + '\n\n' + para).length > CHUNK_SIZE && current.length > 0) {
      chunks.push({ source, content: current.trim() })
      // Keep last part as overlap
      const words = current.split(' ')
      const overlapWords = words.slice(-Math.ceil(CHUNK_OVERLAP / 5))
      current = overlapWords.join(' ') + '\n\n' + para
    } else {
      current = current ? current + '\n\n' + para : para
    }
  }

  if (current.trim()) {
    chunks.push({ source, content: current.trim() })
  }

  return chunks
}

async function embedBatch(texts) {
  const embeddings = []
  for (const text of texts) {
    const result = await embeddingModel.embedContent({
      content: { parts: [{ text }] },
      taskType: 'RETRIEVAL_DOCUMENT',
    })
    embeddings.push(result.embedding.values)
  }
  return embeddings
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable is required')
    process.exit(1)
  }

  console.log('Reading and chunking documents...')
  const allChunks = []

  for (const filename of SOURCES) {
    const filepath = path.join(DATA_DIR, filename)
    if (!fs.existsSync(filepath)) {
      console.warn(`Warning: ${filename} not found, skipping`)
      continue
    }
    const text = fs.readFileSync(filepath, 'utf-8')
    const chunks = chunkText(text, filename.replace('.md', ''))
    console.log(`  ${filename}: ${chunks.length} chunks`)
    allChunks.push(...chunks)
  }

  console.log(`\nTotal chunks: ${allChunks.length}`)
  console.log('Generating embeddings (batching 20 at a time)...')

  const BATCH_SIZE = 20
  const embedded = []

  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE)
    const texts = batch.map(c => c.content)
    const embeddings = await embedBatch(texts)

    for (let j = 0; j < batch.length; j++) {
      embedded.push({
        source: batch[j].source,
        content: batch[j].content,
        embedding: embeddings[j],
      })
    }

    const pct = Math.min(100, Math.round(((i + BATCH_SIZE) / allChunks.length) * 100))
    process.stdout.write(`\r  Progress: ${pct}%   `)
  }

  console.log('\n\nWriting embeddings.json...')
  fs.writeFileSync(OUTPUT, JSON.stringify(embedded, null, 2))

  console.log(`Done! Saved ${embedded.length} embedded chunks to data/embeddings.json`)
  console.log(`File size: ${(fs.statSync(OUTPUT).size / 1024).toFixed(1)} KB`)
}

main().catch(err => {
  console.error('Ingest failed:', err.message)
  process.exit(1)
})
