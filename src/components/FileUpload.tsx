import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Image as ImageIcon, File } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onFileProcessed: (text: string, fileName: string) => void;
}

const FileUpload = ({ onFileProcessed }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc'],
    'text/plain': ['.txt']
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };

  const isPDFFile = (file: File) => {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  };

  const isDocFile = (file: File) => {
    return file.type.includes('word') || 
           file.name.toLowerCase().endsWith('.doc') || 
           file.name.toLowerCase().endsWith('.docx');
  };

  const handleFile = async (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadedFile(file);
    
    try {
      if (isImageFile(file)) {
        await processImage(file);
      } else if (isPDFFile(file) || isDocFile(file)) {
        toast.info("Document parsing is processing...");
        await processDocument(file);
      } else {
        // Plain text file
        const text = await file.text();
        onFileProcessed(text, file.name);
        toast.success("Text file processed successfully!");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process file. Please try again.");
      setUploadedFile(null);
    }
  };

  const processImage = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imageBase64 = e.target?.result as string;
          
          toast.info("Analyzing image with AI...");
          
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-image`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              },
              body: JSON.stringify({ imageBase64 }),
            }
          );

          if (!response.ok) {
            throw new Error('Failed to analyze image');
          }

          const data = await response.json();
          onFileProcessed(data.extractedText, file.name);
          toast.success("Image analyzed successfully!");
          resolve();
        } catch (error) {
          console.error("Error processing image:", error);
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processDocument = async (file: File) => {
    // For PDF and DOCX, we'll extract text in a simplified way
    // In a production app, you'd use a proper document parsing library
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        if (isPDFFile(file)) {
          // For PDFs, we'll prompt the user to copy-paste the text for now
          toast.info("Please copy the text from your PDF and paste it in the text area", {
            duration: 5000
          });
          setUploadedFile(null);
        } else if (isDocFile(file)) {
          // For DOCX files, we'll prompt the user to copy-paste the text
          toast.info("Please copy the text from your document and paste it in the text area", {
            duration: 5000
          });
          setUploadedFile(null);
        }
      } catch (error) {
        console.error("Error parsing document:", error);
        toast.error("Could not parse document. Please copy and paste the text instead.");
        setUploadedFile(null);
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!uploadedFile) return <Upload className="w-8 h-8" />;
    
    if (isImageFile(uploadedFile)) return <ImageIcon className="w-8 h-8" />;
    if (isPDFFile(uploadedFile)) return <FileText className="w-8 h-8" />;
    if (isDocFile(uploadedFile)) return <File className="w-8 h-8" />;
    return <FileText className="w-8 h-8" />;
  };

  return (
    <Card className="shadow-card border-border/50">
      <CardContent className="p-6">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={Object.keys(acceptedFormats).join(',')}
            onChange={handleFileInput}
          />
          
          {uploadedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="text-primary">{getFileIcon()}</div>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-foreground">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFile}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Upload className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">
                  Drop your file here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Choose File
              </Button>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Supported formats:</p>
                <p>Images (PNG, JPG, GIF, WebP)</p>
                <p>Documents (PDF, DOC, DOCX, TXT)</p>
                <p className="text-muted-foreground/70">Max size: 10MB</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
