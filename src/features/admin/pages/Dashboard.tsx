export function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <p className="text-sm text-muted-foreground">Registered Users</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
      </div>
    </div>
  );
}
