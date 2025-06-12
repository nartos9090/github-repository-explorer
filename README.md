# GitHub User & Repository Search App

A modern React application that integrates with the GitHub API, allowing users to search for GitHub users by username and browse their repositories. Built with **Vite**, **TypeScript**, **Tailwind CSS**, [shadcn/ui](https://ui.shadcn.com/), **Zod**, and **Motion** for a seamless and interactive user experience.

Try the [Live Demo](https://github-repository-explorer.widyaardianto.com)

---

## Features

- **User Search**: Search for up to 5 GitHub users whose usernames are similar to the input.
- **Repository List**: Click a user to view all of their public repositories (no limit).
- **Form Validation**: Input is validated using Zod for reliability.
- **Responsive UI**: Built with Tailwind CSS and shadcn/ui components.
- **Animations**: Smooth transitions powered by Motion.
- **Error Handling**: Friendly error messages for failed API requests and invalid inputs.

---

## Tech Stack

- [React](https://react.dev/) (19+)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (UI library)
- [Zod](https://zod.dev/) (form validation)
- [Motion](https://motion.dev/) (animations)
- [React Context](https://react.dev/reference/react/createContext) (state management)

---

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:nartos9090/github-repository-explorer.git
cd github-repository-explorer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

---

## Usage

1. **Search Users**: Type a username into the search box. Up to 5 similar users will be shown.
2. **Select User**: Click on a user card to load their repositories.
3. **Browse Repositories**: Scroll through the user's repositories. Click on a repository to view it on GitHub.

---

## Docker Deployment

The app can be containerized and deployed using Docker.

### 1. Build the Docker image

```bash
docker build -t github-repository-explorer .
```

### 2. Run the Docker container

```bash
docker run -d -p 3000:5173 github-repository-explorer
```

---

## Configuration

- **API**: Uses GitHub's public REST API. No authentication required for basic usage.
- **Rate Limiting**: Unauthenticated requests are limited by GitHub. You may add a token for higher rate limits.

---

## Project Structure

```
src/
  components/           // UI components
  app/
    page.tsx            // Main app pages
    provider.tsx        // Global state management for the related app
    type.ts             // Type definition for the related app
    ...(Component.tsx)  // App related UI Component
  libs/                 // Other library or services
  resources/            // External API resources
  index.css             // Global css configuration
  main.tsx
  ...
```
---

## Known Limitations

- API rate-limits may apply for unauthenticated requests.
- Only public user data and repositories are shown.

---
