# GitHub Profile Explorer

A simple Next.js app that lets you search for a GitHub user and view their profile and public repositories using the GitHub API.

## Features

- Search by GitHub username
- Shows avatar and basic profile info (name, bio, location, company, followers)
- Lists all public repositories with description, stars, forks and language
- Handles loading, "user not found" and API rate-limit errors

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- GitHub REST API

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and try searching for `octocat`.

## Project Structure

```
app/
  page.tsx     # Main page: search, profile and repositories
  layout.tsx   # Root layout
package.json   # Dependencies and scripts
```
