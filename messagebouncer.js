const http = require('http');
const querystring = require('querystring');
const xml2js = require('xml2js');
const acorn = require('acorn');
const css = require('css');
const cheerio = require('cheerio');


const server = http.createServer((req, res) => {
    let body = '';
  
    req.on('data', (chunk) => {
        body += chunk;
    });
  
    req.on('end', () => {
        const contentType = req.headers['content-type'];
  
        if (isValidContentType(contentType) == false){
            // The content type stored in header is not in the list of accepted content types
            res.writeHead(415, { 'Content-Type': 'text/plain' });
            res.end('Unsupported Media Type. Supported types: text/plain, text/html, text/css, text/javascript, text/xml, application/javascript, application/json, application/xml, application/x-www-form-urlencoded');
        }

        let parsedBody;

        try {
            parsedBody = parseBody(contentType, body);
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(`Bad Request. ${error.message}`);
            return;
        }
  
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(parsedBody));
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
  
function parseBody(contentType, body) {
    if (contentType === 'application/json') {
        return JSON.parse(body);
    } else if (contentType === 'text/plain') {
        return { message: body };
    } else if (contentType === "text/html"){
        const $ = cheerio.load(body);
        return { parsedHtml: $('body').html() };
    } else if (contentType === "text/css"){
        return css.parse(body);
    } else if (contentType === "text/javascript" || contentType === "application/javascript"){
        return acorn.parse(body, { ecmaVersion: 'latest' });
    } else if (contentType === "text/xml" || contentType === "application/xml"){
        xml2js.parseString(body, (err, result) => {
            if (err) {
                return err; 
            }
            
            message = result;
        });
        return { message }; 

    } else if (contentType === "application/x-www-form-urlencoded"){
        return querystring.parse(body);
    }
}


const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = {
    isValidContentType,
    parseBody,
};
