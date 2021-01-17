const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view-engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

//////////////////////////////////////////////// request targetting all articles ///////////////////////////////////////

app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }

  });
})

.post(function(req, res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("successfully added new article");
    }
    else{
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("successfully deleted all the documents!");
    }else{
      res.send(err);
    }
  });
});

// app.get("/articles", );
//
// app.post("/articles", );
//
// app.delete("/articles", );

//////////////////////////////////////////////// request targetting a specific articles ///////////////////////////////////////


app.route("/articles/:articleTitle")


.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle){
        res.send(foundArticle);
      }else{
        res.send("No article found with that name!");
      }
    });
})

.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {
      title: req.body.title,
      content: req.body.content
    },
    {overwrite: true},
    function(err){
      if(!err){
        res.send("successfully updated article");
      }else{
        res.send(err);
      }
    }
  );
})

.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body },
    function(err){
      if(!err){
        res.send("successfully updated article.");
      }else{
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("successfully deleted!");
      }else{
        res.send(err);
      }
    });
});






app.listen(3000, function(){
  console.log("server started at port 3000");
});
