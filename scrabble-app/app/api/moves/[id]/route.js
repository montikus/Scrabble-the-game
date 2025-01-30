// app/api/moves/[id]/route.js
import { connectDB } from '@/lib/db';
import logger from '@/lib/logger';
import Move from '@/models/Move';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();
    const updatedMove = await Move.findByIdAndUpdate(id, data, { new: true });
    if (!updatedMove) {
      return new Response(JSON.stringify({ error: 'Move not found' }), { status: 404 });
    }
    logger.info(`Move ${id} has been updated`);
    return new Response(JSON.stringify(updatedMove), { status: 200 });
  } catch (error) {
    logger.error('Error updating move:', error);
    return new Response(JSON.stringify({ error: 'Error updating move' }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deletedMove = await Move.findByIdAndDelete(id);
    if (!deletedMove) {
      return new Response(JSON.stringify({ error: 'Move not found' }), { status: 404 });
    }
    logger.info(`Move ${id} has been deleted`);
    return new Response(JSON.stringify({ message: 'Move has been deleted' }), { status: 200 });
  } catch (error) {
    logger.error('Can\'t delete move:', error);
    return new Response(JSON.stringify({ error: 'Can\'t delete move' }), { status: 500 });
  }
}
