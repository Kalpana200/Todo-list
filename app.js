const express =require("express");
const https= require("https");
const bodyParser=require("body-parser");
const ejsLint = require('ejs-lint');
const mongoose= require('mongoose');
const _=require('lodash');
const app = express();
mongoose.connect("mongodb+srv://admin-kalpana:shutup2000@cluster0.qgthg.mongodb.net/todolistDB",{ useNewUrlParser: true ,useUnifiedTopology: true});
const itemschema=mongoose.Schema({
  newItem:String
});
const Item= mongoose.model("Item",itemschema);
const item1=new Item({
  newItem:"Buy Food"
});
const item2=new Item({
  newItem:"Cook Food"
});
const item3=new Item({
  newItem:"Eat Food"
});
var itemsarray=[item1,item2,item3];
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(itemsarray, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {k: "Today", newListItems: foundItems});
    }
  });

});
app.post("/",function(req,res){
  var f= req.body.num;
  var r=req.body.list;
  const item4=new Item({
    newItem:f
  });
  if(r==="Today")
  {
  item4.save();
  res.redirect("/");
  }
  else{
    List.findOne({name:r},function(err,result){
      result.narray.push(item4);
      result.save();
      res.redirect("/"+r);
    });
  }
});
app.post("/delete",function(req,res){
  const c1= req.body.checkbox;
  const c2=req.body.listName;
  if(c2==="Today")
  {
  Item.findByIdAndRemove(c1,function(err){
    if(err){
      console.log("error");
    }
      else{
        console.log("success");
        res.redirect("/");
      }
    });
  }
    else{
      List.findOneAndUpdate({name:c2},{$pull:{narray:{_id:c1}}},function(err){
        if(!err)
        {
          res.redirect("/"+c2);
        }
      });
    }
  });
  const listSchema =mongoose.Schema({
    name:String,
    narray:[itemschema]
  });
  const List =mongoose.model("List",listSchema);

app.get("/:custom",function(req,res){
  const custom=_.capitalize(req.params.custom);
  console.log(custom);
  List.findOne({name:custom},function(err,result){
    if(!err)
    {
      if(!result){
        const list =new List({
        name: custom,
        narray :itemsarray
        });
        list.save();
        res.redirect("/"+custom);
      }
      else{
        res.render("list", {k: result.name, newListItems: result.narray});
      }
    }
  });

});
app.listen(process.env.PORT||3000,function(){
console.log("yes");
});
