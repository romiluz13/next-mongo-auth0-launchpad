export default function DashboardLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-24 px-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="bg-card rounded-lg p-6 shadow-lg animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-6 w-40 bg-muted rounded" />
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-4 w-48 bg-muted rounded" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-6 w-40 bg-muted rounded" />
              <div className="space-y-2">
                <div className="h-4 w-56 bg-muted rounded" />
                <div className="h-4 w-48 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 