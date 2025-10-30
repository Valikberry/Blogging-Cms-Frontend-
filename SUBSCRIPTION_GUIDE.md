# Email Subscription System

This guide explains how the email subscription system works in your blog application.

## Features

- ✅ Email validation and duplicate prevention
- ✅ Store subscriber information in MongoDB via Payload CMS
- ✅ Admin panel to view and manage subscribers
- ✅ Reactivation support for previously unsubscribed users
- ✅ Track subscription source and country
- ✅ Subscribe/Unsubscribe API endpoints

## How It Works

### 1. Frontend Subscription Form

Located in: `src/components/PostListHero/Component.client.tsx`

Users can subscribe by:
1. Clicking the "Subscribe" tab in the post list
2. Entering their email address
3. Clicking "Subscribe"

The form includes:
- Email validation
- Loading state during submission
- Success/error messages
- Prevention of duplicate submissions

### 2. API Endpoints

#### Subscribe: `/api/subscribe` (POST)

**Request:**
```json
{
  "email": "user@example.com",
  "source": "blog-list",
  "countryId": "country-id-here"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Successfully subscribed! Thank you for joining us.",
  "subscriber": {
    "id": "subscriber-id",
    "email": "user@example.com"
  }
}
```

**Features:**
- Email validation (format check)
- Duplicate prevention
- Automatic reactivation of previously unsubscribed emails
- Lowercase email normalization

#### Check Subscription: `/api/subscribe` (GET)

**Request:**
```
GET /api/subscribe?email=user@example.com
```

**Response:**
```json
{
  "subscribed": true,
  "subscribedAt": "2025-10-30T12:00:00.000Z"
}
```

#### Unsubscribe: `/api/unsubscribe` (POST)

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "You have been successfully unsubscribed."
}
```

### 3. Database Collection

Collection: `subscribers`

**Fields:**
- `email` (email, required, unique) - Subscriber's email address
- `isActive` (checkbox, default: true) - Whether subscription is active
- `subscribedAt` (date) - When the user subscribed
- `source` (text) - Where subscription came from (e.g., "blog-list", "homepage")
- `country` (relationship → countries) - Country where user subscribed from
- `unsubscribedAt` (date) - When the user unsubscribed (if applicable)
- `createdAt` (timestamp) - Auto-generated
- `updatedAt` (timestamp) - Auto-generated

### 4. Admin Panel Access

View all subscribers in the Payload CMS admin panel:

1. Navigate to: `http://your-domain.com/admin`
2. Login with admin credentials
3. Click "Subscribers" in the Marketing section

**Admin Features:**
- View all subscribers
- Filter by active/inactive status
- Export subscriber list
- Manually add/edit/delete subscribers
- See subscription date, source, and country

## Usage Examples

### Check if a user is subscribed (client-side)

```typescript
const checkSubscription = async (email: string) => {
  const response = await fetch(`/api/subscribe?email=${encodeURIComponent(email)}`)
  const data = await response.json()
  return data.subscribed
}
```

### Subscribe a user (client-side)

```typescript
const subscribe = async (email: string, source?: string) => {
  const response = await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, source }),
  })
  const data = await response.json()
  return data
}
```

### Unsubscribe a user (client-side)

```typescript
const unsubscribe = async (email: string) => {
  const response = await fetch('/api/unsubscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = await response.json()
  return data
}
```

## Future Enhancements

Consider adding:

1. **Email Notifications**: Send welcome emails using services like SendGrid, Mailgun, or Resend
2. **Email Campaigns**: Integrate with email marketing platforms (Mailchimp, ConvertKit)
3. **Unsubscribe Links**: Generate unique unsubscribe links for email campaigns
4. **Preferences**: Allow users to choose what types of updates they receive
5. **Double Opt-in**: Require email verification before activation
6. **Analytics**: Track subscription conversion rates and sources
7. **GDPR Compliance**: Add consent checkboxes and privacy policy links
8. **Batch Export**: Export subscribers in CSV format for email campaigns

## Customization

### Change subscription source tracking

Edit `src/components/PostListHero/Component.client.tsx`:

```typescript
body: JSON.stringify({
  email: email.trim(),
  source: 'custom-source-name', // Change this
  countryId: activeCountry?.id || null,
}),
```

### Customize success/error messages

Edit `src/app/api/subscribe/route.ts`:

```typescript
return NextResponse.json({
  success: true,
  message: 'Your custom success message here!', // Change this
  subscriber: { ... }
})
```

### Add custom fields to subscriber

1. Edit `src/collections/Subscribers.ts`
2. Add new field to the `fields` array
3. Update API endpoint to accept new field
4. Update frontend form to include new field

## Testing

Test the subscription system:

```bash
# Subscribe
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"test"}'

# Check subscription
curl http://localhost:3000/api/subscribe?email=test@example.com

# Unsubscribe
curl -X POST http://localhost:3000/api/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Security Considerations

✅ **Implemented:**
- Email validation
- Lowercase normalization
- Duplicate prevention
- Error handling
- Rate limiting (via Next.js API routes)

🔒 **Recommended additions:**
- CAPTCHA/reCAPTCHA to prevent bot submissions
- Rate limiting per IP address
- Email domain blacklist for disposable emails
- GDPR compliance features
- Honeypot fields

## Support

For issues or questions, check:
- Payload CMS docs: https://payloadcms.com/docs
- Next.js API routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
