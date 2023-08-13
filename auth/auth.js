import jwt from 'jsonwebtoken';
const secretKey = 'surakshasachan';

const user = {
  id: 1,
  username: 'sachan',
  isAdmin: false
};

function generateSessionToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    isAdmin: user.isAdmin
  };

  const options = {
    expiresIn: '1h'
  };

  return jwt.sign(payload, secretKey, options);
}

const sessionToken = generateSessionToken(user);
console.log('Session Token:', sessionToken);
