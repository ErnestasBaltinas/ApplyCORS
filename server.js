const express = require('express');
const mongoose = require('mongoose');
const corsUrls = require('./models/corsUrls');
const app = express();
const port = process.env.PORT || 3000;

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');


mongoose.connect('mongodb+srv://ErnestasDev:ErnestasDev@eb-mongodb-cluster.cxkjm.mongodb.net/apply_cors_db?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.urlencoded({ extended: false }));

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));

app.post('/applyCors', async (req, res) => {

    const url = req.body.fullOriginalUrl;
    const origin = `${req.protocol}://${req.headers.host}`;
    const corsUrl = generateCorsUrl(url, origin);
    await corsUrls.create(corsUrl);

    res.redirect('/');
});

app.get('/api/getUrls', async (req, res) => {
    const urls = await corsUrls.find();
    res.json(urls);
});

app.get('/api/sodra', async (req, res) => {

    res.setHeader('access-control-allow-origin', '*');
    res.setHeader('access-control-allow-methos', 'GET,OPTIONS');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const url = 'https://atvira.sodra.lt/imones-rest/solr/page?_dc=1573298861317&text=&minAvgWage=&maxAvgWage=&minNumInsured=&maxNumInsured=&municipality=21&municipality=55&evrk=62&start=0&size=2000';
        const { data } = await axios.get(url);

        res.send(data);
    } catch (error) {
        res.status(500);
        const response = error.response || {};
        res.send({
            message: error.message,
            response
        });
    }
});

app.get('/redirect/:urlId', async (req, res) => {

    res.setHeader('access-control-allow-origin', '*');
    res.setHeader('access-control-allow-methos', 'GET,OPTIONS');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { originalUrl } = await corsUrls.findOne({ urlId: req.params.urlId });

    if (originalUrl == null) return res.sendStatus(404);

    try {
        const index = req.url.indexOf('?');
        const queryString = req.url.substr(index + 1);
        const { data } = await axios.get(`${originalUrl}?${queryString}`);

        res.json(data);
    } catch (error) {
        res.status(500);
        const response = error.response || {};
        res.send({
            message: error.message,
            response
        });
    }
});

const generateCorsUrl = (url, origin) => {
    const urlObj = new URL(url);
    const urlId = uuidv4();
    const urlSearch = urlObj.search;
    const newUrl = `${origin}/redirect/${urlId}`;

    return {
        urlId,
        fullOriginalUrl: urlObj.href,
        originalUrl: `${urlObj.origin}${urlObj.pathname}`,
        fullNewUrl: `${newUrl}${urlSearch}`,
        newUrl: newUrl
    }
};

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));