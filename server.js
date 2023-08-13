import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
dotenv.config()

const app = express();

app.use(bodyParser.json());

console.log(process.env.SESSION_SECRET_KEY);

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));

const activeSessions = {};

const users = [
  { id: 1, username: 'suraksha', password: 'password', isAdmin: false, devices: [] },
  { id: 2, username: 'admin', password: 'adminpassword', isAdmin: true, devices: [] }
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  req.session.regenerate(err => {

  req.session.userId = user.id;
  user.devices.push(req.session.id);
  activeSessions[user.id] = user.devices;
  
  console.log("🚀 ~ file: server.js:35 ~ app.post ~ activeSessions:", activeSessions)
  console.log("🚀 ~ file: server.js:21 ~ users:", users)

  res.json({ message: 'Logged in successfully' });
});

});

app.post('/admin/kickout', (req, res) => {
  const { adminUsername, adminPassword, userId, deviceIndex } = req.body;

  const adminUser = users.find(u => u.username === adminUsername && u.password === adminPassword);

  if (!adminUser || !adminUser.isAdmin) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  const userToKick = users.find(u => u.id === userId);

  if (!userToKick || !userToKick.devices[deviceIndex]) {
    res.status(404).json({ error: 'User or device not found' });
    return;
  }

  const sessionIdToKick = userToKick.devices[deviceIndex];
  req.sessionStore.destroy(sessionIdToKick, (err) => {
    if (err) {
      res.status(500).json({ error: 'An error occurred while kicking user' });
    } else {
      userToKick.devices.splice(deviceIndex, 1);
      console.log("🚀 ~ file: server.js:35 ~ app.post ~ activeSessions:", activeSessions)
      console.log("🚀 ~ file: server.js:65 ~ users:", users)

      res.json({ message: 'User kicked out from device' });
    }
  });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
