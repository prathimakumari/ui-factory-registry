"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="error-page">
      <h1>Something interrupted this preview.</h1>
      <p>Try again, or choose another registry entry.</p>
      <button onClick={reset}>Try again</button>
      <a href="/registry">Open the registry</a>
    </main>
  );
}
