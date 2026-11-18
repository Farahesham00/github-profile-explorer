"use client";

import { useState, FormEvent } from "react";

// gitHub USER API expected response types
type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  followers: number;
  following: number;
  public_repos: number;
};

// gitHub REPO API expected response types
type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
};


// useState is a react hook to store data while using page and re-render page if data changed.
export default function Home() { 
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // e stands for event.
  async function handleSearch(e: FormEvent) {
    e.preventDefault(); // to prevent reload of page we only need to fetch the data and display it on the same page.
    const name = username.trim(); // set username to name.
    if (!name) return;

    setLoading(true); // start loading
    setError("");
    setUser(null); // remove previous user data
    setRepos([]);

    try {
      const [userRes, reposRes] = await Promise.all([ // promise.all is used to fetch both user and repos data simultaneously.
        fetch(`https://api.github.com/users/${name}`), 
        fetch(`https://api.github.com/users/${name}/repos?per_page=100&sort=updated`),
      ]);

      if (userRes.status === 404) throw new Error(`User "${name}" was not found.`);
      if (userRes.status === 403)
        throw new Error("GitHub API rate limit reached. Please try again later.");
      if (!userRes.ok || !reposRes.ok) throw new Error("Something went wrong. Please try again.");


      setUser(await userRes.json()); // json is for read response data and return it into javascript data structure 
      setRepos(await reposRes.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }


 // promise.all is used to fetch both user and repos data simultaneously.
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold">GitHub Profile Explorer</h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a GitHub username (e.g. octocat)"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </p>
        )}

        {/* Profile */}
        {user && (
          <section className="mb-8 flex flex-col items-center gap-6 rounded-xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar_url}
              alt={`${user.login} avatar`}
              className="h-28 w-28 rounded-full border border-gray-200"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold">{user.name || user.login}</h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                @{user.login}
              </a>
              {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                {user.company && <li>🏢 {user.company}</li>}
                {user.location && <li>📍 {user.location}</li>}
                {user.blog && <li>🔗 {user.blog}</li>}
              </ul>
              <div className="mt-3 flex justify-center gap-4 text-sm sm:justify-start">
                <span><b>{user.followers}</b> followers</span>
                <span><b>{user.following}</b> following</span>
                <span><b>{user.public_repos}</b> repos</span>
              </div>
            </div>
          </section>
        )}

        {/* Repositories */}
        {user && (
          <section>
            <h3 className="mb-4 text-xl font-semibold">Repositories ({repos.length})</h3>
            {repos.length === 0 ? (
              <p className="text-gray-600">This user has no public repositories.</p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {repos.map((repo) => (
                  <li key={repo.id} className="rounded-xl border border-gray-200 bg-white p-4">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {repo.name}
                    </a>
                    <p className="mt-1 text-sm text-gray-700">
                      {repo.description || "No description provided."}
                    </p>
                    <div className="mt-3 flex gap-4 text-sm text-gray-600">
                      <span>⭐ {repo.stargazers_count}</span>
                      <span>🍴 {repo.forks_count}</span>
                      {repo.language && <span>{repo.language}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}