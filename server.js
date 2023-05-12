const express = require("express");
const axios = require("axios");
var cors = require('cors');
const app = express();
app.use(cors());//{origin: 'https://www......'}
//const ejs = require("ejs");
app.set("view engine", "ejs");
app.use(express.static('public'));// Serve static files from the 'public and vendor' directory
app.use('/vendor', express.static('vendor'));
var BaseURL = new URL("https://developer.nps.gov/api/v1");
const key ="Hq22lDogB9fT2RnHK5smvVPnlaRF6ELQrnctwlhc";
app.get("/",(req,res) =>{
    res.render("index",{ title: 'My App', header: 'Welcome to National Park Service' });
});
app.get("/search",(req,res)=>{
    const queryParams = req.query;
    if(queryParams["q"].length===0){
        delete queryParams["q"];
    }
    queryParams.api_key=key;
    console.log(queryParams);
    axios.get("https://developer.nps.gov/api/v1/parks?limit=20",{
        params:queryParams
    }).then(function(result){
        //console.log(result.data);
        res.send(result.data.data);
    }).catch(function(err){
        console.log(err.data);
        res.send(err.data);
    })
});
app.get("/detail",(req,res)=>{
    const queryParams = req.query;
    queryParams.api_key = key;
    //get campsite info
    axios.get("https://developer.nps.gov/api/v1/thingstodo?limit=3",{
        params:queryParams
    }).then(function(result){
        console.log(result.data);
        var thingsToDo=processResults(result.data.data);
        res.send(thingsToDo);
    }).catch((err)=>{
        console.log(err.data);
    })
})
app.get("/weather",(req,res)=>{
    const latLong = req.query;
    param= {q:latLong.latitude+","+latLong.longitude};
    //console.log(q);
    axios.get("http://api.weatherapi.com/v1/current.json?key=cf8db6b428334cee9bf190207231105",{
        params:param
    }).then(function(result){
        //console.log(result.data);
        res.send(result.data.current);
    }).catch((err)=>{
        console.log(err.data);
    })
})
app.listen(5000,function(){
    console.log("Server is up and running on port 5000")
})

function processResults(object){
    var things=[];
    object.forEach(result => {
        //console.log(activities);
        things.push({"title":result.title,"description":result.shortDescription});
    });
    return things;
}