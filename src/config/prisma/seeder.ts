import { MediaType, NegotiationType, PrismaClient } from '@prisma/client';

export default async function (prisma: PrismaClient) {
  const sciFi = await prisma.genre.upsert({
    where: { title: 'Science fiction' },
    update: {},
    create: { title: 'Science fiction' }
  });

  const adventure = await prisma.genre.upsert({
    where: { title: 'Adventure' },
    update: {},
    create: { title: 'Adventure' }
  });

  const starWars = await prisma.media.upsert({
    where: {
      title_mediaType: {
        title: 'Star Wars V',
        mediaType: MediaType.MOVIE
      }
    },
    update: {},
    create: {
      title: 'Star Wars V',
      subtitle: 'Empire Strikes Back',
      releaseYear: 1980,
      authorName: 'George Lucas',
      description:
        'The sequel to Star Wars (1977), it is the second film in the Star Wars film series and the fifth chronological chapter of the "Skywalker Saga"',
      mediaType: MediaType.MOVIE,
      genrers: { connect: { id: sciFi.id } },
      units: {
        createMany: {
          data: [
            { rentalPrice: 10.0, availableFor: ['RENT'] },
            { rentalPrice: 10.0, availableFor: ['RENT'] },
            { rentalPrice: 10.0, availableFor: ['RENT'] }
          ]
        }
      }
    }
  });

  await prisma.media.upsert({
    where: {
      title_mediaType: {
        title: 'The Lord of the Rings',
        mediaType: MediaType.BOOK
      }
    },
    update: {},
    create: {
      title: 'The Lord of the Rings',
      subtitle: 'Part II',
      releaseYear: 2001,
      authorName: 'Tolkien',
      description: 'Frodo recovers in Rivendell under Elronds care',
      mediaType: MediaType.BOOK,
      genrers: { connect: { id: adventure.id } },
      units: {
        createMany: {
          data: [
            { salePrice: 56.9, availableFor: ['SALE'] },
            { salePrice: 56.9, availableFor: ['SALE'] }
          ]
        }
      }
    }
  });

  const got = await prisma.media.upsert({
    where: {
      title_mediaType: {
        title: 'Game of Thrones Season 1',
        mediaType: MediaType.SERIE
      }
    },
    update: {},
    create: {
      title: 'Game of Thrones Season 1',
      releaseYear: 2018,
      mediaType: MediaType.SERIE,
      genrers: { connect: { id: adventure.id } },
      units: {
        createMany: {
          data: [
            {
              salePrice: 199.9,
              rentalPrice: 10.0,
              availableFor: ['SALE', 'RENT']
            },
            { rentalPrice: 10.0, availableFor: ['RENT'] }
          ]
        }
      }
    }
  });
  const threeDays = new Date(new Date().setDate(new Date().getDate() + 3));

  await prisma.customer.upsert({
    where: { email: 'vel@protonmail.edu' },
    update: {},
    create: {
      email: 'vel@protonmail.edu',
      firstName: 'Callie',
      lastName: 'Stewart',
      negotiations: {
        create: {
          negotiationType: NegotiationType.RENT,
          scheduledDeliveryAt: threeDays.toISOString(),
          units: {
            connect: {
              id: starWars.id
            }
          }
        }
      }
    }
  });

  await prisma.customer.upsert({
    where: { email: 'et.lacinia.vitae@google.couk' },
    update: {},
    create: {
      email: 'et.lacinia.vitae@google.couk',
      firstName: 'Maris',
      lastName: 'Shaffer',
      negotiations: {
        create: {
          negotiationType: NegotiationType.SALE,
          totalPrice: 199.9,
          units: {
            connect: {
              id: got.id
            }
          }
        }
      }
    }
  });

  console.log('DB seeded!');
}
