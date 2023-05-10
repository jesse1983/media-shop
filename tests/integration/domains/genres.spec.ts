import request from 'supertest';
import app from '../../../src/app';
import { PrismaClient } from '@prisma/client';

let server: request.SuperTest<request.Test>;

describe('testing  genre', () => {
  beforeAll(async () => {
    server = request(app(new PrismaClient()));
  });

  test('should list genres', (done) => {
    server
      .get('/genres')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.total).toBe(2);
        expect(res.body.data).toHaveLength(res.body.total);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should show single genre', (done) => {
    server
      .get('/genres/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.title).toBe('Science fiction');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should create genre', (done) => {
    server
      .post('/genres')
      .send({
        title: 'Documentary'
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBe(3);
        expect(res.body.title).toBe('Documentary');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should update a genre', (done) => {
    server
      .put('/genres/3')
      .send({
        title: 'Anime'
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toBe('Anime');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should not found when request an existing genre', (done) => {
    server
      .get('/genres/999')
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when try add an existing genre by title and genre type', (done) => {
    server
      .post('/genres')
      .send({
        title: 'Science fiction'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when try modify an genre with another existing genre', (done) => {
    server
      .put('/genres/4')
      .send({
        title: 'Science fiction'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when try a non-existing a genre', (done) => {
    server
      .delete('/genres/999')
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should delete a genre', (done) => {
    server
      .delete('/genres/3')
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when list genres with error params', (done) => {
    server
      .get('/genres')
      .query({ offset: 'x', limit: 'x' })
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
