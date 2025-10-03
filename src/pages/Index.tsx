import HeroSection from "@/components/HeroSection";
import SentimentAnalyzer from "@/components/SentimentAnalyzer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <main className="container mx-auto px-4 pb-16">
        <SentimentAnalyzer />
      </main>
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Sentiment Analysis Tool • Powered by Advanced AI Technology</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
