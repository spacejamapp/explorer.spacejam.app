export default function NotFound() {
  return (
    <main className="container mx-auto py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Core Not Found</h1>
        <p className="text-muted-foreground">
          The requested core could not be found or has no activity data.
        </p>
      </div>
    </main>
  );
}