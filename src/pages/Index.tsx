import FileUpload from "@/components/FileUpload";
import UploadList from "@/components/UploadList";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">File Upload System</h1>
          <p className="text-center text-muted-foreground">Upload and manage your files with ease</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <FileUpload />
          </div>
          <div>
            <UploadList />
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>File Upload System • Built with Supabase</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
