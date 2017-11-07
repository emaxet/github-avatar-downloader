require('dotenv').config();
const request = require('request');
const fs = require('fs');

// Functions that need to be exported from functions.js

// requestOptions
// getRepoContributors
// accessAvatarData

var functions = {
  getRepoContributors: function(repoOwner, repoName, cb) {
    var options = this.requestOptions("https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors");
    request(options, function(err, res, body) {
      cb(err, body);
    });
  },
  accessAvatarData: function(err, body) {
    var objectBody = JSON.parse(body);
    if (fs.existsSync("./avatars")) {
      objectBody.forEach((object) => {
        downloadImageByURL(object.avatar_url, "./avatars/" + object.login + ".jpg");
        console.log(object.avatar_url);
      });
    } else {
    console.log("Error: No destination directory found. Please make an empty 'avatars' directory in the program's root folder.");
    }
  },
  requestOptions: function(queryUrl) {
    var options = {
      url: queryUrl,
      headers: {
        'User-Agent': 'request',
        Authorization: "token " + process.env.GITHUB_TOKEN
      }
    }
    return options;
  }
};

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function(err) {
    throw err;
    })
    .pipe(fs.createWriteStream(filePath));
};

module.exports = functions;