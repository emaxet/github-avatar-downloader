require('dotenv').config();
const request = require('request');
const fs = require('fs');
const functions = require('./functions');

var repoOwner = process.argv.slice(2)[0];
var repoName = process.argv.slice(2)[1];

if(!fs.existsSync("./.env")) {
    throw("Error: Unauthorized access to the Github API. Create a .env file in the root directory of the program and add your access token.");
  } else {
    const envalid = require('envalid');
    const { str } = envalid;

    const env = envalid.cleanEnv(process.env, {
      GITHUB_TOKEN: str(),
    });
  }

console.log('Welcome to the GitHub Avatar Downloader!');

  if (process.argv.slice(2).length === 2) {
    var options = requestOptions("https://api.github.com/users/" + repoOwner);
    request(options, function(err, response, body) {
      var objectBody = JSON.parse(body);
      if (!objectBody.login) {
        console.log(err, repoOwner + "is not a valid Github username.");
      } else {
        getRepoContributors(repoOwner, repoName, accessAvatarData);
      }
    });
  } else {
    console.log("Error: Please only input two command line arguments. First the repository owner, second the repository name.");
  }


function getRepoContributors(repoOwner, repoName, cb) {
  var options = requestOptions("https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors");
  request(options, function(err, res, body) {
    cb(err, body);
  });
}

// converts API data to a computer-readable form.

function accessAvatarData(err, body) {
  var objectBody = JSON.parse(body);
  if (fs.existsSync("./avatars")) {
    objectBody.forEach((object) => {
      downloadImageByURL(object.avatar_url, "./avatars/" + object.login + ".jpg");
      console.log(object.avatar_url);
    });
  } else {
    console.log("Error: No destination directory found. Please make an empty 'avatars' directory in the program's root folder.");
  }
}

// Makes a request to a url and pipes a read stream to a write stream to a specified filePath.

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function(err) {
    throw err;
    })
    .pipe(fs.createWriteStream(filePath));
}

function requestOptions(queryUrl) {
    var options = {
      url: queryUrl,
      headers: {
        'User-Agent': 'request',
        Authorization: "token " + process.env.GITHUB_TOKEN
      }
    }
    return options;
  }


