import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return new Response(
        JSON.stringify({ error: 'Text is required for analysis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing sentiment for text of length:', text.length);

    const response = await fetch('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);

      if (response.status === 429 || response.status === 503) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable. Please try again in a moment.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to analyze sentiment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Hugging Face Response:', data);

    const results = data[0];
    const positiveResult = results.find((r: any) => r.label === 'POSITIVE');
    const negativeResult = results.find((r: any) => r.label === 'NEGATIVE');

    const positiveScore = positiveResult?.score || 0;
    const negativeScore = negativeResult?.score || 0;

    let sentiment: string;
    let confidence: number;

    if (Math.abs(positiveScore - negativeScore) < 0.2) {
      sentiment = 'neutral';
      confidence = 1 - Math.abs(positiveScore - negativeScore);
    } else if (positiveScore > negativeScore) {
      sentiment = 'positive';
      confidence = positiveScore;
    } else {
      sentiment = 'negative';
      confidence = negativeScore;
    }

    const analysis = {
      sentiment,
      confidence: Math.round(confidence * 100) / 100,
      explanation: `The text expresses a ${sentiment} sentiment with ${Math.round(confidence * 100)}% confidence.`
    };

    console.log('Successfully analyzed sentiment:', analysis);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-sentiment function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        sentiment: 'neutral',
        confidence: 0,
        explanation: 'An error occurred during analysis'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
