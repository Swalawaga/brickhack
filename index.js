const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send(`
    <form method="post" action="/submit">
      <textarea name="text"></textarea>
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post('/submit', (req, res) => {
  const submittedText = req.body.text;
  res.send(`You submitted: ${submittedText}`);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
