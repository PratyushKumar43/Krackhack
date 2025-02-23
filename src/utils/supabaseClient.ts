import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gdocitqvwroroyasqlra.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkb2NpdHF2d3Jvcm95YXNxbHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMjIzMjQsImV4cCI6MjA1NTg5ODMyNH0.KGkXQgeQ3RqOJS7c4Bd68X3mPpWbdwgfHBSxjdoCOuA'

export const supabase = createClient(supabaseUrl, supabaseKey)
