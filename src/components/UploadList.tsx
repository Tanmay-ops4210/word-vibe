import { useEffect, useState } from 'react';
import { File, Calendar, HardDrive } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

type Upload = {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  upload_date: string;
  created_at: string;
};

export default function UploadList() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/uploads');
      
      if (!response.ok) {
        throw new Error('Failed to fetch uploads');
      }

      const data = await response.json();
      setUploads(data || []);
    } catch (error) {
      toast({
        title: 'Failed to load uploads',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading uploads...</p>
        </div>
      </Card>
    );
  }

  if (uploads.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <File className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No uploads yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Recent Uploads</h2>
      <div className="space-y-4">
        {uploads.map((upload) => (
          <div
            key={upload.id}
            className="flex items-start justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <div className="flex items-start space-x-3 flex-1">
              <div className="p-2 bg-primary/10 rounded-lg">
                <File className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{upload.file_name}</p>
                <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <HardDrive className="w-3 h-3" />
                    <span>{formatFileSize(upload.file_size)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(upload.upload_date)}</span>
                  </span>
                </div>
                {upload.file_type && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {upload.file_type}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
