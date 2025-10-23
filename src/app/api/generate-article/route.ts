// app/api/generate-article/route.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const EDITOR_PROMPT = `You are a sharp digital news editor trained to create both reader-focused explainers and high-engagement social headlines.

INPUT — HEADLINE: {HEADLINE}
INPUT — ARTICLE: {ARTICLE}

🧩 TASK
1. Read the article carefully.
2. Pull out the 3–7 most natural, reader-focused questions someone would ask when they see this headline.
3. For each question, write a clear, conversational heading in the form of the question.
4. Under each heading, write a short, punchy mini-paragraph (2–4 sentences) answering it, using only information from the article.
5. Make sure each mini-paragraph flows like a quick, conversational explainer, not a list or summary.
6. End with a one-sentence "Bottom Line" that sums up why the story matters.

Keep paragraphs tight and vivid — aim for 2–5 short sentences per answer.

✳️ Format all explainer sections using this exact visual style: numbered questions (𝟏., 𝟐., 𝟑.), each question in bold with title-case text (e.g. "𝐖𝐡𝐚𝐭 𝐝𝐢𝐝 𝐓𝐫𝐮𝐦𝐩 𝐬𝐚𝐲?"), clear spacing between sections, and tight 2–4 sentence paragraphs under each.

OUTPUT FORMAT EXAMPLE:

𝟏. 𝐖𝐡𝐚𝐭'𝐬 𝐇𝐚𝐩𝐩𝐞𝐧𝐢𝐧𝐠 𝐢𝐧 𝐏𝐨𝐫𝐭𝐥𝐚𝐧𝐝?
Portland faces ongoing protests at an ICE facility, with some turning violent…

𝟐. 𝐖𝐡𝐲 𝐈𝐬 𝐓𝐫𝐮𝐦𝐩 𝐒𝐞𝐧𝐝𝐢𝐧𝐠 𝐭𝐡𝐞 𝐍𝐚𝐭𝐢𝐨𝐧𝐚𝐥 𝐆𝐮𝐚𝐫𝐝?
Trump ordered troops to protect ICE buildings…

𝟑. 𝐖𝐡𝐚𝐭 𝐃𝐨 𝐏𝐞𝐨𝐩𝐥𝐞 𝐓𝐡𝐢𝐧𝐤?
Locals say the city is calm and troops are provocative…`

export async function POST(request: NextRequest) {
  let id: string | undefined
  let url: string | undefined

  try {
    const body = await request.json()
    id = body.id
    url = body.url

    if (!id || !url) {
      return NextResponse.json({ error: 'Missing id or url' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Update status to processing
    await payload.update({
      collection: 'article-generator',
      id,
      data: {
        status: 'processing',
      },
    })

    // Fetch article content using Jina Reader API
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

    // Generate content using OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = EDITOR_PROMPT.replace('{HEADLINE}', headline).replace(
      '{ARTICLE}',
      articleText,
    )

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const generatedContent = completion.choices[0]?.message?.content || 'No content generated'

    // Generate image using GPT with image generation tool
    let featuredImageId: string | undefined

    try {
      console.log('Starting image generation with GPT image tool...')
      const imagePrompt = `Create a professional, editorial-style featured image for a news article with the headline: "${headline}". The image should be photorealistic, high-quality, and suitable for a news website. Avoid text in the image.`

      const imageResponse = await openai.responses.create({
        model: 'gpt-4.1-mini',
        input: imagePrompt,
        tools: [{ type: 'image_generation' }],
      })

      // Extract image data from the response
      const imageData = imageResponse.output
        .filter((output: any) => output.type === 'image_generation_call')
        .map((output: any) => output.result)

      console.log('Image generation result:', imageData.length > 0 ? 'Yes' : 'No')

      if (imageData.length > 0) {
        const imageBase64 = imageData[0]
        const buffer = Buffer.from(imageBase64, 'base64')
        console.log('Image generated, size:', buffer.length, 'bytes')

        // Upload to Payload media collection
        console.log('Uploading image to Payload media collection...')
        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: `Featured image for: ${headline}`,
          },
          file: {
            data: buffer,
            mimetype: 'image/png',
            name: `article-${Date.now()}.png`,
            size: buffer.length,
          },
        })

        featuredImageId = mediaDoc.id
        console.log('Image uploaded successfully! Media ID:', featuredImageId)
      }
    } catch (imageError) {
      console.error('❌ Error generating/uploading image:', imageError)
      console.error('Image error details:', imageError instanceof Error ? imageError.message : imageError)
      // Continue without image if it fails
    }

    // Update the document with the generated content and image
    await payload.update({
      collection: 'article-generator',
      id,
      data: {
        status: 'completed',
        generatedContent,
        originalHeadline: headline,
        ...(featuredImageId && { featuredImage: featuredImageId }),
      },
    })

    return NextResponse.json({
      success: true,
      content: generatedContent,
    })
  } catch (error) {
    console.error('Error generating article:', error)

    if (id) {
      try {
        const payload = await getPayload({ config: configPromise })
        await payload.update({
          collection: 'article-generator',
          id,
          data: {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        })
      } catch (updateError) {
        console.error('Failed to update error status:', updateError)
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate article' },
      { status: 500 },
    )
  }
}
