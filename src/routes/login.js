require('env2')('./config.env');
const client_id = process.env.CLIENT_ID;


module.exports = {
  method: 'GET',
  path: '/login',
  config: {
    auth: false
  },
  handler: (request, reply) => {
    reply.redirect(`https://github.com/login/oauth/authorize?client_id=${client_id}`);
  }
};
