/*
  # Sentiment Analysis Database Schema

  ## Overview
  Creates tables to store sentiment analysis history for the college project.

  ## New Tables
  
  ### `sentiment_analyses`
  Stores all sentiment analysis results with metadata
  - `id` (uuid, primary key) - Unique identifier for each analysis
  - `input_text` (text) - The text that was analyzed
  - `input_type` (text) - Type of input: 'text', 'image', 'pdf', 'document'
  - `sentiment` (text) - Analysis result: 'positive', 'negative', 'neutral'
  - `confidence` (numeric) - Confidence score between 0 and 1
  - `explanation` (text) - AI-generated explanation of the sentiment
  - `file_name` (text, nullable) - Original filename if uploaded from file
  - `created_at` (timestamptz) - Timestamp of when analysis was performed
  - `ip_address` (text, nullable) - IP address of requester (for analytics)

  ## Security
  - Enable RLS on `sentiment_analyses` table
  - Add policy for public read access (for analytics dashboard)
  - Add policy for public insert access (to store new analyses)

  ## Notes
  - This is a public application for a college project
  - No authentication required for basic functionality
  - Data is stored for analytics and improvement purposes
*/

-- Create sentiment_analyses table
CREATE TABLE IF NOT EXISTS sentiment_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input_text text NOT NULL,
  input_type text NOT NULL DEFAULT 'text',
  sentiment text NOT NULL,
  confidence numeric NOT NULL DEFAULT 0,
  explanation text NOT NULL,
  file_name text,
  created_at timestamptz DEFAULT now(),
  ip_address text,
  
  CONSTRAINT sentiment_analyses_sentiment_check CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  CONSTRAINT sentiment_analyses_input_type_check CHECK (input_type IN ('text', 'image', 'pdf', 'document')),
  CONSTRAINT sentiment_analyses_confidence_check CHECK (confidence >= 0 AND confidence <= 1)
);

-- Enable Row Level Security
ALTER TABLE sentiment_analyses ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read all analyses (for analytics/history)
CREATE POLICY "Anyone can view sentiment analyses"
  ON sentiment_analyses
  FOR SELECT
  TO public
  USING (true);

-- Policy: Allow anyone to insert new analyses
CREATE POLICY "Anyone can create sentiment analyses"
  ON sentiment_analyses
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for faster queries on created_at
CREATE INDEX IF NOT EXISTS sentiment_analyses_created_at_idx 
  ON sentiment_analyses(created_at DESC);

-- Create index for sentiment filtering
CREATE INDEX IF NOT EXISTS sentiment_analyses_sentiment_idx 
  ON sentiment_analyses(sentiment);