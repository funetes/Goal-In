let users = [
  {
    id: 1,
    userName: 'kim',
    email: 'kimlove2324@gmail.com',
  },
  {
    id: 2,
    userName: 'park',
    email: 'park2324@gmail.com',
  },
];

const index = (req, res) => {
  req.query.limit = req.query.limit || 10;
  const limit = parseInt(req.query.limit);
  if (isNaN(limit)) {
    return res.status(400).end();
  }
  res.json(users.slice(0, limit));
};

const show = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).end();
  }
  const user = users.filter(user => user.id === id)[0];
  if (!user) {
    return res.status(404).end();
  }
  return res.json(user);
};

const destroy = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).end();
  users = users.filter(user => user.id !== id);
  res.status(204).end();
};

const create = (req, res) => {
  const { userName, email } = req.body;
  const isConflict = users.filter(
    user => user.email === email || user.userName === userName
  ).length;
  if (!userName || !email) return res.status(400).end();
  if (isConflict) return res.status(409).end();
  const id = Date.now();
  const user = { id, userName, email };
  users.push(user);
  res.status(201).json(user);
};

const update = (req, res) => {
  const id = parseInt(req.params.id);
  const { userName } = req.body;
  if (isNaN(id) || !userName) return res.status(400).end();

  const user = users.filter(user => user.id === id)[0];
  if (!user) return res.status(404).end();

  const duplicateUserName = users.filter(user => user.userName === userName)[0];
  if (duplicateUserName) return res.status(409).end();

  user.userName = userName;
  res.json(user);
};

module.exports = {
  index,
  show,
  destroy,
  create,
  update,
};
