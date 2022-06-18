const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Concert = require('../../../models/concert.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /api/concerts', () => {

  before(async () => {
    const testConOne = new Concert({
      _id: '5d9f1140f10a81216cfd4408',
      performer: 'Performer 2',
      genre: 'Genre 1',
      price: 30,
      day: 1,
      image: 'Image 1'
    });
    await testConOne.save();

    const testConTwo = new Concert({
      _id: '5d9f1159f81ce8d1ef2bee48',
      performer: 'Performer 2',
      genre: 'Genre 3',
      price: 40,
      day: 2,
      image: 'Image 2'
    });
    await testConTwo.save();

    const testConThree = new Concert({
      _id: '5d9f1159f81ce8d1ef2bee50',
      performer: 'Performer 2',
      genre: 'Genre 3',
      price: 50,
      day: 3,
      image: 'Image 2'
    });
    await testConThree.save();
  });

  after(async () => {
    await Concert.deleteMany();
  });

  it('/ should return all concerts', async () => {
    const res = await request(server).get('/api/concerts');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(3);
  });

  it('/:id should return one concert by :id ', async () => {
    const res = await request(server).get('/api/concerts/5d9f1140f10a81216cfd4408');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
  });

  it('performer/:performer should return all concerts by :performer ', async () => {
    const res = await request(server).get('/api/concerts/performer/Performer 2');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(3);
  });

  it('genre/:genre should return all concerts by :genre ', async () => {
    const res = await request(server).get('/api/concerts/genre/Genre 3');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
  });

  it('price/:price_min/:price_max should return all concerts with price in range :price_min - :price_max ', async () => {
    const res = await request(server).get('/api/concerts/price/40/50');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
  });

  it('day/:day should return all concerts by :day ', async () => {
    const res = await request(server).get('/api/concerts/day/1');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(1);
  });

});
