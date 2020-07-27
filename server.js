const express = require('express');
const mongoose = require('mongoose');
const appliedCorsUrl = require('./models/appliedCorsUrl');
const app = express();
const port = process.env.PORT || 3000;


mongoose.connect('mongodb+srv://ErnestasDev:ErnestasDev@eb-mongodb-cluster.cxkjm.mongodb.net/apply_cors_db?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));

app.post('/applyCors', async (req, res) => {
    await appliedCorsUrl.create({
        original: req.body.originalUrl,
        name: req.body.customName
    });

    res.redirect('/');
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));