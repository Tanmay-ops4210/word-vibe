import { useState } from 'react';
import { Upload as UploadIcon, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const response = await fetch('http://localhost:3000/api/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          file_type: selectedFile.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      toast({
        title: 'Upload successful',
        description: `${selectedFile.name} has been uploaded`,
      });

      setSelectedFile(null);
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Upload File</h2>
          <p className="text-muted-foreground">Select a file to upload to the database</p>
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <UploadIcon className="w-8 h-8 text-primary" />
            </div>

            <div className="text-center">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-primary hover:text-primary/80 font-medium">
                  Choose a file
                </span>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
              <p className="text-sm text-muted-foreground mt-1">
                or drag and drop
              </p>
            </div>
          </div>
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center space-x-3">
              <File className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full"
          size="lg"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </div>
    </Card>
  );
}
