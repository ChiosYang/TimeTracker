# Steam Profile & Game Library Viewer

This is a web application built with Next.js that allows users to view their Steam profile and game library information. It fetches data from the Steam Web API and displays it in a user-friendly interface.

## Features

- **User Authentication:**
  - Supports multiple authentication methods:
    - Email/Password (Credentials)
    - Google OAuth
    - GitHub OAuth
- **Steam Profile:**
  - View your Steam profile information, including your persona name, avatar, and profile URL.
- **Game Library:**
  - Browse your entire Steam game library.
  - View details for each game, including playtime.
- **Configuration:**
  - Users can configure their Steam API key and Steam ID through a dedicated settings page.
  - Configuration is stored securely in a database.
- **Responsive Design:**
  - The application is designed to be responsive and works well on both desktop and mobile devices.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Database:** [Neon](https://neon.tech/) (PostgreSQL)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [pnpm](https://pnpm.io/) (or npm/yarn)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   - Create a `.env.local` file in the root of the project.
   - Add the following environment variables:

   ```env
   # Database
   DATABASE_URL="your_neon_database_url"

   # NextAuth.js
   AUTH_SECRET="your_auth_secret"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   GITHUB_CLIENT_ID="your_github_client_id"
   GITHUB_CLIENT_SECRET="your_github_client_secret"

   # Steam API (Optional - can be configured in the app)
   STEAM_API_KEY="your_steam_api_key"
   STEAM_ID="your_steam_id"
   ```

4. **Initialize the database:**
   - Connect to your Neon database and run the SQL commands in `lib/db/schema.sql` to create the necessary tables.

5. **Run the development server:**
   ```bash
   pnpm dev
   ```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

## How to Use

1. **Register/Login:**
   - Create an account using your email and password, or sign in with Google or GitHub.
2. **Configure Steam:**
   - Navigate to the `/config` page.
   - Enter your Steam API key and Steam ID. You can find your Steam ID on your profile page, and you can obtain a Steam API key from the [Steam Web API documentation page](https://steamcommunity.com/dev/apikey).
3. **View Profile and Games:**
   - Once configured, you can view your Steam profile on the `/dashboard` page and your game library on the `/games` page.

## Project Structure

```
.
├── app/                # Next.js App Router
│   ├── (routes)/       # Page routes
│   └── api/            # API routes
├── components/         # React components
├── lib/                # Helper functions, services, and utilities
│   ├── auth/           # Authentication-related utilities
│   ├── db/             # Database connection and schema
│   ├── services/       # Services for interacting with external APIs (e.g., Steam)
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── ...
```

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.