const request = require('request');
const querystring = require('querystring');
const hashString = require('./../helpers/hash-string');
const jwt = require('jsonwebtoken');

module.exports = {
  method: 'GET',
  path: '/welcome',
  config: {
    auth: false
  },
  handler: (req, reply) => {
    const query = req.query;
    const options = {
      method: 'POST',
      url:`https://github.com/login/oauth/access_token?code=${query.code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
    };

    request(options, (error, response, body) => {
      const githubQueries = querystring.parse(body);
      const { access_token } = githubQueries;


      const headers = {
        'User-Agent': 'oauth_github_jwt',
        Authorization: `token ${access_token}`
      };


      request.get({url: 'https://api.github.com/user', headers: headers}, (error, response, body) => {
        if (error) {
          console.log(error);
          return;
        }

        let options = {
          'expiresIn': Date.now() + 24 * 60 * 60 * 1000,
          'subject': 'github-data'
        };


        const bodyParsed = JSON.parse(body);

        let payload = {
          'user': {
            'username': bodyParsed.login,
            'img_url': bodyParsed.avatar_url,
            'user_id': bodyParsed.id
          },
          accessToken: access_token
        };

        const secret = process.env.CLIENT_SECRET;

        jwt.sign(payload, secret, options, (err, jwtToken) => {
          if (error) {
            console.log(error);
            return;
          }

          let config = {
            path: '/',  // the token is valid for every path starting with /
            isSecure: process.env.NODE_ENV === 'PRODUCTION'
          };
          // console.log('===== jwtToken', jwtToken);
          reply
            .redirect('/profile') //make a new route for the redirect, config it with an authentication strategy
            .state('token', jwtToken, config);
        });


      });
    });

  }
};
