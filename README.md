# AI Outreach Agent

A semi-automated AI marketing assistant to find businesses, generate personalized outreach, and track conversions.

## Backend Setup

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    *   Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Fill in your Supabase, Resend, OpenAI, and Google Places API keys.
    *   **Google Places API Key**: Obtain this from the [Google Cloud Console](https://console.cloud.google.com/). Enable the "Places API" and create an API Key.
4.  Set up the database:
    *   Go to your Supabase project's SQL Editor.
    *   Copy and run the contents of `server/schema.sql`.
5.  Start the development server:
    ```bash
    npm run dev
    ```

## Frontend Setup

1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    *   Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## API Routes

### Leads
- `GET /health` - Health check
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create a lead
- `GET /api/leads/:id` - Get a lead by ID
- `PATCH /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead
- `POST /api/leads/discover` - Discover leads using Google Places

### Outreach
- `POST /api/outreach/generate` - Generate personalized AI message
- `POST /api/outreach/send` - Send email via Resend API

## 80/20 Workflow

1.  **Discovery**: Use the "Discovery" tab to find businesses in a specific category and location.
2.  **Qualification**: Review the "Leads" tab. Leads are automatically scored based on their public data.
3.  **Personalization**: Open a lead's detail page. Choose a service focus and tone.
4.  **Review**: AI generates a message. Edit it if necessary to ensure 100% quality.
5.  **Send**: Click "Send Email" to deliver the message via Resend.
