// app/api/generate-post/route.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const STRUCTURED_CONTENT_PROMPT = `You are a CONTENT STRATEGIST for AskGeopolitics — creating structured, engaging geopolitical content.

INPUTS:
ARTICLE: {ARTICLE}
HEADLINE: {HEADLINE}

YOUR TASK:
Generate structured JSON content for a post with the following sections:

1. SOCIAL MEDIA QUESTIONS (5-7 questions) - curiosity-driven debate starters
2. ARTICLE EXPLAINER (3-5 Q&A sections) - clear explanations of key points

OUTPUT FORMAT (JSON):
{
  "title": "Main post title (catchy, max 80 chars)",
  "socialQuestions": [
    "Serious question: Why would...",
    "Hot take: Can someone explain...",
    "Am I the only one who thinks..."
  ],
  "explainerSections": [
    {
      "question": "What's happening in [location]?",
      "answer": "2-4 sentence clear explanation..."
    }
  ]
}

SOCIAL QUESTIONS RULES:
- Generate 5-7 questions
- Use templates: "Serious question:", "Hot take:", "Am I the only one who thinks...", etc.
- Max 30 words, 1-2 sentences each
- End with thought-provoking question
- Neutral, conversational tone
- Mix different templates for variety

EXPLAINER SECTIONS RULES:
- Generate 3-5 Q&A pairs
- Natural reader questions (What's happening? Why? Who's involved? What's next?)
- Clear, punchy answers (2-4 sentences)
- Use article information only
- Conversational but informative

Return ONLY valid JSON, no markdown, no extra text.`

export async function POST(request: NextRequest) {
  let postId: string | undefined
  let url: string | undefined

  try {
    const body = await request.json()
    postId = body.postId
    url = body.url

    if (!postId || !url) {
      return NextResponse.json({ error: 'Missing postId or url' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Fetch article content using Jina Reader API
    console.log('Fetching article from URL:', url)
    const jinaUrl = `https://r.jina.ai/${url}`
    const jinaHeaders: Record<string, string> = {
      'Accept': 'application/json',
      'X-With-Generated-Alt': 'true',
    }

    // Add Jina API key if available
    if (process.env.JINA_API_KEY) {
      jinaHeaders['Authorization'] = `Bearer ${process.env.JINA_API_KEY}`
    }

    const articleResponse = await fetch(jinaUrl, {
      headers: jinaHeaders,
    })

    if (!articleResponse.ok) {
      throw new Error(`Failed to fetch article: ${articleResponse.statusText}`)
    }

    const articleData = await articleResponse.json()
    const articleText = articleData.data?.content || articleData.content || ''
    const headline = articleData.data?.title || articleData.title || 'No headline found'

    if (!articleText) {
      throw new Error('No content extracted from URL')
    }

    console.log('Article fetched. Headline:', headline)

    // Generate structured content using OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = STRUCTURED_CONTENT_PROMPT
      .replace('{HEADLINE}', headline)
      .replace('{ARTICLE}', articleText.substring(0, 8000)) // Limit article length

    console.log('Generating structured content with OpenAI...')
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that outputs valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    })

    const generatedContent = completion.choices[0]?.message?.content || '{}'

    console.log('========================================')
    console.log('📝 OPENAI RAW RESPONSE:')
    console.log('========================================')
    console.log(generatedContent)
    console.log('========================================')

    // Parse the JSON response
    let structuredData
    try {
      structuredData = JSON.parse(generatedContent)
      console.log('✅ Successfully parsed JSON')
      console.log('📊 Structured data:', JSON.stringify(structuredData, null, 2))
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError)
      throw new Error('Failed to parse generated content as JSON')
    }

    const suggestedTitle = structuredData.title || headline
    console.log('💡 Suggested title:', suggestedTitle)

    // Generate featured image using GPT
    let featuredImageId: string | undefined

    try {
      console.log('Starting image generation...')
      const imagePrompt = `Create a professional, editorial-style featured image for a geopolitical news article with the headline: "${headline}". The image should be photorealistic, high-quality, modern, and suitable for social media sharing. Avoid text in the image. Focus on visual storytelling that represents the geopolitical theme.`

      const imageResponse = await openai.responses.create({
        model: 'gpt-4.1-mini',
        input: imagePrompt,
        tools: [{ type: 'image_generation' }],
      })

      // Extract image data from the response
      const imageData = imageResponse.output
        .filter((output: any) => output.type === 'image_generation_call')
        .map((output: any) => output.result)

      if (imageData.length > 0) {
        const imageBase64 = imageData[0]
        const buffer = Buffer.from(imageBase64, 'base64')
        console.log('Image generated, size:', buffer.length, 'bytes')

        // Upload to Payload media collection
        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: `Featured image for: ${headline}`,
          },
          file: {
            data: buffer,
            mimetype: 'image/png',
            name: `post-${Date.now()}.png`,
            size: buffer.length,
          },
        })

        featuredImageId = mediaDoc.id
        console.log('Image uploaded successfully! Media ID:', featuredImageId)
      }
    } catch (imageError) {
      console.error('❌ Error generating/uploading image:', imageError)
      // Continue without image if it fails
    }

    // Fetch the first country to use as default
    console.log('Fetching first country as default...')
    const countriesResult = await payload.find({
      collection: 'countries',
      limit: 1,
      sort: 'name',
    })

    const firstCountry = countriesResult.docs[0]

    if (!firstCountry) {
      throw new Error('No countries found in database. Please create a country first.')
    }

    console.log('Using country:', firstCountry.name)

    // Build ONE callout section with ALL social questions as items
    const calloutSections = []

    if (structuredData.socialQuestions && structuredData.socialQuestions.length > 0) {
      calloutSections.push({
        icon: 'lightbulb',
        badge: 'Discussion Starters',
        title: 'Key Questions to Consider',
        backgroundColor: 'purple',
        items: structuredData.socialQuestions.map((q: string) => {
          // Remove everything before and including the colon
          const cleanedQuestion = q.includes(':') ? q.split(':').slice(1).join(':').trim() : q
          return { text: cleanedQuestion }
        }),
      })
    }

    console.log('📦 Built ONE callout section with', structuredData.socialQuestions?.length || 0, 'questions')

    // Build main content from explainer sections
    const contentParagraphs: any[] = []

    // Add explainer sections
    if (structuredData.explainerSections && structuredData.explainerSections.length > 0) {
      structuredData.explainerSections.forEach((section: any, index: number) => {
        // Add heading for the question
        contentParagraphs.push({
          type: 'heading',
          children: [
            {
              type: 'text',
              text: `${index + 1}. ${section.question}`,
              format: 1,
            },
          ],
          tag: 'h2',
        })

        // Add paragraph for the answer
        contentParagraphs.push({
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: section.answer,
            },
          ],
        })
      })
    } else {
      // Fallback content if no explainer sections
      contentParagraphs.push({
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Content generated from article. Check the discussion questions above for key insights.',
          },
        ],
      })
    }

    console.log('📝 Built content paragraphs:', contentParagraphs.length)

    // Generate excerpt from the first explainer answer or first social question
    const excerpt =
      structuredData.explainerSections?.[0]?.answer?.substring(0, 200) ||
      structuredData.socialQuestions?.[0]?.substring(0, 200) ||
      headline.substring(0, 200)

    console.log('📝 Generated excerpt:', excerpt)

    // Update the post with generated content
    const updateData: any = {
      title: suggestedTitle,
      excerpt: excerpt,
      country: firstCountry.id,
      publishedAt: new Date().toISOString(),
      calloutSections: calloutSections,
      content: {
        root: {
          type: 'root',
          children: contentParagraphs,
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      meta: {
        title: suggestedTitle,
        description:
          structuredData.socialQuestions?.[0]?.substring(0, 160) ||
          structuredData.explainerSections?.[0]?.answer?.substring(0, 160) ||
          headline.substring(0, 160),
      },
    }

    if (featuredImageId) {
      updateData.heroImage = featuredImageId
    }

    console.log('📤 Final update data structure:', JSON.stringify(updateData, null, 2))

    await payload.update({
      collection: 'posts',
      id: postId,
      data: updateData,
    })

    console.log('✅ Post updated successfully')

    return NextResponse.json({
      success: true,
      title: suggestedTitle,
      questionCount: structuredData.socialQuestions?.length || 0,
      explainerSections: structuredData.explainerSections?.length || 0,
      imageId: featuredImageId,
      message: `Generated ${structuredData.socialQuestions?.length || 0} discussion questions and ${structuredData.explainerSections?.length || 0} explainer sections`,
    })
  } catch (error) {
    console.error('Error generating post:', error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate post' },
      { status: 500 },
    )
  }
}
