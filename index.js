const express = require('express');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const port = 4444;

const app = express();

//nem kell a conncetion mivel ez mar alapbol osszekoti az adatbazissal
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    database: "survey_form",
    user: "root",
    password: ""
});

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

//kiszolgalas GET
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./view/form.html"));
});


app.get("/succes", (req, res) => {
    res.sendFile(path.join(__dirname, "./view/succes.html"));
});

app.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "./style/style.css"));
});

//hogy ez mukodjon a success hmtl en bulul a stylesheet nel oda kellet irni a content type ot!!!!
app.get("/style2.css", (req, res) => {
    res.sendFile(path.join(__dirname, "./style/style2.css"));
});

app.get("/formdata", (req, res) => {
    res.sendFile(path.join(__dirname, "./data/formData"));
});

app.get("/script.js", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/script.js"));
});

//kiszolgalas POST
//--POST adat kiolvasás és JSON fajlba íras
app.post('/formaction', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const age = req.body.age;
    const scale = req.body.scale;
    const userRecommend = req.body.userRecommend;
    const prefer = req.body.prefer;
    const comment = req.body.comment;

    let content = {
        name: name,
        email: email,
        age: age,
        scale: scale,
        userRecommend: userRecommend,
        prefer: prefer,
        comment: comment
    };

    //fs----------------------------------------------------------------
    console.log("JSON fajlba iras");
    fs.readFile('./data/formData.json', function (err, data) {
        const ratings = JSON.parse(data);
        ratings.push(content);

        fs.writeFile('./data/formData.json', JSON.stringify(ratings), (err, result) => {
            if (err) console.log('error', err);
        });
    })
    //fs----------------------------------------------------------------

    //mysql----------------------------------------------------------------
    console.log("Adatbeszúrás mysql adatbazisba");
    const myInsert = "INSERT INTO  ratings (name, email , age, scale, userRecommend, prefer, comment ) VALUES ('" + name + "','" + email + "','" + age + "','" + scale + "','" + userRecommend + "','" + prefer + "','" + comment + "')";
    connection.query(myInsert, (err, result) => {
        if (err) throw err;
        console.log(`Beszúrva: ${result.affectedRows} sor`);
    });
    //mysql----------------------------------------------------------------
    console.log(name);
    return res.redirect("/succes");
});

//alap
app.get("/", (req, res) => {
    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Fut a ${port} on... `)
});