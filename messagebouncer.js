const http = require('http');
const querystring = require('querystring');
const xml2js = require('xml2js');
const acorn = require('acorn');
const css = require('css');
const cheerio = require('cheerio');
const validator = require('html-validator'); 


const server = http.createServer((req, res) => {
    let body = '';
  
    req.on('data', (chunk) => {
        body += chunk;
    });
  
  
    req.on('end', () => {
        const contentType = req.headers['content-type'];
    
        if (!isValidContentType(contentType)) {
            res.writeHead(415, { 'Content-Type': 'text/plain' });
            res.end('Unsupported Media Type. Supported types: text/plain, text/html, text/css, text/javascript, text/xml, application/javascript, application/json, application/xml, application/x-www-form-urlencoded');
            return;
        }
    
        parseBody(contentType, body, (err, parsedBody) => {
            if (err) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end(`Bad Request. ${err.message}`);
                return;
            }
    
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(parsedBody));
        });
    });
    

});
  
/**
 * Determines if the chosen content type is supported. 
 * The list of supported content types have been stored in an array.
 */
function isValidContentType(contentType) {
    contentList =  ["text/plain", "text/html", "text/css", "text/javascript", "text/xml", "application/json", 
                    "application/xml", "application/x-www-form-urlencoded"]; 

    for (let i = 0; i < contentList.length; i++){
        if (contentList[i] === contentType){
            return true; 
        }
    }
    return false; 
}
  


function parseBody(contentType, body, callback) {
    try {
        if (contentType === 'application/json') {
            const parsedJson = JSON.parse(body);
            callback(null, parsedJson);
        } else if (contentType === 'text/plain') {
            callback(null, { message: body });
        } else if (contentType === "text/html") {
            validator({ data: body, isFragment: false })
                .then((data) => {
                    if (data.messages && data.messages.length > 0) {
                        callback(new Error('Invalid HTML content'));
                    } else {
                        const $ = cheerio.load(body, { decodeEntities: false });
                        callback(null, { parsedHtml: $.html() }); 
                    }
                })
                .catch((error) => {
                    callback(error);
                });
        } else if (contentType === "text/css") {
            const parsedCss = css.parse(body);
            callback(null, parsedCss);
        } else if (contentType === "text/javascript" || contentType === "application/javascript") {
            const parsedJs = acorn.parse(body, { ecmaVersion: 'latest' });
            callback(null, parsedJs);
        } else if (contentType === "text/xml" || contentType === "application/xml") {
            xml2js.parseString(body, (err, result) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, { message: result });
                }
            });
        } else if (contentType === "application/x-www-form-urlencoded") {
            // Validate URL-encoded form data
            const decodedBody = decodeURIComponent(body);
            const keyValuePairs = decodedBody.split('&');

            keyValuePairs.forEach(pair => {
                const [key, value] = pair.split('=');
                if (!key || !value || key.includes('=') || value.includes('=')) {
                    throw new Error('Malformed URL-encoded form data');
                }
            });

            const parsedForm = querystring.parse(body);
            callback(null, parsedForm);
        } else {
            callback(new Error('Unsupported Content Type'));
        }
    } catch (error) {
        callback(new Error(`Failed to parse body. ${error.message}`));
    }
}


const port = 3000;

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = {server}; 