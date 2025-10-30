'use client'

import { useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { useState, useEffect } from 'react'

const ArticleGenerateButton: React.FC = () => {
  const { id } = useDocumentInfo()
  const sourceUrl = useFormFields(([fields]) => fields.sourceUrl)
  const status = useFormFields(([fields]) => fields.status)
  const generatedContent = useFormFields(([fields]) => fields.generatedContent)
  const [isGenerating, setIsGenerating] = useState(false)
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  // Poll for status updates when generating
  useEffect(() => {
    if (status?.value === 'processing') {
      const interval = setInterval(async () => {
        // Trigger a page refresh to get updated data
        window.location.reload()
      }, 3000) // Check every 3 seconds

      return () => clearInterval(interval)
    }
  }, [status?.value])

  const handleCopy = async () => {
    if (!generatedContent?.value) return

    try {
      await navigator.clipboard.writeText(generatedContent.value as string)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleGenerate = async () => {
    if (!sourceUrl?.value) {
      setMessage('❌ Please enter an article URL first')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setIsGenerating(true)
    setMessage('🚀 Starting article and image generation...')

    try {
      const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          url: sourceUrl.value,
        }),
      })

      if (response.ok) {
        setMessage('✅ Generation started! Creating content + AI image... Page will refresh automatically.')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        const error = await response.json()
        setMessage(`❌ Error: ${error.error || 'Failed to generate'}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  // Don't show button on new documents (no ID yet)
  if (!id) {
    return (
      <div style={{ padding: '15px', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '4px', marginBottom: '20px' }}>
        <p style={{ margin: 0, color: '#92400e' }}>
          💡 Save this document first, then use the Generate button to create content
        </p>
      </div>
    )
  }

  const currentStatus = status?.value as string
  const hasContent = generatedContent?.value && generatedContent.value !== ''

  return (
    <div style={{
      marginBottom: '24px',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || currentStatus === 'processing'}
          style={{
            padding: '14px 28px',
            fontSize: '15px',
            fontWeight: '600',
            backgroundColor: isGenerating || currentStatus === 'processing' ? '#6b7280' : '#ffffff',
            color: isGenerating || currentStatus === 'processing' ? '#ffffff' : '#667eea',
            border: 'none',
            borderRadius: '8px',
            cursor: isGenerating || currentStatus === 'processing' ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {isGenerating || currentStatus === 'processing' ? (
            <>
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              Generating...
            </>
          ) : (
            <>🤖 Generate Article + Image</>
          )}
        </button>

        {hasContent ? (
          <button
            type="button"
            onClick={handleCopy}
            style={{
              padding: '14px 24px',
              fontSize: '15px',
              fontWeight: '600',
              backgroundColor: copied ? '#10b981' : '#ffffff',
              color: copied ? '#ffffff' : '#764ba2',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            {copied ? '✓ Copied!' : '📋 Copy Content'}
          </button>
        ) : null}

        {currentStatus === 'completed' && (
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span>✓</span> Completed
          </div>
        )}
        {currentStatus === 'failed' && (
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span>✕</span> Failed
          </div>
        )}
        {currentStatus === 'processing' && (
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#f59e0b',
            color: 'white',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              border: '2px solid #ffffff',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            Processing...
          </div>
        )}
      </div>

      {message && (
        <div
          style={{
            padding: '14px',
            background: message.includes('❌') ? '#fef2f2' : message.includes('✅') ? '#f0fdf4' : '#eff6ff',
            border: `2px solid ${message.includes('❌') ? '#fca5a5' : message.includes('✅') ? '#86efac' : '#93c5fd'}`,
            borderRadius: '8px',
            marginTop: '12px',
            color: message.includes('❌') ? '#991b1b' : message.includes('✅') ? '#166534' : '#1e40af',
          }}
        >
          <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>{message}</p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default ArticleGenerateButton
