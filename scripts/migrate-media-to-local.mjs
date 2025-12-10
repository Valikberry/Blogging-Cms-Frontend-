import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import http from 'http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const MONGODB_URI = process.env.DATABASE_URI
const MEDIA_DIR = path.join(__dirname, '..', 'public', 'media')

// Ensure media directory exists
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true })
  console.log(`Created media directory: ${MEDIA_DIR}`)
}

// Download file from URL
async function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(MEDIA_DIR, filename)

    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`  Skipping (already exists): ${filename}`)
      return resolve(filePath)
    }

    const file = fs.createWriteStream(filePath)
    const protocol = url.startsWith('https') ? https : http

    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location
        console.log(`  Redirecting to: ${redirectUrl}`)
        downloadFile(redirectUrl, filename).then(resolve).catch(reject)
        return
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`))
        return
      }

      response.pipe(file)

      file.on('finish', () => {
        file.close()
        console.log(`  Downloaded: ${filename}`)
        resolve(filePath)
      })
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}) // Delete partial file
      reject(err)
    })
  })
}

// Main migration function
async function migrateMedia() {
  console.log('Starting media migration from Vercel Blob to local storage...\n')

  // Dynamic import for MongoDB
  const { MongoClient } = await import('mongodb')

  if (!MONGODB_URI) {
    console.error('DATABASE_URI not found in environment variables')
    process.exit(1)
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB\n')

    const db = client.db()
    const mediaCollection = db.collection('media')

    // Get all media documents
    const mediaDocuments = await mediaCollection.find({}).toArray()
    console.log(`Found ${mediaDocuments.length} media documents\n`)

    let successCount = 0
    let errorCount = 0
    let skippedCount = 0

    for (const doc of mediaDocuments) {
      console.log(`Processing: ${doc.filename || doc._id}`)

      try {
        // Get the current URL
        let currentUrl = doc.url

        if (!currentUrl) {
          console.log(`  No URL found, skipping`)
          skippedCount++
          continue
        }

        // Check if already local
        if (currentUrl.startsWith('/media/') || currentUrl.startsWith('/api/media/')) {
          console.log(`  Already local: ${currentUrl}`)
          skippedCount++
          continue
        }

        // If URL is relative to API, make it absolute for download
        if (currentUrl.startsWith('/api/')) {
          // This is already served locally via Payload, just update the path
          console.log(`  Already served via Payload API: ${currentUrl}`)
          skippedCount++
          continue
        }

        // Download from Vercel Blob
        const filename = doc.filename || path.basename(currentUrl.split('?')[0])
        const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')

        // Construct the full Vercel Blob URL if needed
        let downloadUrl = currentUrl
        if (!currentUrl.startsWith('http')) {
          // Try to construct Vercel Blob URL
          downloadUrl = `https://zl5ok6drfy2ndzqy.public.blob.vercel-storage.com/${filename}`
        }

        console.log(`  Downloading from: ${downloadUrl}`)
        await downloadFile(downloadUrl, safeFilename)

        // Update the database with new local path
        const newUrl = `/media/${safeFilename}`
        await mediaCollection.updateOne(
          { _id: doc._id },
          {
            $set: {
              url: newUrl,
              _migratedFromVercel: currentUrl,
              _migratedAt: new Date()
            }
          }
        )
        console.log(`  Updated DB: ${newUrl}\n`)
        successCount++

      } catch (error) {
        console.error(`  Error: ${error.message}\n`)
        errorCount++
      }
    }

    console.log('\n--- Migration Summary ---')
    console.log(`Total documents: ${mediaDocuments.length}`)
    console.log(`Successfully migrated: ${successCount}`)
    console.log(`Skipped (already local): ${skippedCount}`)
    console.log(`Errors: ${errorCount}`)

  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await client.close()
    console.log('\nDisconnected from MongoDB')
  }
}

// Alternative: List all Vercel Blob files using the API
async function listVercelBlobFiles() {
  const token = process.env.media_READ_WRITE_TOKEN

  if (!token) {
    console.error('media_READ_WRITE_TOKEN not found')
    return []
  }

  try {
    const response = await fetch('https://blob.vercel-storage.com?limit=1000', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.blobs || []
  } catch (error) {
    console.error('Error listing Vercel Blob files:', error)
    return []
  }
}

// Download all files from Vercel Blob directly
async function downloadAllFromVercelBlob() {
  console.log('Fetching file list from Vercel Blob...\n')

  const blobs = await listVercelBlobFiles()
  console.log(`Found ${blobs.length} files in Vercel Blob\n`)

  for (const blob of blobs) {
    console.log(`Downloading: ${blob.pathname}`)
    try {
      const filename = blob.pathname.replace(/[^a-zA-Z0-9.-]/g, '_')
      await downloadFile(blob.url, filename)
    } catch (error) {
      console.error(`  Error: ${error.message}`)
    }
  }
}

// Run the migration
console.log('=== Media Migration Script ===\n')
console.log('Choose migration method:')
console.log('1. Migrate from database URLs (default)')
console.log('2. Download all from Vercel Blob API\n')

const args = process.argv.slice(2)
if (args.includes('--blob-api')) {
  downloadAllFromVercelBlob()
} else {
  migrateMedia()
}
