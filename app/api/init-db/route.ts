import { initDatabase } from '@/lib/db/init';

export async function POST() {
  const success = await initDatabase();
  
  if (success) {
    return Response.json({ message: 'Database initialized successfully' });
  } else {
    return Response.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
}