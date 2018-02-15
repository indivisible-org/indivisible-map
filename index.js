const express = require('express');

const app = express();

app.use(express.static(`${__dirname}/build`));
app.use('*', (req, res) => res.send('/'));

app.listen(process.env.PORT || 8080, () => {
  console.log('Server up on port', process.env.PORT || 8080);
});
