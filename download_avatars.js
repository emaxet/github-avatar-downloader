var request = require('request');
var secret = require('./secrets');
var fs = require('fs');

var repoOwner = process.argv[2];
var repoName = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
    'User-Agent': 'request',
    Authorization: "token " + secret.GITHUB_TOKEN
    }
  }

  request(options, function(err, res, body) {
    console.log(body);
    cb(err, body);
  });
}

function logInfo(err, body) {
  var objectBody = JSON.parse(body);
  objectBody.forEach((object) => {
    downloadImageByURL(object.avatar_url, "./avatars/" + object.login + ".jpg");
    console.log(object.avatar_url);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function(err) {
    throw err;
  })
  .pipe(fs.createWriteStream(filePath));
}

if (repoOwner && repoName) {
  getRepoContributors(repoOwner, repoName, logInfo);
} else {
  console.log("Error: Please input two arguments after running download_avatars.js.");
}
