const express = require('express');
const formidable = require('formidable');

const app = express();

app.get('/', (req, res) => {
  res.send(`

  <html>
  <head></head>
  <body>
      <a href="#" onclick="window.open('D:\\web_proof/uploads/CMCG-Nodejs-VU_VAN_MUNG-1.docx'); return false">CLICK ME</a>
  </body>
  <footer></footer>
</html>
  `)
});

app.post('/api/upload', (req, res, next) => {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    // files.someExpressFiles.filepath.replace(/\\/g, "\\\\");
    // console.log(files.someExpressFiles.filepath);
    res.json({ files });
  });
});

app.listen(8080, () => {
  console.log('Server listening on http://localhost:3000 ...');
});

