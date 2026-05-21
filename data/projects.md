# Projects by Bisma

Bisma has built 40+ projects across AI/ML, full-stack web development, and developer tooling. Here are her most significant projects:

---

## 1. AI Customer Support Bot

**Category**: AI · ML
**Status**: Live (Production)
**Technologies**: OpenAI GPT-4, LangChain, Next.js, PostgreSQL, Redis, Pinecone, TypeScript

### Description
A production-grade AI support system that handles thousands of customer conversations daily. Combines retrieval-augmented generation (RAG) with a custom knowledge base to deliver accurate, context-aware responses. Integrates with Slack, email, and web chat simultaneously.

### Key Highlights
- Reduced average ticket resolution time by 68% compared to human-only support
- RAG pipeline with 50,000+ document knowledge base, sub-200ms retrieval
- Real-time sentiment analysis triggers human escalation automatically
- Multi-channel support: Web, Slack, Email — unified conversation context

---

## 2. Autonomous AI Employee

**Category**: AI · ML
**Status**: Beta
**Technologies**: OpenAI, LangGraph, Python, FastAPI, Docker, Redis, PostgreSQL

### Description
An orchestrated network of specialized AI agents that collaboratively handle end-to-end business tasks. Each agent has a distinct role — Planner, Executor, Reviewer, Memory — coordinated by a central orchestrator. Handles research, coding, testing, and reporting autonomously without human intervention.

### Key Highlights
- Orchestrates 6+ specialized agents with LangGraph state machine
- Persistent memory system enables long-running multi-day tasks
- Built-in reviewer agent catches errors before delivering results
- Tool access: web search, code execution, file system, external APIs

---

## 3. RAG Knowledge Assistant

**Category**: AI · ML
**Status**: Live
**Technologies**: OpenAI, Pinecone, LangChain, Next.js, PostgreSQL, Unstructured.io, TypeScript

### Description
A full-stack Retrieval-Augmented Generation (RAG) platform that ingests internal documentation, PDFs, Confluence pages, and Notion databases into a searchable vector store. Answers questions with inline source citations and confidence scores. Used by enterprises to make their internal knowledge searchable.

### Key Highlights
- Ingests PDF, DOCX, HTML, Markdown — 50+ file formats supported
- Vector similarity search with hybrid BM25 + embedding ranking
- Every answer includes cited source chunks with confidence score
- Multi-tenant architecture: isolated knowledge bases per organisation

---

## 4. AI Email Automation

**Category**: Full Stack
**Status**: Live
**Technologies**: OpenAI, Gmail API, Next.js, Prisma, PostgreSQL, Resend, TypeScript

### Description
A smart email client overlay that monitors your inbox, drafts context-aware replies, and automates follow-up sequences. Uses fine-tuned models to match your writing style and integrates with CRM tools to personalise outreach at scale.

### Key Highlights
- Writing-style fine-tuning learns from your sent email history
- AI auto-drafts replies with full email thread context
- CRM integration pulls lead data for hyper-personalised outreach
- A/B testing for subject lines with open-rate analytics dashboard

---

## 5. Vision AI Dashboard

**Category**: AI · ML
**Status**: Live
**Technologies**: Python, YOLOv8, FastAPI, React, OpenCV, Redis, Docker

### Description
A real-time video analytics platform powered by custom-trained YOLOv8 models. Processes multiple live video streams simultaneously, detecting and classifying objects with bounding boxes, confidence scores, and temporal tracking. Deployed on edge hardware with cloud sync.

### Key Highlights
- Processes 6 simultaneous 1080p video streams at 28+ FPS
- Custom YOLOv8 models fine-tuned on domain-specific datasets
- Real-time WebSocket dashboard with frame-by-frame annotation
- Edge deployment support (Jetson Nano, Raspberry Pi) with cloud sync

---

## 6. Multi-Agent Research System

**Category**: AI · ML
**Status**: Open Source
**Technologies**: Python, LangGraph, OpenAI, Tavily, FastAPI, React, Docker

### Description
An open-source framework for orchestrating multi-agent research pipelines. Specialized agents handle different research stages: search, reading, synthesis, fact-checking, and writing. Built on LangGraph with a visual workflow editor for non-technical users.

### Key Highlights
- 6 specialized agents from research planning to final report generation
- Visual no-code workflow editor built in React Flow
- Tavily search integration with automatic source validation
- 800+ GitHub stars, MIT licensed, active open-source community

---

## Summary

Bisma's projects focus heavily on AI/ML systems, particularly:
- RAG (Retrieval-Augmented Generation) systems
- Multi-agent AI workflows and orchestration
- LLM-powered automation tools
- Real-time AI applications (vision, chat, email)
- Full-stack web applications with TypeScript and Next.js
