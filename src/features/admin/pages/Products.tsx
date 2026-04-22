export function AdminProducts() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground p-6">
        <p className="text-muted-foreground text-sm">No products yet.</p>
      </div>
    </div>
  );
}
