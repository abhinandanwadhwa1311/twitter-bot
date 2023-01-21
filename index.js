const express = require('express');
const cors = require('cors');
const Twit = require('twit');
require('dotenv').config();
const request = require('request');
const download = require('image-downloader');
const fs = require('fs');
const axios = require('axios');
const Twitter = require('twitter');

const PORT = process.env.PORT || 8181;

const app = express();
app.use(express.json());
app.use(cors());


// OpenAI API init
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);


let url = "";
let title = "";

const fetchMeme = async () => {
    const subReddits = ["shitposting", "dankmemes", "shid_and_camed", "SipsTea", "cursedmemes", "cursedcomments"];
    const random = Math.floor(Math.random() * ((subReddits.length - 1) - (0) + 1)) + (0);

    const randomSubreddit = subReddits[random];


    await axios.get(`https://meme-api.com/gimme/${randomSubreddit}`)
        .then(function (response) {
            // handle success
            // console.log(response.data);
            url = response.data.url;
            title = response.data.title;
            console.log(response.data.subreddit);
        })
        .catch(function (error) {
            // handle error
            console.error(error);
        })
}


// Available Routes
app.get('/', async (req, res) => {

    await fetchMeme();

    const T = new Twit({
        consumer_key: process.env.API_KEY,
        consumer_secret: process.env.API_KEY_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        timeout_ms: 60*1000,
        strictSSL: true,
    });

    options = {
        url: url,
        dest: '../../image.png',     // will be saved to /path/to/dest/photo.jpg
    };

    await download.image(options)
    .then(({ filename }) => {
        console.log('Saved to', filename); // saved to /path/to/dest/photo.jpg

    })
    .catch((err) => console.error(err));



    var b64content = fs.readFileSync('image.png', { encoding: 'base64' });

    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        var mediaIdStr = data.media_id_string
        var altText = "An amazing meme :)"
        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
       
        T.post('media/metadata/create', meta_params, function (err, data, response) {
          if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            var params = { status: title, media_ids: [mediaIdStr] }
       
            T.post('statuses/update', params, function (err, data, response) {
            //   console.log(data);
            if (err) console.error(err);
            console.log("Done");
            })
          }
        })
    })





    res.send("Success!");

});




















app.get('/reply', async (req, res) => {
    const T = new Twit({
        consumer_key: process.env.API_KEY,
        consumer_secret: process.env.API_KEY_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        timeout_ms: 60*1000,
        strictSSL: true,
    });



    // const queries = ["coding", "programming", "javascript", "memes"];
    // const random = Math.floor(Math.random() * ((queries.length-1) - (0) + 1)) + (0);
    // // const random = Math.floor(Math.random() * (max - min + 1)) + min;

    // const searchParams = {
    //     q: queries[random], // The keyword you want to search for
    //     count: 1 // The number of tweets you want to fetch
    // };

    // T.get('search/tweets', searchParams, async function(err, data) {
    //     if (!err) {
    //         // Access the array of tweets in the data.statuses property
    //         const tweets = await data.statuses;
    //         // randomTweet = [tweets[0].id_str, tweets[0].user.screen_name, tweets[0].text];  // tweetId: string, username: string, text: string

    //         const username = tweets[0].user.screen_name;
    //         const tweetId = tweets[0].id_str;
    //         const tweetText = tweets[0].text;

    //         if (username) {

    //             const nextTweet = await openai.createCompletion({
    //                 model: "text-davinci-002",
    //                 prompt: `reply to the tweet "${tweetText}" by @${username} in 30 words`,
    //                 max_tokens: 64
    //                 // prompt: 'Memes'
    //             });
    //             console.log(nextTweet.data);
    //             const replyText = nextTweet.data.choices[0].text;
    //             // Send the reply
    //             T.post('statuses/update', {
    //                 status: replyText,
    //                 in_reply_to_status_id: tweetId,
    //                 auto_populate_reply_metadata: true
    //             }, (err, data, response) => {
    //                 if (err) {
    //                     console.log(err);
    //                 } else {
    //                     console.log('Reply sent!');
    //                 }
    //             });
    //         }
    //     else {
    //         console.log("Internal server error");
    //     }
    //     }
    //     else {
    //         console.log(err);
    //     }
    // });

    // const randomTweet = await getRandomTweet(T);
    // console.log("Hi");
    // console.log(randomTweet);

    // The ID of the tweet that you want to reply to
    // const tweetId = randomTweet[0];





    const targetUserHandles = ["riiiwtff", "xsgames_", "NanouuSymeon", "elonmusk", "growing_daniel", "ykdojo", "kunalstwt", "olanetsoft", "oliverjumpertz", "TheAnkurTyagi", "adititwts", "lamw", "AmandaBlev", "heloise_viegas", "Njuchi_", "AlexJonesax", "ThisisVanshika", "ossia", "rishabk7", "QueenAkpan_", "NoDegreeDotCom", "KanikaTolver", "Dominus_Kelvin", "TechBaeAsh", "_xxdr0", "AritDeveloper", "hackSultan", "AdoraNwodo", "tech_queen", "Samson_Goddy", "DevTobs", "boy_director", "Kaperskyguru", "codingossy", "Gideon_Cyber", "pikacodes", "rfornal", "madzadev", "kb9700", "Prathkum"];


    const randomUserHandleIndex = Math.floor(Math.random() * ((targetUserHandles.length-1) - (0) + 1)) + (0);
    console.log(randomUserHandleIndex);


    // const handle = "abhinandan1311";
    const handle = targetUserHandles[randomUserHandleIndex];

    T.get('statuses/user_timeline', { screen_name: handle, count: 200, exclude_replies: true }, async (err, data, response) => {
        if (err) {
          console.log(err);
        } else {
            let random_tweets = data.sort(()=>Math.random() - 0.5)
            random_tweets = random_tweets.slice(0, 1);

            console.log(random_tweets);

            const username = random_tweets[0].user.screen_name;
            const tweetId = random_tweets[0].id_str;
            const tweetText = random_tweets[0].text;
            console.log(username);


            const nextTweet = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `reply to the tweet "${tweetText}" by @${username} in 30 words`,
                max_tokens: 64
                // prompt: 'Memes'
            });

            const replyText = nextTweet.data.choices[0].text;

                // Send the reply
                T.post('statuses/update', {
                    status: replyText,
                    in_reply_to_status_id: tweetId,
                    auto_populate_reply_metadata: true
                }, (err, data, response) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Reply sent!');
                    }
                });
        
        }
    });
    

    


    res.send("Success!");
});














