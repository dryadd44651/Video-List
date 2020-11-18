var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/vidzy');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', function(req, res, next) {
  res.redirect('/videos')
});

router.get('/videos', async function(req, res) {
	var collection = db.get('videos');
	collection.find({},async function(err, videos){
		if (err) throw err;
    //res.json(videos);
    console.log(req.query)
    let title = req.query.title || '';
    let genre =  req.query.genre || 'All';
    function matches(text, partial) {
      if(partial==='') return 1;
      return text.toLowerCase().indexOf(partial.toLowerCase()) > -1;
    }
    let selected = []
    console.log(selected)    
    await videos.map((video)=>{
      if(matches(video.title,title))
        selected.push(video);
    })
    let filtered = []
    await selected.map((video)=>{
      if(video.genre===genre || genre==='All')
        filtered.push(video);
    })
    console.log(filtered)    
    res.render('index',{videos:filtered,title:title,genre:genre})
	});
});
//new video
// '/videos/new' must in front of '/videos/:id' (prevent new being recognized as :id)
router.get('/videos/new', function(req, res) {
  res.render('new');
});

router.get('/videos/:id', function(req, res) {
	var collection = db.get('videos');
	collection.findOne({ _id: req.params.id }, function(err, video){
		if (err) throw err;
      //res.json(video);
      res.render('show',{video:video})
	});
});



//edit video
router.get('/videos/:id/edit', function(req, res) {
	var collection = db.get('videos');
	collection.findOne({ _id: req.params.id }, function(err, video){
		if (err) throw err;
      //res.json(video);
      console.log(video);
      res.render('edit',{video:video})
	});
});

router.post('/videos', function(req, res) {
  //res.redirect('/videos');
  //res.send('<p>some html</p>');
  
  var collection = db.get('videos');
  collection.insert({
    title: req.body.title,
    genre: req.body.genre,
    image: req.body.image,
    description: req.body.desc
  }, function(err,video){
    if (err) throw err;
    res.redirect('/videos');
  });
});

//delete route
router.delete('/videos/:id', function(req, res){
  //console.log("delete");
    var collection = db.get('videos');
    collection.remove({ _id: req.params.id }, function(err, video){
        if (err) throw err;
        res.redirect('/');
    });
});

router.put('/videos/:id', function(req, res){
  // console.log("edit");
  // console.log( req.params.id);
  //console.log(req.body);
  
  var collection = db.get('videos');
  collection.findOneAndUpdate({ _id: req.params.id}, { $set: req.body }
    , function(err, video){
    if(err) throw err;
    res.redirect('/videos/'+req.params.id);
  });
});


module.exports = router;
