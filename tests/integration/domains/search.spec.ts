import request from 'supertest';
import app from '../../../src/app';
import { PrismaClient } from '@prisma/client';

let server: request.SuperTest<request.Test>;

describe('testing  search', () => {
  beforeAll(async () => {
    server = request(app(new PrismaClient()));
  });

  ['MOVIE', 'SERIE', 'BOOK'].forEach((mediaType) => {
    test('should list searches for ' + mediaType, (done) => {
      server
        .get('/search')
        .query({
          mediaType
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
  });

  ['RENT', 'SALE'].forEach((availableFor) => {
    test('should list searches for ' + availableFor, (done) => {
      server
        .get('/search')
        .query({
          title: 'God Father',
          mediaType: 'BOOK',
          availableFor
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.total).toBe(0);
          expect(res.body.data).toHaveLength(res.body.total);
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
  });

  test('should error when search with error params', (done) => {
    server
      .get('/search')
      .query({ offset: 'x', limit: 'x' })
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
