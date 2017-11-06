var request = require('request');
var secret = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
    'User-Agent': 'request',
    'auth': secret.GITHUB_TOKEN
    }
  }


  request(options, function(err, res, body) {
    cb(err, body);
  });
}

function logInfo(err, body) {
  var objectBody = JSON.parse(body);
  objectBody.forEach((object) => {
    console.log(object.avatar_url);
  });
}

getRepoContributors('jquery', 'jquery', logInfo);
