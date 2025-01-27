// app/api/players/[id]/route.js
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import logger from '@/lib/logger';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    const updated = await User.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return new Response(JSON.stringify({ error: 'Player not found' }), { status: 404 });
    }
    logger.info(`Игрок ${id} обновлён`);
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    logger.error(error);
    return new Response(JSON.stringify({ error: 'Error updating player' }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const removed = await User.findByIdAndDelete(id);
    if (!removed) {
      return new Response(JSON.stringify({ error: 'Player not found' }), { status: 404 });
    }
    logger.info(`Player ${id} has been deleted`);
    return new Response(JSON.stringify({ message: 'Player deleted' }), { status: 200 });
  } catch (error) {
    logger.error(error);
    return new Response(JSON.stringify({ error: 'Error getting player' }), { status: 500 });
  }
}
