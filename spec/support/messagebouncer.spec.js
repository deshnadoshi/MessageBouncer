const supertest = require('supertest');
const { server } = require('../../messagebouncer'); // Replace with the actual filename

const app = supertest(server);

describe('Your Server Tests', () => {
    it('should handle valid JSON content type', async () => {
        const response = await app
            .post('/')
            .send(JSON.stringify({ key: 'value' }))
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ key: 'value' });
    });

    it('should handle invalid content type', async () => {
        const response = await app
            .post('/')
            .send('Invalid Body')
            .set('Content-Type', 'application/octet-stream'); // Set an unsupported content type

        expect(response.status).toBe(415);
        expect(response.text).toBe('Unsupported Media Type. Supported types: text/plain, text/html, text/css, text/javascript, text/xml, application/javascript, application/json, application/xml, application/x-www-form-urlencoded');
    });

    // Add more test cases for different content types and scenarios
});