app.get('/stream', (req, res) => {
    const T = new Twit({
        consumer_key: process.env.API_KEY,
        consumer_secret: process.env.API_KEY_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        timeout_ms: 60*1000,
        strictSSL: true,
    });


    
    const streamUrl = 'https://api.twitter.com/2/tweets/search/stream';
    const bearerToken = process.env.BEARER_TOKEN;


    // Add a rule that filters tweets that are replies to tweets or replies sent by the @suspicious_af_ account
    const ruleUrl = 'https://api.twitter.com/2/tweets/search/stream/rules';
    request.post({
        url: ruleUrl,
        headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        },
        json: {
            add: [{ value: 'to:suspicious_af_' }]
        }
    }, function (error, response, body) {
        if (response.statusCode === 201) {
          console.log('Rule added successfully');
        } else {
          console.error(`An error occurred: ${response.statusCode} ${JSON.stringify(body)}`);
        }
    });

    const stream = request.get({
        url: streamUrl,
        headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        },
        qs: {
            expansions: 'author_id,in_reply_to_user_id'
        }
    });

    stream.on('response', (response) => {
        if (response.statusCode !== 200) {
            console.error(`An error occurred: ${response.statusCode}`);
            stream.destroy();
        }
    });

    stream.on('data', async (data) => {
        try {
            const jsonData = await JSON.parse(data);
            if (await jsonData.hasOwnProperty('message')) {
                console.error(`An error occurred: ${jsonData.message}`);
                stream.destroy();
            } else {
                // reply to the tweet
                const nextTweet = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: `reply to the tweet "${jsonData.data.text}" in 30 words`,
                    max_tokens: 64
                    // prompt: 'Memes'
                });
    
                const replyText = nextTweet.data.choices[0].text;

                // Send the reply
                T.post('statuses/update', {
                    status: replyText,
                    in_reply_to_status_id: jsonData.data.id,
                    auto_populate_reply_metadata: true
                }, (err, data, response) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Reply sent!');
                    }
                });
                
            }
        } catch (e) {
            if (e !== "An error occurred: SyntaxError: Unexpected end of JSON input") {
                console.error(`An error occurred: ${e}`);
            }
        }
    });    

    stream.on('error', (error) => {
        console.error(`An error occurred: ${error}`);
    });

    res.send("Stream started successfully!");
});









app.listen(PORT, () => {
    console.log(`The App is running at http://localhost:${PORT}`);
});
