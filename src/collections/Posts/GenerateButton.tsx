'use client'

import { useDocumentInfo, useForm } from '@payloadcms/ui'
import { useState } from 'react'

export const GenerateButton = () => {
  const { id } = useDocumentInfo()
  const { getDataByPath } = useForm()
  const [isGenerating, setIsGenerating] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const handleGenerate = async () => {
    const sourceUrl = getDataByPath('sourceUrl')

    if (!sourceUrl) {
      setMessageType('error')
      setMessage('Please enter a source URL first')
      return
    }

    if (!id) {
      setMessageType('error')
      setMessage('Please save the post first before generating content')
      return
    }

    setIsGenerating(true)
    setMessage('Generating post content...')
    setMessageType('')

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: id,
          url: sourceUrl,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessageType('success')
        setMessage(
          data.message || 'Post generated successfully! Refresh the page to see the content.',
        )

        // Reload the page after 2 seconds
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setMessageType('error')
        setMessage(data.error || 'Failed to generate post')
      }
    } catch (error) {
      console.error('Generation error:', error)
      setMessageType('error')
      setMessage('Network error. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="field-type">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        className="btn btn--style-primary btn--size-medium"
        style={{
          width: '100%',
          marginBottom: '10px',
        }}
      >
        {isGenerating ? (
          <>
            <span
              style={{
                display: 'inline-block',
                width: '14px',
                height: '14px',
                border: '2px solid #fff',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
                marginRight: '8px',
              }}
            />
            Generating...
          </>
        ) : (
          '🤖 Generate Post from URL'
        )}
      </button>

      {message && (
        <div
          style={{
            padding: '10px',
            borderRadius: '4px',
            fontSize: '13px',
            backgroundColor:
              messageType === 'success'
                ? '#d4edda'
                : messageType === 'error'
                  ? '#f8d7da'
                  : '#d1ecf1',
            color:
              messageType === 'success'
                ? '#155724'
                : messageType === 'error'
                  ? '#721c24'
                  : '#0c5460',
            border: `1px solid ${
              messageType === 'success'
                ? '#c3e6cb'
                : messageType === 'error'
                  ? '#f5c6cb'
                  : '#bee5eb'
            }`,
          }}
        >
          {message}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default GenerateButton
