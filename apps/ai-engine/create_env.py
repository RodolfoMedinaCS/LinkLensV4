# This script creates a .env file with the proper UTF-8 encoding
with open('.env', 'w', encoding='utf-8') as f:
    f.write('SUPABASE_URL=YOUR_SUPABASE_URL_HERE\n')
    f.write('SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE\n')

print("Successfully created .env file!")
print("IMPORTANT: Please edit the .env file and replace the placeholder values with your actual Supabase credentials.") 