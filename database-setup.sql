/*
  # File Upload System Database Setup

  ## Overview
  This migration creates the database structure for a simple file upload tracking system.

  ## Tables Created

  ### uploads
  Stores metadata about uploaded files
  - `id` (uuid, primary key) - Unique identifier for each upload
  - `file_name` (text) - Name of the uploaded file
  - `file_size` (bigint) - Size of the file in bytes
  - `file_type` (text) - MIME type of the file (e.g., image/png, application/pdf)
  - `upload_date` (timestamptz) - Timestamp when the file was uploaded
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security Configuration

  ### Row Level Security (RLS)
  - RLS is enabled on the uploads table
  - Public insert policy allows anyone to upload files
  - Public select policy allows anyone to view upload records

  ## Usage Instructions

  Run this SQL in your Supabase SQL Editor or via the Supabase CLI:
  1. Go to your Supabase project dashboard
  2. Navigate to SQL Editor
  3. Copy and paste this entire file
  4. Click "Run" to execute
*/

CREATE TABLE IF NOT EXISTS uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  file_type text NOT NULL DEFAULT '',
  upload_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert uploads"
  ON uploads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view uploads"
  ON uploads
  FOR SELECT
  TO anon
  USING (true);
