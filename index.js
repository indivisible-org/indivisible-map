const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(`${__dirname}/build`));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));

app.listen(process.env.PORT || 8080, () => {
  console.log('Server up on port', process.env.PORT || 8080);
});
