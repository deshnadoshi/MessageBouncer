const http = require('http');
const request = require('supertest');
const app = require('../../messagebounder.js'); // Replace with the actual path to your server file

describe('HTTP Server Tests', () => {
    let server;

    beforeAll(() => {
        server = http.createServer(app);
        server.listen(0); // Auto-assigns an available port
    });

    afterAll((done) => {
        server.close(done);
    });

    describe('POST / endpoint', () => {
        it('should return 200 with parsed JSON body for application/json', (done) => {
            const requestBody = { key: 'value' };
            request(server)
                .post('/')
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(requestBody))
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(err).toBeNull();
                    expect(res.body).toEqual(requestBody);
                    done();
                });
        });

        // Add similar tests for other content types and scenarios
        // ...

        it('should return 415 for unsupported content type', (done) => {
            const requestBody = { key: 'value' };
            request(server)
                .post('/')
                .set('Content-Type', 'application/pdf') // Unsupported type
                .send(JSON.stringify(requestBody))
                .expect(415)
                .expect('Content-Type', 'text/plain')
                .end(done);
        });

        it('should return 400 for bad request', (done) => {
            request(server)
                .post('/')
                .set('Content-Type', 'application/json')
                .send('Invalid JSON') // Sending invalid JSON
                .expect(400)
                .expect('Content-Type', 'text/plain')
                .end(done);
        });
    });

    // Add more test cases for different endpoints or scenarios as needed
    // ...
});
