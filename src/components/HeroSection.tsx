import { Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="w-full bg-gradient-hero py-16 px-4 mb-12">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Sentiment Analysis Tool
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Discover the emotional tone of any content instantly. Analyze reviews, feedback, social media posts, and more from text, images, PDFs, and documents with advanced AI technology.
        </p>
        <div className="flex flex-wrap justify-center gap-8 pt-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">99%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">&lt;2s</div>
            <div className="text-sm text-muted-foreground">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">Free</div>
            <div className="text-sm text-muted-foreground">To Use</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
