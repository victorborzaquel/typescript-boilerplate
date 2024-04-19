const settings = require('./config/config.json');

const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
const moment = require('moment');
const LdapAuth = require('ldapauth-fork');
const Promise = require('promise');

app = require('express')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cors')());

let auth = new LdapAuth(settings.ldap);

app.set('jwtTokenSecret', settings.jwt.secret);

const authenticate = function (username, password) {
  return new Promise((resolve, reject) => {
    auth.authenticate(username, password, (err, user) => {
      if (err) reject(err);
      else if (!user) reject();
      else resolve(user);
    });
  });
};

app.post('/authenticate', (req, res) => {
  if (req.body.username && req.body.password) {
    authenticate(req.body.username, req.body.password)
      .then(user => {
        const expires = parseInt(moment().add(2, 'days').format('X'));
        const token = jwt.encode(
          {
            exp: expires,
            user_name: user.uid,
            full_name: user.cn,
            mail: user.mail,
          },
          app.get('jwtTokenSecret')
        );

        res.json({ token: token, full_name: user.cn });
      })
      .catch(err => {
        // Ldap reconnect config needs to be set to true to reliably
        // land in this catch when the connection to the ldap server goes away.
        // REF: https://github.com/vesse/node-ldapauth-fork/issues/23#issuecomment-154487871

        console.log(err);

        if (
          err.name === 'InvalidCredentialsError' ||
          (typeof err === 'string' && err.match(/no such user/i))
        ) {
          res.status(401).send({ error: 'Wrong user or password' });
        } else {
          // ldapauth-fork or underlying connections may be in an unusable state.
          // Reconnect option does re-establish the connections, but will not
          // re-bind. Create a new instance of LdapAuth.
          // REF: https://github.com/vesse/node-ldapauth-fork/issues/23
          // REF: https://github.com/mcavage/node-ldapjs/issues/318

          res.status(500).send({ error: 'Unexpected Error' });
          auth = new LdapAuth(settings.ldap);
        }
      });
  } else {
    res.status(400).send({ error: 'No username or password supplied' });
  }
});

app.post('/verify', (req, res) => {
  const token = req.body.token;
  if (token) {
    try {
      const decoded = jwt.decode(token, app.get('jwtTokenSecret'));

      if (decoded.exp <= parseInt(moment().format('X'))) {
        res.status(400).send({ error: 'Access token has expired' });
      } else {
        res.json(decoded);
      }
    } catch (err) {
      res.status(500).send({ error: 'Access token could not be decoded' });
    }
  } else {
    res.status(400).send({ error: 'Access token is missing' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Listening on port: ' + port);

  if (
    typeof settings.ldap.reconnect === 'undefined' ||
    settings.ldap.reconnect === null ||
    settings.ldap.reconnect === false
  ) {
    console.warn(
      'WARN: This service may become unresponsive when ldap reconnect is not configured.'
    );
  }
});
