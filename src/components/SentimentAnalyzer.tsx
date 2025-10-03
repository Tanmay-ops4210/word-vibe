import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SentimentResult from "./SentimentResult";
import FileUpload from "./FileUpload";

export interface SentimentAnalysis {
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  explanation: string;
}

const SentimentAnalyzer = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SentimentAnalysis | null>(null);

  const analyzeSentiment = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-sentiment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
      }

      const analysis = await response.json();
      setResult(analysis);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze sentiment. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileProcessed = (extractedText: string, fileName: string) => {
    setText(extractedText);
    toast.success(`Text extracted from ${fileName}!`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      analyzeSentiment();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="shadow-card transition-smooth hover:shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Analyze Your Content
          </CardTitle>
          <CardDescription>
            Type text or upload files (images, PDFs, documents) for AI-powered sentiment analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text Input</TabsTrigger>
              <TabsTrigger value="upload">Upload File</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4 mt-4">
              <div className="relative">
                <Textarea
                  placeholder="Type or paste your text here... (e.g., product review, social media post, customer feedback)"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[200px] resize-none text-base transition-smooth focus-visible:ring-primary"
                  disabled={isAnalyzing}
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                  {text.length} characters
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Press <kbd className="px-2 py-1 bg-muted rounded text-foreground">Ctrl+Enter</kbd> to analyze
                </p>
                <Button
                  onClick={analyzeSentiment}
                  disabled={isAnalyzing || !text.trim()}
                  variant="hero"
                  size="lg"
                  className="min-w-[140px]"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              <FileUpload onFileProcessed={handleFileProcessed} />
              {text && (
                <div className="mt-4">
                  <Button
                    onClick={analyzeSentiment}
                    disabled={isAnalyzing || !text.trim()}
                    variant="hero"
                    size="lg"
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analyze Extracted Text
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {result && <SentimentResult result={result} />}
    </div>
  );
};

export default SentimentAnalyzer;
