export default function TestPage() {
  return (
    <div style={{ paddingTop: '200px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', color: 'red' }}>TEST PAGE WORKS!</h1>
      <p>If you can see this, the page routing is working.</p>
      <a href="/admin/seed-jobs-ui" style={{ color: 'blue', fontSize: '24px' }}>
        Go to Seed Jobs UI
      </a>
    </div>
  );
}
