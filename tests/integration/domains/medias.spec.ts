import request from 'supertest';
import app from '../../../src/app';
import { PrismaClient } from '@prisma/client';

let server: request.SuperTest<request.Test>;

describe('testing  media', () => {
  beforeAll(async () => {
    server = request(app(new PrismaClient()));
  });

  test('should list medias', (done) => {
    server
      .get('/medias')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.total).toBe(3);
        expect(res.body.data).toHaveLength(res.body.total);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should show single media', (done) => {
    server
      .get('/medias/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.title).toBe('Star Wars V');
        expect(res.body.subtitle).toBe('Empire Strikes Back');
        expect(res.body.releaseYear).toBe(1980);
        expect(res.body.mediaType).toBe('MOVIE');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should create media', (done) => {
    server
      .post('/medias')
      .send({
        title: 'Avenger Ultimato',
        subtitle: 'Last fight',
        releaseYear: 2019,
        mediaType: 'MOVIE',
        authorName: 'Stan Lee'
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBe(4);
        expect(res.body.title).toBe('Avenger Ultimato');
        expect(res.body.subtitle).toBe('Last fight');
        expect(res.body.releaseYear).toBe(2019);
        expect(res.body.mediaType).toBe('MOVIE');
        expect(res.body.authorName).toBe('Stan Lee');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should update a media', (done) => {
    server
      .put('/medias/4')
      .send({
        title: 'Avenger Ultimato',
        subtitle: 'Last fight against Thanos',
        releaseYear: 2019,
        mediaType: 'MOVIE',
        authorName: 'Stan Lee'
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body.subtitle).toBe('Last fight against Thanos');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should not found when request an existing media', (done) => {
    server
      .get('/medias/999')
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when try add an existing media by title and media type', (done) => {
    server
      .post('/medias')
      .send({
        title: 'Star Wars V',
        releaseYear: 1999,
        mediaType: 'MOVIE'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when try modify an media with another existing media', (done) => {
    server
      .put('/medias/4')
      .send({
        title: 'Star Wars V',
        subtitle: 'Last fight against Thanos',
        releaseYear: 2019,
        mediaType: 'MOVIE',
        authorName: 'Stan Lee'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when try a non-existing a media', (done) => {
    server
      .delete('/medias/999')
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should delete a media', (done) => {
    server
      .delete('/medias/4')
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when list medias with error params', (done) => {
    server
      .get('/medias')
      .query({ offset: 'x', limit: 'x' })
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
