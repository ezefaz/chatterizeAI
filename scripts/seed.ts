const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: 'Politica' },
        { name: 'Peliculas & TV' },
        { name: 'Deporte' },
        { name: 'Musica' },
        { name: 'Juegos' },
        { name: 'Animales' },
        { name: 'Filosofia' },
        { name: 'Cientificos' },
      ],
    });
  } catch (error) {
    console.error('Error seeding default categories', error);
  } finally {
    await db.$disconnect();
  }
}

main();
