//import express module
const express = require("express");
//import bcrypt module
const bcrypt = require("bcrypt");
//import axios module
const axios = require("axios");
//import multer module
const multer = require("multer");
//import JWT module
const jwt = require("jsonwebtoken");
//import path module
const authenticate= require("./middelware/authenticate")
//import path module
const path = require("path");
//import body parser module
const bodyParser = require("body-parser");
// import mongoose
const mongoose = require("mongoose");
//data base name of this project : sportFekriDB
mongoose.connect('mongodb://127.0.0.1:27017/sportFekriDB');
//Creates an Express application.
const app = express();
//configure body parser
//send JSON responses:( de back vers front)
app.use(bodyParser.json());
//get obj from request
app.use(bodyParser.urlencoded({ extended: true }));

// Security configuration
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, Accept, Content-Type, X-Requested-with, Authorization, expiresIn"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS, PATCH, PUT"
    );
    next();
});

// avatars => shortcut
// backend/images=> original path
app.use('/avatars', express.static(path.join('backend/images')))

const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
const storageConfig = multer.diskStorage({
    // destination
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error("Mime type is invalid");
        if (isValid) {
            error = null;
        }
        cb(null, 'backend/images')
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE[file.mimetype];
        const imgName = name + '-' + Date.now() + '-crococoder-' + '.' +
            extension;
        cb(null, imgName);
    }
});

//************Model importation*******************//

//import match Model ( convention du nommage model en majuscule)
const Match = require("./models/match");

//import Player Model ( convention du nommage model en majuscule)
const Player = require("./models/player");

//import Player Model ( convention du nommage model en majuscule)
const User = require("./models/user");

//import PTeamlayer Model ( convention du nommage model en majuscule)
const Team = require("./models/team");

let matchesTab = [
    { id: 1, scoreOne: 2, scoreTwo: 0, teamOne: "FCB", teamTwo: "RMD" },
    { id: 2, scoreOne: 5, scoreTwo: 2, teamOne: "CA", teamTwo: "EST" },
    { id: 3, scoreOne: 9, scoreTwo: 3, teamOne: "CSS", teamTwo: "TTT" },

];

//Business Logic: Add match
app.post("/matches", (req, res) => {
    console.log("here BL: Add match");
    // let match = req.body;

    let match = new Match({
        scoreOne: req.body.scoreOne,
        scoreTwo: req.body.scoreTwo,
        teamOne: req.body.teamOne,
        teamTwo: req.body.teamTwo,
    })
    // matchesTab.push(match);

    match.save();
    res.json({ message: "added successfylly", isadded: true });
    console.log(match);

});

//Business Logic: get all match
app.get("/matches", authenticate, (req, res) => {
    console.log("here BL: get all match");
    Match.find().then((data) => {
        res.json({ matches: data, message: "here all matches" })
    })

});

//Business Logic: edit  match
app.put("/matches", authenticate,  (req, res) => {
    console.log("here BL: edit  match");
    let newMatch = req.body;
    console.log("new match", newMatch);
    Match.updateOne({ _id: newMatch._id }, newMatch).then((editResponse) => {
        console.log("editResponse", editResponse);
        if (editResponse.nModified == 1) {
            res.json({ message: "Match edited with succes" });

        }
    });
});

//Business Logic: get  match by id
app.get("/matches/:id", (req, res) => {
    console.log("here BL: get  match by id");
    let id = req.params.id;
    // let foundedMatch = {};
    // for (let i = 0; i < matchesTab.length; i++) {
    //     if (matchesTab[i].id == id) {
    //         foundedMatch = matchesTab[i]
    //         break;
    //     }
    // }
    // res.json({ match: foundedMatch });

    // _id:id -> c'est la condition if dans le old script
    // doc->oundedMatch = matchesTab[i] : old version ( l'obj récuperer depuis DB)
    Match.findOne({ _id: id }).then((doc) => {
        res.json({ match: doc })
    })
});

//Business Logic: delete  match by id
app.delete("/matches/:id", (req, res) => {
    console.log("here BL: delete  match by id");
    let id = req.params.id;
    for (let i = 0; i < matchesTab.length; i++) {
        if (matchesTab[i].id == id) {
            matchesTab.splice(i, 1);
            break;
        }
    }
    res.json({ message: `Matche N° ${id} is deleted ` });
});

//traitement logique Player : 
//ADD PLAYER 
app.post("/players", (req, res) => {
    console.log("here is BL of add players");
    let player = new Player({
        age: req.body.age,
        name: req.body.name,
        position: req.body.position,
        number: req.body.number,
    });
    player.save();
    res.json({ message: "added successfylly", isadded: true });
    console.log(player);
});



app.put("/players", (req, res) => {
    console.log("here is BL of edit players");
});

app.delete("/players/:id", (req, res) => {
    console.log("here is BL of delete players");

});
//get all PLAYERs

