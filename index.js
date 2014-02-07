var request = require('request'),
  tracks = [],
  counter = 0;

function getTopTracks(artist) {
  request('http://ws.spotify.com/search/1/track.json?q=artist:'+artist.replace(' ', '+'), function(error, response, body){
    if (error) {
      console.log(error);
    }
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      counter--;
      body.tracks.forEach(function(value, index){
        if(index < 5)
        tracks.push(value.href.split(':')[2])
      });
      if (counter <= 1) {
        console.log('<a href="'+ tracks.join(',') + '">Play</a>');
      }
    }
  });
}
function getLastFm(user) {
  request('http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=spec2k5&api_key=b70ff5468723f99f0e715e024e5d652b&format=json&period=12month', function(error, response, body){
    body = JSON.parse(body).topartists.artist;
    body.forEach(function(value, index){
      counter++;
      console.log(counter);
      getTopTracks(value.name);
    });
  });

}
getLastFm();
