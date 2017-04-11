const request = require('request');
const querystring = require('querystring');
const hashString = require('./../helpers/hash-string');


module.exports={
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

      if (access_token) {
        req.cookieAuth.set({access_token});
        return reply.redirect('/profile');
        // return reply.redirect('/profile').state('samatar_piotr_cookie', access_token, {path: '/'});
      }

      reply.redirect('/');
    });
  }
}
