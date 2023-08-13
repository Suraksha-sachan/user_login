import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.use(session({
  secret: 'surakshasachan',
  resave: false,
  saveUninitialized: true
}));

const activeSessions = {};

const users = [
  { id: 1, username: 'suraksha', password: 'password', isAdmin: false, devices: [] }
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  if (req.session.userId) {
    const previousUserId = req.session.userId;
    if (activeSessions[previousUserId]) {
      const sessionIndex = activeSessions[previousUserId].indexOf(req.session.id);
      if (sessionIndex !== -1) {
        activeSessions[previousUserId].splice(sessionIndex, 1);
      }
      console.log('Previous session destroyed:',req.session.id)
    }
  }

  req.session.regenerate(err => {
    if (err) {
      console.error('Session regeneration error:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    req.session.userId = user.id;
    user.devices.push(req.session.id);
    activeSessions[user.id] = user.devices;

    console.log("🚀 ~ file: index.js:16 ~ activeSessions:", activeSessions);

    res.json({ message: 'Logged in successfully' });
  });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
