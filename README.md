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
    *   Fill in your Supabase, Resend, and OpenAI API keys.
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

- `GET /health` - Health check
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create a lead
- `GET /api/leads/:id` - Get a lead by ID
- `PATCH /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead
