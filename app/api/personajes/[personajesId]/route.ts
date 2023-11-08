import prismaDb from '@/prisma/prismadb';
import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { personajesId: string } }) {
  try {
    const body = await req.json();
    const user = await currentUser();

    const { src, name, description, instructions, seed, categoryId } = body;

    if (!params.personajesId) {
      return new NextResponse('El ID es requerido', { status: 400 });
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse('No Autorizado', { status: 401 });
    }

    if (!src || !name || !description || !instructions || !seed || !categoryId) {
      return new NextResponse('Faltan campos obligatorios', { status: 400 });
    }

    const companion = await prismaDb.companion.update({
      where: {
        id: params.personajesId,
        userId: user.id,
      },
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed,
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log('[COMPANION_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { personajesId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('No Autorizado', { status: 401 });
    }

    const companion = await prismaDb.companion.delete({
      where: {
        userId,
        id: params.personajesId,
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log('[COMPANION_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
