# Masjid-e-Nabawi Islamabad

A comprehensive web application for Masjid-e-Nabawi Islamabad, featuring prayer times, donations, madrasa enrollment, and community features.

## Features

- Prayer Times and Qibla Direction
- Online Donations with Multiple Payment Methods
- Madrasa Enrollment System
- Community Features and Discussions
- Admin Dashboard
- Contact Form
- Email Notifications

## Deployment Instructions

### Prerequisites

1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

### Environment Variables

Set up the following environment variables in your Vercel project settings:

```
DATABASE_URL=your_database_url
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=your_email
EMAIL_ADMIN=your_admin_email
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
JWT_SECRET=your_jwt_secret
```

### Deployment Steps

1. Login to Vercel:
   ```bash
   vercel login
   ```

2. Deploy the project:
   ```bash
   vercel
   ```

3. For production deployment:
   ```bash
   vercel --prod
   ```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- Next.js
- TypeScript
- Drizzle ORM
- PostgreSQL
- Stripe
- Tailwind CSS
- Vercel

## License

MIT 