import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const API_URL = "https://api.openweathermap.org/data/2.5/weather?";
const API_Key = "9f95fc0ea7bb1383361867cce3ad41c4";

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index.ejs",{content: "waiting for data...",cityName:"",image: "Clear", temperature: "", humidity:"", speed:""});
});

app.post("/get-weather", async (req,res)=>{
    const city = req.body.city;
    try{
        const result = await axios.get(API_URL + "q=" + city + "&units=metric" + "&appid=" + API_Key);
        res.render("index.ejs",{
            content: JSON.stringify(result.data.weather[0].description),
            image: result.data.weather[0].main,
            temperature: JSON.stringify(result.data.main.temp),
            cityName: JSON.stringify(result.data.name),
            humidity: JSON.stringify(result.data.main.humidity),
            speed: JSON.stringify(result.data.wind.speed),
        });
        console.log(result.data.weather[0].description);
    } catch(error){
        res.render("index.ejs",{content: JSON.stringify(error.response.data)});
        console.log(error.response.data);
    }
});

app.get("/about.ejs",(req,res)=>{
    res.render(__dirname + "/views/about.ejs");
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});