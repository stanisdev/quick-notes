'use strict';

module.exports = (fn) => {
  return (req, res) => {
    Promise.resolve(fn(req, res))
      .then(data => {
        res.send(data);
      })
      .catch(error => {
        console.error(error);

        // @todo: print an error messages if development mode
        res.status(500).send({ ok: false });
      });
  }
};