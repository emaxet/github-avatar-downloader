const request = require('request');

var repoOwner = process.argv[2];
var repoName = process.argv[3];

const starRanking = {};

console.log(repoOwner, repoName);

var options = {
  url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
  headers: {
    'User-Agent': 'request',
  }
};

function repoRecommendation(repoOwner, repoName, cb) {
  request(options, function(err, response, body) {
    let objectBody = JSON.parse(body);
    objectBody.forEach((object) => {
      cb(object.login);
    });
  });
}

function countStarredRepos(userName) {
  var options = requestOptions("https://api.github.com/users/" + userName + "/starred");
  request(options, function(err, response, body) {
    let starredObject = JSON.parse(body);
    starredObject.forEach((repo) => {
      (!starRanking[repo.full_name]) ? starRanking[repo.full_name] = 1 : starRanking[repo.full_name] += 1;
    });
  });
  console.log(starRanking);
}

function requestOptions(queryUrl) {
  var options = {
      url: queryUrl,
      headers: {
        'User-Agent': 'request',
      }
    }
    return options;
}

repoRecommendation(repoOwner, repoName, countStarredRepos);



