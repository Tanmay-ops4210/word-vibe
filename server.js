import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Client-Info, Apikey');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.post('/api/analyze-sentiment', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for analysis' });
    }

    console.log('Analyzing sentiment for text:', text.substring(0, 50) + '...');

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
        return res.status(503).json({ error: 'AI model is loading. Please try again in a moment.' });
      }

      return res.status(500).json({ error: 'Failed to analyze sentiment' });
    }

    const data = await response.json();
    console.log('Hugging Face Response:', JSON.stringify(data));

    const results = data[0];
    const positiveResult = results.find(r => r.label === 'POSITIVE');
    const negativeResult = results.find(r => r.label === 'NEGATIVE');

    const positiveScore = positiveResult?.score || 0;
    const negativeScore = negativeResult?.score || 0;

    let sentiment;
    let confidence;

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

    res.json(analysis);

  } catch (error) {
    console.error('Error in analyze-sentiment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ 
      error: errorMessage,
      sentiment: 'neutral',
      confidence: 0,
      explanation: 'An error occurred during analysis'
    });
  }
});

app.post('/api/analyze-image', async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    console.log('Analyzing image...');

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    const response = await fetch('https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: imageBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);

      if (response.status === 429 || response.status === 503) {
        return res.status(503).json({ error: 'Service temporarily unavailable. Please try again in a moment.' });
      }

      return res.status(500).json({ error: 'Failed to analyze image' });
    }

    const data = await response.json();
    console.log('Hugging Face Image Response:', data);

    const extractedText = data[0]?.generated_text || 'Unable to extract meaningful content from the image.';

    console.log('Successfully analyzed image');

    res.json({ extractedText });

  } catch (error) {
    console.error('Error in analyze-image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

app.listen(PORT, 'localhost', () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
