import request from 'supertest';
import app from '../../../src/app';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;
let server: request.SuperTest<request.Test>;

describe('testing negotiation', () => {
  beforeAll(async () => {
    server = request(app(new PrismaClient()));
  });

  test('should list negotiations', (done) => {
    server
      .get('/negotiations')
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

  test('should show single negotiation', (done) => {
    server
      .get('/negotiations/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.totalPrice).toBe(null);
        expect(res.body.customerId).toBe(1);
        expect(res.body.deliveredAt).toBe(null);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should create negotiation', (done) => {
    server
      .post('/negotiations')
      .send({
        negotiationType: 'RENT',
        totalPrice: 2700,
        customerId: 2,
        scheduledDeliveryAt: '2023-05-12T15:25:44.215Z',
        units: [2, 3]
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBe(3);
        expect(res.body.negotiationType).toBe('RENT');
        expect(res.body.units[0].available).toBe(false);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when create a negotiation with unavailables units', (done) => {
    server
      .post('/negotiations')
      .send({
        negotiationType: 'RENT',
        totalPrice: 2700,
        customerId: 2,
        scheduledDeliveryAt: '2023-05-12T15:25:44.215Z',
        units: [2]
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should deliver negotiation', (done) => {
    server
      .post('/negotiations/3/deliver')
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBe(3);
        expect(res.body.units[0].available).toBe(true);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should not found when request an existing negotiation', (done) => {
    server
      .get('/negotiations/999')
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when try a non-existing a negotiation', (done) => {
    server
      .delete('/negotiations/999')
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should delete a negotiation', (done) => {
    server
      .delete('/negotiations/1')
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should not delete a non existing negotiation', (done) => {
    server
      .delete('/negotiations/999')
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when list negotiations with error params', (done) => {
    server
      .get('/negotiations')
      .query({ offset: 'x', limit: 'x' })
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
