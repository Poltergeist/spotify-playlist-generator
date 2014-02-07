var request = require('request'),
  tracks = [],
  counter = 0;

function getFirstAlbum(artist) {
  //console.log(artist.href);
  request('http://ws.spotify.com/lookup/1/.json?uri=' + artist.href + '&extras=albumdetail', function(error, response, body) {
    var info;
    //console.log(body);
    if (error) {
      console.log(error);
      counter--;
    }
    if (!error && response.statusCode == 200) {
      info = JSON.parse(body).artist;
      info.albums = info.albums.filter(function(value){
        if(value.album.artist == artist.name){
          return value;
        }
      })
      info.albums.sort(function(a, b) {
        return b.album.released - a.album.released;
      });
      if(!info.albums[0])
        console.log(info);
      info = info.albums[0];
      if(info)
        getTracks(info.album.href);
    }
  });
}
function getTracks(album) {
  request('http://ws.spotify.com/lookup/1/.json?uri=' + album + '&extras=trackdetail', function(error, response, body) {
    var info;
    counter--;
    console.log(counter);
    if(error){
      console.log(error);
    }
    if (!error && response.statusCode == 200) {
      info = JSON.parse(body);
      info.album.tracks.forEach(function(value, index){
        if(index < 4)
          tracks.push(value.href.split(':')[2])
      });
      if(counter <= 1) {
        console.log(tracks.join(','));
      }
    }
  });
}
function getArtist(artist) {
  request('http://ws.spotify.com/search/1/artist.json?q=' + artist, function (error, response, body) {
    var info;
    if(error){
      console.log(error);
      counter--;
    }
    if (!error && response.statusCode == 200) {
      info = JSON.parse(body);
      info = info.artists[0];
      getFirstAlbum(info);
      //console.log(info); // Print the google web page.
    }
  });
}
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
//artists.forEach(function(value, index) {
  //getArtist(value);
//});
getLastFm();
