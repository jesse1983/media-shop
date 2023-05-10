import request from 'supertest';
import app from '../../../src/app';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;
let server: request.SuperTest<request.Test>;

describe('testing  unit', () => {
  beforeAll(async () => {
    server = request(app(new PrismaClient()));
  });

  test('should list units', (done) => {
    server
      .get('/medias/1/units')
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

  test('should show single unit', (done) => {
    server
      .get('/medias/1/units/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.archived).toBe(false);
        expect(res.body.available).toBe(true);
        expect(res.body.availableFor).toEqual(['RENT']);
        expect(res.body.salePrice).toBe(0);
        expect(res.body.rentalPrice).toEqual(10.0);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should create unit', (done) => {
    server
      .post('/medias/1/units')
      .send({
        availableFor: ['SALE', 'RENT'],
        salePrice: 340,
        rentalPrice: 33.9
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBe(8);
        expect(res.body.availableFor).toEqual(['SALE', 'RENT']);
        expect(res.body.salePrice).toBe(340);
        expect(res.body.rentalPrice).toBe(33.9);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should update a unit', (done) => {
    server
      .put('/medias/1/units/1')
      .send({
        availableFor: ['SALE', 'RENT'],
        salePrice: 340,
        rentalPrice: 33.9
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        res.body.id = 1;
        res.body.firstName = 'Callie';
        res.body.lastName = 'Stewart';
        res.body.email = 'stewart@protonmail.edu';
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should not found when request an existing unit', (done) => {
    server
      .get('/medias/1/units/999')
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when try a non-existing a unit', (done) => {
    server
      .delete('/medias/1/units/999')
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should delete a unit', (done) => {
    server
      .delete('/medias/1/units/8')
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when list units with error params', (done) => {
    server
      .get('/medias/1/units')
      .query({ offset: 'x', limit: 'x' })
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
