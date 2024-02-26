const supertest = require('supertest');
const { server } = require('../../messagebouncer'); 

const app = supertest(server);

describe('Message Bouncer', () => {
    // Test Case 1: It should handle a valid JSON content type. 
    it('should handle valid JSON content type', async () => {
        const response = await app
            .post('/')
            .send(JSON.stringify({ key: 'value' }))
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ key: 'value' });
    });

    // Test Case 2: It should handle an content type that is not supported.
    it('should handle invalid content type', async () => {
        const response = await app
            .post('/')
            .send('Invalid Body')
            .set('Content-Type', 'application/octet-stream'); 

        expect(response.status).toBe(415);
        expect(response.text).toBe('Unsupported Media Type. Supported types: text/plain, text/html, text/css, text/javascript, text/xml, application/javascript, application/json, application/xml, application/x-www-form-urlencoded');
    });

    // Test Case 3: It should handle a valid plain text content type. 
    it('should handle valid plain text content type', async () => {
        const plainText = 'This is a plain text message';
    
        const response = await app
            .post('/')
            .send(plainText)
            .set('Content-Type', 'text/plain');
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: plainText });
    });

    // Test Case 4: It should handle a valid HTML text content type.
    it('should handle valid HTML content type', async () => {
        const htmlContent = '<html><body><h1>This is HTML!</h1></body></html>';

        const response = await app
            .post('/')
            .send(htmlContent)
            .set('Content-Type', 'text/html');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ parsedHtml: '<h1>This is HTML!</h1>' });
    });

    // Test Case 5: It should handle a valid CSS content type.
    it('should handle valid CSS content type', async () => {
        const cssContent = 'body { font-size: 10px; }';

        const response = await app
            .post('/')
            .send(cssContent)
            .set('Content-Type', 'text/css');

        expect(response.status).toBe(200);
    });

    // Test Case 6: It should handle a valid Javascript content type.
    it('should handle valid JavaScript content type', async () => {
        const jsContent = 'console.log("This is Javascript!");';

        const response = await app
            .post('/')
            .send(jsContent)
            .set('Content-Type', 'text/javascript');

        expect(response.status).toBe(200);
    });

// Test Case 7: It should handle a valid XML content type.
    it('should handle valid XML content type', async () => {
        const xmlContent = '<root><element>This is XML!</element></root>';

        const response = await app
            .post('/')
            .send(xmlContent)
            .set('Content-Type', 'text/xml');

        expect(response.status).toBe(200);
        expect(response.body.message.root.element).toContain('This is XML!');
    });

    // Test Case 8: It should handle a valid URL Encoded Form type.
    it('should handle valid URL Encoded Form content type', async () => {
        const formData = 'key1=value1&key2=value2';

        const response = await app
            .post('/')
            .send(formData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ key1: 'value1', key2: 'value2' });
    });
    
    // Test Case 9: It should handle invalid JSON content type. 
    it('should handle invalid JSON content type', async () => {
        const invalidJson = 'This is not a valid JSON';
    
        const response = await app
            .post('/')
            .send(invalidJson)
            .set('Content-Type', 'application/json')        
           
        expect(response.status).toBe(400);
        expect(response.text).toContain('Bad Request');
            
    
    });
    

    // Test Case 10: It should handle invalid HTML content type.
    it('should handle invalid HTML content type', async () => {
        const invalidHtmlContent = '<bdy> Invalid HTML <body>';

        const response = await app
            .post('/')
            .send(invalidHtmlContent)
            .set('Content-Type', 'text/html');

        expect(response.status).toBe(400);
        expect(response.text).toContain('Bad Request');
    });

    // Test Case 11: It should handle invalid CSS content type.
    it('should handle invalid CSS content type', async () => {
        const invalidCssContent = 'invalid CSS content';

        const response = await app
            .post('/')
            .send(invalidCssContent)
            .set('Content-Type', 'text/css');

        expect(response.status).toBe(400);
        expect(response.text).toContain('Bad Request');
    });

    // Test Case 12: It should handle invalid Javascript content type.
    it('should handle invalid JavaScript content type', async () => {
        const invalidJsContent = 'invalid JavaScript content';

        const response = await app
            .post('/')
            .send(invalidJsContent)
            .set('Content-Type', 'text/javascript');

        expect(response.status).toBe(400);
        expect(response.text).toContain('Bad Request');
    });

    // Test Case 13: It should handle invalid XML content type.
    it('should handle invalid XML content type', async () => {
        const invalidXmlContent = 'This is not valid XML';

        const response = await app
            .post('/')
            .send(invalidXmlContent)
            .set('Content-Type', 'text/xml');

        expect(response.status).toBe(400);
        expect(response.text).toContain('Bad Request');
    });

    // Test Case 14: It should handle invalid URL Encoded form type.
    it('should handle invalid URL Encoded form content type', async () => {
        const invalidFormData = 'key1:value1&key2:value2';

        const response = await app
            .post('/')
            .send(invalidFormData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        expect(response.status).toBe(400);
        expect(response.text).toContain('Bad Request');
    });

    
});
