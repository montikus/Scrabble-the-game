// app/api/games/[id]/route.js
import { connectDB } from '@/lib/db';
import Game from '@/models/Game';
import logger from '@/lib/logger';

export async function GET(request, context) {
  try {
    await connectDB();
    const localParams = await context.params;
    const { id } = localParams;
    const game = await Game.findById(id);
    if (!game) {
      return new Response(JSON.stringify({ error: 'Game not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(game), { status: 200 });
  } catch (error) {
    logger.error('Error getting game:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();
    const updatedGame = await Game.findByIdAndUpdate(id, data, { new: true });
    if (!updatedGame) {
      return new Response(JSON.stringify({ error: 'Game not found' }), { status: 404 });
    }
    logger.info(`Game ${id} has been updated`);
    return new Response(JSON.stringify(updatedGame), { status: 200 });
  } catch (error) {
    logger.error('Error updating game:', error);
    return new Response(JSON.stringify({ error: 'Error updating game: ' }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deletedGame = await Game.findByIdAndDelete(id);
    if (!deletedGame) {
      return new Response(JSON.stringify({ error: 'Game not found' }), { status: 404 });
    }
    logger.info(`Game ${id} has been deleted`);
    return new Response(JSON.stringify({ message: 'Game has been deleted' }), { status: 200 });
  } catch (error) {
    logger.error('Can\'t delete game:', error);
    return new Response(JSON.stringify({ error: 'Can\'t delete game' }), { status: 500 });
  }
}
