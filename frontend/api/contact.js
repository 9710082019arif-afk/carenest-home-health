const { handleForm } = require("../lib/server-form");

module.exports = async function handler(req, res) {
  return handleForm(req, res, "contact");
};
