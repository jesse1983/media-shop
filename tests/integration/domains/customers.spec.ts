import request from 'supertest';
import app from '../../../src/app';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;
let server: request.SuperTest<request.Test>;

describe('testing  customer', () => {
  beforeAll(async () => {
    server = request(app(new PrismaClient()));
  });

  test('should list customers', (done) => {
    server
      .get('/customers')
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

  test('should show single customer', (done) => {
    server
      .get('/customers/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.firstName).toBe('Callie');
        expect(res.body.lastName).toBe('Stewart');
        expect(res.body.email).toBe('vel@protonmail.edu');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should create customer', (done) => {
    server
      .post('/customers')
      .send({
        firstName: 'Geralt',
        lastName: 'of Rivia',
        email: 'geralt.rivia@thewitcher.com'
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBe(3);
        expect(res.body.firstName).toBe('Geralt');
        expect(res.body.lastName).toBe('of Rivia');
        expect(res.body.email).toBe('geralt.rivia@thewitcher.com');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should update a customer', (done) => {
    server
      .put('/customers/1')
      .send({
        firstName: 'Callie',
        lastName: 'Stewart',
        email: 'stewart@protonmail.edu'
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

  test('should not found when request an existing customer', (done) => {
    server
      .get('/customers/999')
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when try add an existing customer by email', (done) => {
    server
      .post('/customers')
      .send({
        firstName: 'Callie',
        lastName: 'Stewart',
        email: 'stewart@protonmail.edu'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when try modify an customer with another existing customer', (done) => {
    server
      .put('/customers/1')
      .send({
        firstName: 'Callie',
        lastName: 'Stewart',
        email: 'et.lacinia.vitae@google.couk'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when try a non-existing a customer', (done) => {
    server
      .delete('/customers/999')
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should delete a customer', (done) => {
    server
      .delete('/customers/1')
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when list customers with error params', (done) => {
    server
      .get('/customers')
      .query({ offset: 'x', limit: 'x' })
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