app.get("/players", (req, res) => {
    console.log("here is BL of get all players");
    Player.find().then((data) => {
        res.json({ players: data });
    })
});

// Get players by id
app.get("/players/:id", (req, res) => {
    console.log("here is BL of get players by id ", req.params.id);
    //doc : the result of the search by id in the collection players in the data base
    Player.findOne({ _id: req.params.id }).then((doc) => {
        res.json({ player: doc });
    })
});

//search matches
app.post("/matches/search", (req, res) => {
    console.log(req.body);
    let nvTab = [];
    let searchObj = req.body;
    for (let i = 0; i < matchesTab.length; i++) {
        if (matchesTab[i].scoreOne == searchObj.scoreOne && matchesTab[i].scoreTwo == searchObj.scoreTwo) {
            nvTab.push(matchesTab[i])
        }
    }
    console.log("here nvTab", nvTab);
    res.json({ matches: nvTab });

});

// buisnesse logic: signup

app.post("/allUsers/subscription", multer({ storage: storageConfig }).single('img'), (req, res) => {
    console.log("here into signup", req.body);
    bcrypt.hash(req.body.password, 8).then((cryptedPwd) => {
        let user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: cryptedPwd,
            role: req.body.role,
            avatar: `http://localhost:3000/avatars/${req.file.filename}`
        });
        user.save((error, doc) => {
            console.log("here error", error);
            console.log("here doc", doc);
            if (doc) {
                res.json({ message: "Add with succes" });

            } else {
                res.json({ message: "error" });

            }
        });
    });
});

//business logic : login
app.post("/allUsers/signin", (req, res) => {
    let user = req.body;
    let findedUser;
    console.log("here into login", req.body);
    User.findOne({ email: user.email }).then((doc) => {
        findedUser = doc;
        if (!doc) {
            res.json({ message: "0" })
        }
        return bcrypt.compare(user.password, doc.password);
    }).then(
        (pwdResult) => {
            if (!pwdResult) {
                res.json({ message: "1" });
            } else {

                const token = jwt.sign(
                    {
                        email: findedUser.email,
                        userId: findedUser._id,
                        userRole: findedUser.role,
                    },
                    "Testing",
                    { expiresIn: "1min" }
                );
                let userToSend = {
                    id: findedUser._id,
                    firstName: findedUser.firstName,
                    lastName: findedUser.lastName,
                    role: findedUser.role,
                    jwt: token,
                    expiresIn: 60,
                };
                res.json({ message: "2", user: userToSend });
            }
        }
    )
});


// business logic add team
app.post("/teams", (req, res) => {
    console.log("here BL: Add team", req.body);
    // let match = req.body;
    let teamObject = new Team({

        name: req.body.name,
        stadium: req.body.stadium,
        owner: req.body.owner,
        fondation: req.body.fondation,

    });

    teamObject.save((error, doc) => {

        if (error) {
            res.json({ message: "Not OK" });

        } else {
            res.json({ message: "OK" });

        }

        //ternory operator
        //error ? res.json({ message: "Not OK"}) : res.json({ message: "OK"});
    });
    console.log(teamObject);

});


//Business Logic: get all teams
app.get("/teams", (req, res) => {
    console.log("here BL: get all teams");
    Team.find().then((data) => {
        res.json({ teams: data, message: "here all teams" })
    })

});

//Business Logic: delete teams
app.delete("/teams/:id", (req, res) => {
    let teamId = req.params.id;
    console.log("here BL: delete teams by id", teamId);
    Team.deleteOne({ _id: teamId }).then((data) => {
        console.log("delete response", data);
        if (data.deletedCount == 1) {
            res.json({ message: "Team deleted with succes" });

        }
    });

});

//Business Logic: get  match by id
app.get("/teams/:id", (req, res) => {
    console.log("here BL: get  match by id");
    let id = req.params.id;
    // _id:id -> c'est la condition if dans le old script
    // doc->foundedMatch = matchesTab[i] : old version ( l'obj récuperer depuis DB)
    Team.findOne({ _id: id }).then((doc) => {
        res.json({ teams: doc })
    })
});


app.post("/weather", (req, res) => {
    console.log("here BL:search weather", req.body);
    let city = req.body.city;
    let key = "62ee756a34835483299877a61961cafb";
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    axios.get(apiURL).then(
        (apiResponse) => {
            console.log("here apiResponse", apiResponse.data);
            let result = {
                temperature: apiResponse.data.main.temp,
                pressure: apiResponse.data.main.pressure,
                humidity: apiResponse.data.main.humidity,
                sunrise: apiResponse.data.sys.sunrise,
                sunset: apiResponse.data.sys.sunset,
                icone: apiResponse.data.weather[0].icon,
            };
            res.json({ apiResult: result })
        }
    )
});


// make app importable from another files.(this line must be the last one veryyyy important !)
module.exports = app;
