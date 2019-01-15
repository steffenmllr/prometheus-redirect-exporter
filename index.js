const server = require('./lib');
const port = parseInt(process.env.PORT, 10) | 3000;


server.listen(port, (err) => {
    if(err) throw err;
    console.log(`Server listening, metrics exposed on http://localhost:${port}/probe?url=https://www.google.de endpoint`);
});
