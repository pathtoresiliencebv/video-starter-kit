/*
  # Add user association to projects
  
  1. Changes
    - Add user_id to projects table
    - Add foreign key constraint
    - Add RLS policies
*/

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own projects" 
  ON projects 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" 
  ON projects 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" 
  ON projects 
  FOR UPDATE
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" 
  ON projects 
  FOR DELETE
  TO authenticated 
  USING (auth.uid() = user_id);