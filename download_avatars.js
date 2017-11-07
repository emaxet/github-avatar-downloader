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
    var options = functions.requestOptions("https://api.github.com/users/" + repoOwner);
    request(options, function(err, response, body) {
      var objectBody = JSON.parse(body);
      if (!objectBody.login) {
        console.log(err, repoOwner + "is not a valid Github username.");
      } else {
        functions.getRepoContributors(repoOwner, repoName, functions.accessAvatarData);
      }
    });
  } else {
    console.log("Error: Please only input two command line arguments. First the repository owner, second the repository name.");
  }



