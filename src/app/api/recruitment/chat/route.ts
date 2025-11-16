/**
 * AI Recruitment Chat API
 *
 * Handles real-time conversations with ALIFF-RECRUITER
 * Provides instant answers about jobs, hiring process, and applications
 *
 * Features:
 * - OpenAI GPT-4 Turbo integration
 * - Context-aware responses (job-specific)
 * - FAQ auto-response system
 * - Conversation history tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

// Lazy initialization to avoid build-time errors
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// System prompt for ALIFF-RECRUITER personality
const SYSTEM_PROMPT = `You are ALIFF, an AI Recruiter for Aliff Services - a government contracting and AI-powered solutions company.

Your personality:
- Helpful and encouraging, never robotic
- Professional but warm and friendly
- Proactive (anticipate questions)
- Clear on next steps (never leave candidates hanging)
- Honest and transparent

Your responsibilities:
- Help candidates find the right job
- Answer questions about positions, requirements, and benefits
- Explain the application process (AI screening → AI interview → Skills test → HR interview)
- Provide information about compensation, work arrangements, and growth opportunities
- Guide candidates through the application

Key information about Aliff Services:
- Remote-first company (most positions remote or hybrid)
- Competitive PKR hourly rates for providers (200-450 PKR/hour based on role and experience)
- AI-powered recruitment process for efficiency
- Focus on GOVCON (government contracting), SLED, IT services, and writing
- Growth-focused with career advancement opportunities
- Provider model (1099 contractors, not employees)
- Fast hiring: 5-7 days from application to decision

Important guidelines:
- NEVER share contact information (no emails, phone numbers)
- Direct candidates to apply through the website
- For complex questions beyond your knowledge, suggest: "Let me connect you with our team through the secure candidate portal"
- Be encouraging but honest about requirements
- If a candidate doesn't qualify, suggest alternative roles or skill development

Tone examples:
- Good: "That's great experience! Based on your GOVCON background, you'd be a strong fit for our Proposal Writer role. The position offers PKR 250-300/hour and full remote flexibility. Want to learn more?"
- Bad: "Your application has been received. Please wait for a response."`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, jobId, conversationHistory } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Fetch job context if jobId provided
    let jobContext = '';
    if (jobId) {
      try {
        const job = await prisma.jobPosting.findUnique({
          where: { slug: jobId },
          select: {
            title: true,
            description: true,
            requirements: true,
            responsibilities: true,
            salary: true,
            type: true,
            location: true,
          },
        });

        if (job) {
          jobContext = `

Current job context:
- Title: ${job.title}
- Type: ${job.type}
- Location: ${job.location}
- Salary: ${job.salary || 'Competitive, based on experience'}
- Description: ${job.description.substring(0, 300)}...
- Requirements: ${job.requirements.substring(0, 300)}...

Use this context to provide specific answers about this role.`;
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        // Continue without job context
      }
    }

    // Build conversation messages for OpenAI
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT + jobContext,
      },
    ];

    // Add conversation history (last 10 messages for context)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach((msg: Message) => {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message,
    });

    // Call OpenAI API
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
    });

    const aiResponse = completion.choices[0]?.message?.content ||
      "I apologize, but I'm having trouble generating a response. Please try asking your question again.";

    return NextResponse.json({
      message: aiResponse,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Chat API error:', error);

    // Check for specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'AI service authentication failed' },
          { status: 500 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again in a moment.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "I'm experiencing technical difficulties right now. Please try again in a moment, or feel free to browse our open positions and apply directly.",
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
