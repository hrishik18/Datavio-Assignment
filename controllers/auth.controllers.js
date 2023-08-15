const db = require("../models");
const config = require("../config/auth.config");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const axios = require('axios');
const cheerio = require('cheerio');

const fs = require('fs');
const path = require('path');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {

    try {
        // Save User to Database
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        })
        res.send({ message: "User registered successfully!" });
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.signin = (req, res) => {
    console.log(req.body);
    User.findOne(
        {
            email: req.body.email
        }
    )
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            const token = jwt.sign({ id: user.id },
                config.secret,
                { expiresIn: 86400 }, // 24 hours
            );

            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                accessToken: token
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.scrape = (req, res) => {
    // if (!req.user) {
    //     return res.status(401).json({ message: 'You must be logged in.' });
    // }
    const url = req.body.url; // Flipkart URL
    axios.get(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            const filePath = 'output.txt';

            // Write data to the file
            // fs.writeFile(filePath, $.toString, (err) => {
            //     if (err) {
            //         console.error('Error writing to file:', err);
            //     } else {
            //         console.log('Data saved to file successfully.');
            //     }
            // });

            // Extracting fields using Cheerio selectors
            const title = $('.B_NuCI').text();
            const price = $('._30jeq3._16Jk6d').text();
            const description = $('._352bdz').text();//_1mXcCf.RmoJUa
            const listItems = $('._2_R_DZ').text();
            const mediaCount = $('._2E1FGS').find('img');
            const mediaCountlen = mediaCount.length;

            //get reviews and rating
            const reviews = listItems.split(' ')[0];
            const ratings = listItems.split(' ')[3];
            const newPost = new Post({
                userId: req.userId,
                url: url,
                title: title,
                price: price,
                description: description,
                reviews: reviews,
                ratings: ratings,
                mediaCount: mediaCountlen,
            });

            newPost.save()
                .then(post => {
                    res.json({ message: 'Post created successfully.', post: post });
                })
                .catch(err => {
                    res.status(500).json({ message: 'Error creating post.', error: err });
                });
        })
        .catch(error => {
            console.error('Error:', error);
        });


}