# Message Bouncer
### Algorithm Design Description: 

1. To run the program you must first enter the following command:  '“npm install cheerio css acorn xml2js html-validator”. These are all of the packages that are used to parse the content of the HTTP Requests sent. 

2. The permitted content types are the following: contentList =  ["text/plain", "text/html", "text/css", "text/javascript", "text/xml", "application/json", "application/xml", "application/x-www-form-urlencoded"]. 

3. Only the following HTTP codes were used, since they were deemed applicable to the program: 400 (Bad Request), 415 (Unsupported Content Type), 200 (OK). 