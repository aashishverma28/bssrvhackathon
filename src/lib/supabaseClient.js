import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xxhlzrumqehumuxfnwnv.supabase.co'
const supabaseAnonKey = 'sb_publishable_dBoVWH5muJdN05BdmpAMLQ_ETns3aFO'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
