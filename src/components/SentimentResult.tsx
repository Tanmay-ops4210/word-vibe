import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SmilePlus, Frown, Minus } from "lucide-react";
import { SentimentAnalysis } from "./SentimentAnalyzer";

interface SentimentResultProps {
  result: SentimentAnalysis;
}

const SentimentResult = ({ result }: SentimentResultProps) => {
  const getSentimentIcon = () => {
    switch (result.sentiment) {
      case "positive":
        return <SmilePlus className="w-8 h-8" />;
      case "negative":
        return <Frown className="w-8 h-8" />;
      case "neutral":
        return <Minus className="w-8 h-8" />;
    }
  };

  const confidencePercentage = Math.round(result.confidence * 100);

  const getIconBgClass = () => {
    switch (result.sentiment) {
      case "positive":
        return "bg-positive/10 text-positive";
      case "negative":
        return "bg-negative/10 text-negative";
      case "neutral":
        return "bg-neutral/10 text-neutral";
    }
  };

  const getTitleClass = () => {
    switch (result.sentiment) {
      case "positive":
        return "text-positive";
      case "negative":
        return "text-negative";
      case "neutral":
        return "text-neutral";
    }
  };

  const getProgressClass = () => {
    switch (result.sentiment) {
      case "positive":
        return "bg-positive";
      case "negative":
        return "bg-negative";
      case "neutral":
        return "bg-neutral";
    }
  };

  return (
    <Card className="shadow-card animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>AI-powered sentiment analysis of your text</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className={`flex items-center justify-center w-20 h-20 rounded-full ${getIconBgClass()}`}>
            {getSentimentIcon()}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className={`text-2xl font-bold capitalize ${getTitleClass()}`}>
                {result.sentiment}
              </h3>
              <span className="text-lg font-semibold text-muted-foreground">
                {confidencePercentage}% confident
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${getProgressClass()} transition-all duration-1000 ease-out rounded-full`}
                style={{ width: `${confidencePercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm leading-relaxed text-foreground">
            {result.explanation}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center p-3 rounded-lg bg-positive/5">
            <div className="text-2xl font-bold text-positive">
              {result.sentiment === "positive" ? "✓" : "—"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Positive</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-neutral/5">
            <div className="text-2xl font-bold text-neutral">
              {result.sentiment === "neutral" ? "✓" : "—"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Neutral</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-negative/5">
            <div className="text-2xl font-bold text-negative">
              {result.sentiment === "negative" ? "✓" : "—"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Negative</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentResult;
