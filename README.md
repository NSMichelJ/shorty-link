# Shorty-link: URL shortener 🚀

**Built with Astro, React, Tailwind, and Server Actions**  

![Home Preview](./public/home-preview.jpg)

> **Shorty-Link is an open-source URL shortener that simplifies sharing long links. Intuitive, fast, and customizable.**


## Tech Stack 🛠️  
- **Frontend**: React + Tailwind CSS  
- **Backend**: Astro (SSG/SSR) + Server Actions  
- **Auth**: better-auth (OAuth with GitHub/Google)  
- **Icons**: lucide-react  
- **Database**:  
  - **Production**: [Turso](https://turso.tech) (SQLite as a service)  
  - **Local Development**: SQLite  
- **ORM**: Prisma  

## Setup 📦  

### 1. Fork this project
[Fork this project](https://github.com/NSMichelJ/shorty-link/fork)  

### 2. Clone the Repo
```bash  
git clone git@github.com:YOUR_USER/shorty-link.git 
cd shorty-link
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Environment Variables
The project includes a .env.template file as a template for your environment variables. 
1. Copy the .env.template file to a new .env file
2. Open the .env file and fill in the required values
```bash
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

DATABASE_URL="file:dev.sqlite3"
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

> Note : If you don't provide Turso credentials (TURSO_DATABASE_URL and TURSO_AUTH_TOKEN), the app will automatically use SQLite (file:dev.sqlite3) as the database. 

### 5. Set Up Prisma
Run the following commands to set up your database schema and migrations:
```bash
pnpm db:generate
pnpm db:migrate
```

### 6. Run Locally
Start the development server:
```bash
pnpm dev
```

## Usage 📏
* Sign Up/Login via GitHub/Google.
* Shorten a URL: Click "Create link" and paste the long link.
* Copy & Share : Use the generated short link.
* Dashboard : Track clicks, edit URLs, or delete links.

## Contributing 🤝
Pull requests are welcome! For major changes, open an issue first.

### License 📄
This project is licensed under the MIT License - See [LICENSE](./LICENSE) for details.
