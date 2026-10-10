export default function NotFound() {
  return (
    <main id="main-content" className="error-page">
      <h1>That entry is not in the registry.</h1>
      <p>Browse the catalog to find an available template.</p>
      <a href="/registry">Return to the registry</a>
    </main>
  );
}
