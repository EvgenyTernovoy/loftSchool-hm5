const config = require('../../config');
const fs = require('fs');
const util = require('util');
const _path = require('path');
const formidable = require('formidable');

const rename = util.promisify(fs.rename);

module.exports = (req) => new Promise((resolve, reject) => {
  const form = formidable.IncomingForm();
  const path =  _path.join(process.cwd(), config.upload.path);

  if(!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }

  form.uploadDir = path;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return resolve({message: err});
    }

    if (files[req.params.id].name === '' || files[req.params.id].size === 0) {
      fs.unlinkSync(files[req.params.id].path);
      return resolve(null);
    }

    const fileName = _path.join(path, files[req.params.id].name);

    rename(files[req.params.id].path, fileName).then(() =>
      resolve(`${config.upload.file}/${files[req.params.id].name}`))
      .catch(err => {
        console.error(err);
        return resolve({message: err});
      });
  });
});
