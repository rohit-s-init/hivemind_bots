import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import newsToPosts from "./util/gemini_posts.js";
import addPosts2 from "./util/db_post2.js";
import getAllWorkflows, { uploadWorkflow } from "./util/db_workflow.js";
import dotenv from "dotenv";
dotenv.config();



const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(cors());
// app.use(cors)
app.use(express.static("public"));








function startStep(workFlowId, step) {
    io.emit("startstep", {
        workFlowId,
        step
    });
}

function completeStep(workFlowId, step, status, response) {
    io.emit("completestep", {
        workFlowId,
        step,
        response,
        status
    });
}

function errorStep(workFlowId, step, status, response) {
    io.emit("errorstep", {
        workFlowId,
        step,
        response,
        status
    });
}

function runStep(workFlowId, step, duration = 500) {
    return new Promise((resolve) => {

        startStep(workFlowId, step);

        setTimeout(() => {
            completeStep(workFlowId, step);
            resolve();
        }, duration);

    });
}

// async function runWorkflow(workFlowId) {

//     await runStep(workFlowId, "cron");
//     await runStep(workFlowId, "search");
//     await runStep(workFlowId, "scraping");

//     // BRANCH SPLIT

//     const branchA = async () => {
//         await runStep(workFlowId, "gemini");
//         await runStep(workFlowId, "posts-generated");
//         await runStep(workFlowId, "assign-user");
//         await runStep(workFlowId, "assign-group");
//         await runStep(workFlowId, "db-insert");
//         await runStep(workFlowId, "branch-a-success");
//     };

//     const branchB = async () => {
//         await runStep(workFlowId, "precedence-determination");
//         await runStep(workFlowId, "sorting");
//         await runStep(workFlowId, "whatsapp-generation");
//         await runStep(workFlowId, "add-important-news-app");
//         await runStep(workFlowId, "branch-b-success");
//     };

//     await Promise.all([
//         branchA(),
//         branchB()
//     ]);

//     console.log("workflow complete");
// }












// https://news-scrapper-three.vercel.app/

const temp_gemini_data = [
    {
        "title": "Billionaire West Ham co-owner accused of abusing his power and preying on women for sex",
        "body": "Women say David Sullivan told them they needed to have sex with him to feature in his newspapers.",
        "image": "https://ichef.bbci.co.uk/news/1024/branded_news/6238/live/570de590-632e-11f1-9c51-2750bc009463.jpg"
    },
    {
        "title": "Who is David Sullivan - football boss, 'king of porn' and alleged sexual predator?",
        "body": "The ex-West Ham boss has long boasted of sexual conquests, but is now accused of exploitative behaviour.\n",
        "image": "https://ichef.bbci.co.uk/news/1024/branded_news/83f8/live/93cb5070-59d4-11f1-a86d-8bf9558fa476.jpg"
    },
    {
        "title": "Rare footage captured of Great White shark in Mediterranean Sea",
        "body": "A volunteer diver has described shaking as he filmed his encounter with an endangered Great White shark between Tunisia and Sicily.",
        "image": "https://ichef.bbci.co.uk/news/1024/branded_news/506c/live/b30cebe0-6309-11f1-89a3-d1f559421220.jpg"
    },
    {
        "title": "Sikh group calls for inquiry into Henry Nowak death",
        "body": "Dabinderjit Singh of the Sikh Federation has written to the government calling for an inquiry.",
        "image": "https://ichef.bbci.co.uk/news/1024/branded_news/23d8/live/6d9b2a90-6313-11f1-8b8c-6d33e1d5abb6.png"
    },
    {
        "title": "New drug to stop 'Ozempic butt' muscle loss",
        "body": "A third of the weight loss from obesity jabs can come from muscle, say experts. ",
        "image": "https://ichef.bbci.co.uk/news/1024/branded_news/94be/live/1c0808d0-601e-11f1-acdf-f9f4106f3b48.jpg"
    },
    {
        "title": "US Iran War Live: Israel, Iran Announce Halting Of Strikes As Trump Demands A 'Stop'",
        "body": "US Iran War LIVE Updates: Iran closed the airspace around Tehran's Imam Khomeini International Airport, the country's main airfield, after the Israeli attack."
    },
    {
        "title": "Several Indian Workers Killed In Dubai After Minibus Collides With Truck",
        "body": "Several Indian Workers Killed In Dubai After Minibus Collides With Truck"
    },
    {
        "title": "100 Days Of War In Middle East, 60 Days Of Peace, And Then It All Fell Apart",
        "body": "As Israel and Iran traded blows, the wider regional fallout was immediate. Iraq's Civil Aviation Authority announced a 72-hour closure of Iraqi airspace in response to the renewed attacks."
    },
    {
        "title": "They Stole Wallet Loaded With Cash On A Bus. Then Luck Ran Out",
        "body": "The accused, identified as Radha, a native of Karnataka, and her male companion Ratheesh, were later arrested from their rented accommodation in Kerala's Ernakulam district."
    },
    {
        "title": "Punjab's 'Protest Politics' Comes Full Circle For Arvind Kejriwal And AAP",
        "body": "What makes these protests politically significant is that many of these groups were among AAP's most enthusiastic supporters before the 2022 elections"
    },
    {
        "title": "Apple WWDC 2026 LIVE | What to expect and where to watch the keynote",
        "body": "Apple's WWDC this year runs between June 8 and June 12, and starts today at 22:30 IST. The key question for WWDC 2026 is whether or not the AI-enhanced Siri is finally ready to take the stage. ",
        "image": "https://th-i.thgim.com/public/sci-tech/technology/h6q1jq/article71075712.ece/alternates/LANDSCAPE_1200/WWDC%202026.png"
    },
    {
        "title": "BGB delegation arrives in India for border talks with BSF",
        "body": "The talks are taking place against the backdrop of tensions between the two border-guarding forces over allegations by Bangladesh that the BSF has been sending undocumented Bangladeshis across the border through multiple land entry points.",
        "image": "https://th-i.thgim.com/public/news/national/wnps2s/article71078132.ece/alternates/LANDSCAPE_1200/BSF%20BGB.jpg"
    },
    {
        "title": "7 Indian workers killed, 5 critically injured in road accident in Dubai",
        "body": "The accident resulted in seven fatalities and nine injuries, including five serious and four moderate injuries, the Dubai Police said, while adding that all injured were transported to the hospital for treatment",
        "image": "https://th-i.thgim.com/public/news/national/hlu8ay/article71078116.ece/alternates/LANDSCAPE_1200/Screenshot%202026-06-08%20223708.png"
    },
    {
        "title": "Experts suspect technical failures, cost-cutting led to VSP accident",
        "body": "The absence of a mandatory safety cover on top of the exploded ladle significantly escalated the severity of the blast, opines a former staffer",
        "image": "https://www.thehindu.com/theme/images/og-image.png"
    },
    {
        "title": "Akhilesh spreading ‘fabricated lies’ about Ram temple, says BJP",
        "body": "Temple trust says “nothing noteworthy has come to light yet” in the audit; Akhilesh Yadav calls response “suspicious”; BJP says “narrative of lies will never succeed” and SP will lose 2027 polls",
        "image": "https://th-i.thgim.com/public/incoming/osz86p/article71078110.ece/alternates/LANDSCAPE_1200/20250405391L.jpg"
    }
];

const IS_DEV = true;
async function testGemini() {
    if (IS_DEV == true) {
        await new Promise((resolve, rej) => {
            setTimeout(() => {
                resolve();
            }, 5000);
        })
        return temp_gemini_data;
    }
    const resp = await newsToPosts(JSON.stringify([
        {
            "title": "Billionaire West Ham co-owner accused of abusing his power and preying on women for sex",
            "body": "Women say David Sullivan told them they needed to have sex with him to feature in his newspapers.",
            "image": "https://ichef.bbci.co.uk/news/1024/branded_news/6238/live/570de590-632e-11f1-9c51-2750bc009463.jpg"
        },
        {
            "title": "Who is David Sullivan - football boss, 'king of porn' and alleged sexual predator?",
            "body": "The ex-West Ham boss has long boasted of sexual conquests, but is now accused of exploitative behaviour.\n",
            "image": "https://ichef.bbci.co.uk/news/1024/branded_news/83f8/live/93cb5070-59d4-11f1-a86d-8bf9558fa476.jpg"
        },
        {
            "title": "Rare footage captured of Great White shark in Mediterranean Sea",
            "body": "A volunteer diver has described shaking as he filmed his encounter with an endangered Great White shark between Tunisia and Sicily.",
            "image": "https://ichef.bbci.co.uk/news/1024/branded_news/506c/live/b30cebe0-6309-11f1-89a3-d1f559421220.jpg"
        },
        {
            "title": "Sikh group calls for inquiry into Henry Nowak death",
            "body": "Dabinderjit Singh of the Sikh Federation has written to the government calling for an inquiry.",
            "image": "https://ichef.bbci.co.uk/news/1024/branded_news/23d8/live/6d9b2a90-6313-11f1-8b8c-6d33e1d5abb6.png"
        },
        {
            "title": "New drug to stop 'Ozempic butt' muscle loss",
            "body": "A third of the weight loss from obesity jabs can come from muscle, say experts. ",
            "image": "https://ichef.bbci.co.uk/news/1024/branded_news/94be/live/1c0808d0-601e-11f1-acdf-f9f4106f3b48.jpg"
        },
        {
            "title": "US Iran War Live: Israel, Iran Announce Halting Of Strikes As Trump Demands A 'Stop'",
            "body": "US Iran War LIVE Updates: Iran closed the airspace around Tehran's Imam Khomeini International Airport, the country's main airfield, after the Israeli attack."
        },
        {
            "title": "Several Indian Workers Killed In Dubai After Minibus Collides With Truck",
            "body": "Several Indian Workers Killed In Dubai After Minibus Collides With Truck"
        },
        {
            "title": "100 Days Of War In Middle East, 60 Days Of Peace, And Then It All Fell Apart",
            "body": "As Israel and Iran traded blows, the wider regional fallout was immediate. Iraq's Civil Aviation Authority announced a 72-hour closure of Iraqi airspace in response to the renewed attacks."
        },
        {
            "title": "They Stole Wallet Loaded With Cash On A Bus. Then Luck Ran Out",
            "body": "The accused, identified as Radha, a native of Karnataka, and her male companion Ratheesh, were later arrested from their rented accommodation in Kerala's Ernakulam district."
        },
        {
            "title": "Punjab's 'Protest Politics' Comes Full Circle For Arvind Kejriwal And AAP",
            "body": "What makes these protests politically significant is that many of these groups were among AAP's most enthusiastic supporters before the 2022 elections"
        },
        {
            "title": "Apple WWDC 2026 LIVE | What to expect and where to watch the keynote",
            "body": "Apple's WWDC this year runs between June 8 and June 12, and starts today at 22:30 IST. The key question for WWDC 2026 is whether or not the AI-enhanced Siri is finally ready to take the stage. ",
            "image": "https://th-i.thgim.com/public/sci-tech/technology/h6q1jq/article71075712.ece/alternates/LANDSCAPE_1200/WWDC%202026.png"
        },
        {
            "title": "BGB delegation arrives in India for border talks with BSF",
            "body": "The talks are taking place against the backdrop of tensions between the two border-guarding forces over allegations by Bangladesh that the BSF has been sending undocumented Bangladeshis across the border through multiple land entry points.",
            "image": "https://th-i.thgim.com/public/news/national/wnps2s/article71078132.ece/alternates/LANDSCAPE_1200/BSF%20BGB.jpg"
        },
        {
            "title": "7 Indian workers killed, 5 critically injured in road accident in Dubai",
            "body": "The accident resulted in seven fatalities and nine injuries, including five serious and four moderate injuries, the Dubai Police said, while adding that all injured were transported to the hospital for treatment",
            "image": "https://th-i.thgim.com/public/news/national/hlu8ay/article71078116.ece/alternates/LANDSCAPE_1200/Screenshot%202026-06-08%20223708.png"
        },
        {
            "title": "Experts suspect technical failures, cost-cutting led to VSP accident",
            "body": "The absence of a mandatory safety cover on top of the exploded ladle significantly escalated the severity of the blast, opines a former staffer",
            "image": "https://www.thehindu.com/theme/images/og-image.png"
        },
        {
            "title": "Akhilesh spreading ‘fabricated lies’ about Ram temple, says BJP",
            "body": "Temple trust says “nothing noteworthy has come to light yet” in the audit; Akhilesh Yadav calls response “suspicious”; BJP says “narrative of lies will never succeed” and SP will lose 2027 polls",
            "image": "https://th-i.thgim.com/public/incoming/osz86p/article71078110.ece/alternates/LANDSCAPE_1200/20250405391L.jpg"
        }
    ]))
    console.log(resp);
    return resp;
}
// run();

const def_pred = {
    "EnergyPower": 0.0,
    "Crime": 0.0,
    "WorldNews": 0.0,
    "RegionalNews": 0.0,
    "Sports": 0.0,
    "BusinessCorporate": 0.0,
    "Entertainment": 0.0,
    "Infrastructure": 0.0,
    "Education": 0.0,
    "BankingFinance": 0.0,
    "EmploymentCareers": 0.0,
    "Economy": 0.0,
    "HealthMedicine": 0.0,
    "Politics": 0.0,
    "SpaceAstronomy": 0.0,
    "StockMarket": 0.0,
    "EnvironmentClimate": 0.0,
    "DefenceMilitary": 0.0,
    "LawJustice": 0.0,
    "GovernmentPolicy": 0.0,
    "RealEstate": 0.0,
    "Cybersecurity": 0.0,
    "Pharmaceuticals": 0.0,
    "Startups": 0.0,
    "InternationalRelations": 0.0,
    "Technology": 0.0,
    "ArtificialIntelligence": 0.0
}




async function calcNewsPredecence(news) {
    return news.map((news) => {
        return {
            ...news,
            predecence: def_pred
        }
    })
}

async function addNewsToDb(news) {

}


async function leftTree(id, news) {
    await startStep(id, "category-ai")

    const payload = {
        "headlines": news.map((n) => { return n.title })
    }

    console.log("payload : ");
    console.log(payload);

    const catResp = await fetch("https://rohit314159-news-classifier.hf.space/predict-batch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    const category = (await catResp.json()).results;

    console.log(category);

    const news_with_cat = news.map((n, i) => {
        return {
            ...n,
            category: category[i]
        }
    })

    // console.log(news_with_cat);

    await completeStep(id, "category-ai", true, JSON.stringify(news_with_cat, null, 2));

    await startStep(id, "content-generation");

    const aiPostPayload = news_with_cat.map((n) => {
        return {
            title: n.title,
            body: n.body,
            image: n.image
        }
    })

    console.log(aiPostPayload);
    let posts;
    try {
        posts = await newsToPosts(JSON.stringify(aiPostPayload));
        // posts = temp_gemini_data;
    } catch (error) {
        errorStep(id, "content-generation", false, posts)
        return;
    }
    // for testing purpose
    // const posts = [
    //     {
    //         id: 1,
    //         heading: 'Well, this explains a lot about my brain fog!',
    //         body: "Just saw this study that links chronic sleep deprivation in young adults (18-35) to cognitive decline, affecting memory and problem-solving. Honestly, reading this made me pause. I know I don't get enough sleep, and sometimes I feel like my brain is running on fumes. Maybe those late nights are catching up faster than I thought. It’s a real wake-up call to start taking sleep hygiene seriously, because I really don't want to mess up my future brain power!"
    //     },
    //     {
    //         id: 2,
    //         heading: 'Another round of tech layoffs... my heart goes out to everyone affected.',
    //         body: "Heard the news about another major global tech company laying off thousands of employees as part of a restructuring. This is just devastating to hear. It feels like this is becoming a monthly occurrence, and it must be so stressful for all the individuals and families impacted. The job market is already so competitive. I really hope everyone who's been let go lands on their feet quickly and finds new opportunities soon."
    //     },
    //     {
    //         id: 3,
    //         heading: 'Absolutely gutted about the historic landmark vandalism. Who does this?!',
    //         body: "Can you believe someone vandalized that beautiful historic statue overnight? I just saw the news, and it honestly makes me so angry and sad. That landmark has been a part of our city's history for centuries, and for someone to just disrespect it like that is beyond me. It’s not just a statue; it’s a piece of our heritage. I really hope they catch whoever did it and that the restoration efforts are successful."
    //     },
    //     {
    //         id: 4,
    //         heading: 'THIS IS HUGE for climate change and renewable energy!',
    //         body: 'Okay, just saw that scientists announced a major breakthrough in energy storage for renewables like solar and wind! This is genuinely such exciting news. For so long, people have talked about how storing clean energy efficiently is the biggest hurdle, and if this new battery tech works, it could totally accelerate our transition away from fossil fuels. It gives me so much hope that we might actually be able to tackle climate change more effectively.'
    //     },
    //     {
    //         id: 5,
    //         heading: "Our voices didn't matter. So frustrated about the green space decision.",
    //         body: "Ugh, I'm so incredibly frustrated. The city council just approved that controversial zoning change for a massive commercial development on our protected green space, despite strong community opposition. So many of us showed up to speak, signed petitions, and raised valid environmental concerns, and it feels like they just completely ignored us. It's disheartening when local government prioritizes corporate interests over public welfare and environmental preservation. What a letdown."
    //     },
    //     {
    //         id: 6,
    //         heading: 'Mind-blowing! That marathon world record is just incredible.',
    //         body: "Did anyone else see that runner absolutely shatter the world marathon record?! I mean, wow. It's just incredible to witness that level of human endurance and dedication. I can barely run a mile without feeling it, so to imagine the training, mental fortitude, and sheer will power it takes to do that is just beyond impressive. Definitely feeling inspired to push myself a little harder today after seeing such an amazing achievement!"
    //     },
    //     {
    //         id: 7,
    //         heading: "Finally tackling fake news, but where's the line on free speech?",
    //         body: "So, governments are apparently bringing in new regulations for social media platforms to combat misinformation and harmful content. On one hand, yes, please! I am so tired of all the wild, unchecked stuff I see online. But then, it also makes me wonder about censorship and where they draw the line with free speech. It's a really tricky balance, and I hope they get it right without stifling legitimate discussion or dissent."
    //     },
    //     {
    //         id: 8,
    //         heading: 'Is anyone else freaking out about this new exoplanet discovery?!',
    //         body: "Okay, just heard that astronomers discovered another potentially habitable exoplanet, right in the 'habitable zone' of its star! Every time news like this breaks, my mind just goes wild. Like, it could actually have liquid water! Imagine if there's life out there. It makes you feel so small yet so connected to the vastness of the universe. Definitely going to be staring at the stars differently tonight."
    //     },
    //     {
    //         id: 9,
    //         heading: 'Great, more expensive groceries... my wallet is crying already.',
    //         body: "Just read that global food prices are expected to keep rising because of supply chain issues, bad weather, and all the geopolitical stuff happening. Honestly, as if groceries weren't expensive enough already! It's getting really tough to budget, and I'm genuinely worried about how much more basic necessities are going to cost in the coming months. It feels like a constant battle to just keep up with everyday expenses."
    //     },
    //     {
    //         id: 10,
    //         heading: 'Wish our public transport was this good! This city is doing it right.',
    //         body: "Wow, heard about this major city launching an advanced public transportation system with electric buses and expanded rail lines. That's genuinely so cool and exactly what more cities need! Imagine being able to get around efficiently, reduce traffic congestion, and lower carbon emissions all at once. I'm a bit jealous, to be honest; it would make such a huge difference in daily life if our city invested in something similar."
    //     },
    //     {
    //         id: 11,
    //         heading: 'Such hopeful news for those with autoimmune diseases!',
    //         body: "Just saw a report about a new medical treatment showing really promising results for severe autoimmune diseases. My friend has been struggling with rheumatoid arthritis for years, and hearing news like this gives me so much hope for them and millions of others. Imagine the relief and improved quality of life this could bring. It's truly incredible what advancements medical science is making."
    //     },
    //     {
    //         id: 12,
    //         heading: "Another streaming price hike, really? Guess I'm canceling.",
    //         body: "Ugh, just got the notification that my favorite streaming service is raising prices AGAIN and introducing a new ad-supported tier. Seriously? It feels like every month, another one of my subscriptions gets more expensive for less. I'm at the point where I'm just going to start canceling some of these. It's getting ridiculous how much it all adds up, and it's not worth it anymore."
    //     },
    //     {
    //         id: 13,
    //         heading: 'My mind is blown! Archaeologists just rewrote history.',
    //         body: "Okay, this news about archaeologists uncovering the remarkably preserved ruins of a previously unknown ancient city is absolutely incredible! Imagine finding something so significant that it literally challenges existing historical timelines and gives us new insights into a forgotten civilization. It makes you wonder what else is buried out there, waiting to be discovered, and how much we still don't know about our past."
    //     },
    //     {
    //         id: 14,
    //         heading: 'So glad to see this focus on youth mental health!',
    //         body: "Finally! Just read that the government is rolling out new initiatives to boost mental health support for young people, with more resources in schools and awareness campaigns. This is so incredibly important, especially with everything kids have been through recently. I really hope these plans are properly funded and reach every single person who needs help. It's a huge step in the right direction for destigmatizing mental illness early on."
    //     },
    //     {
    //         id: 15,
    //         heading: 'Heartbreaking to see all this extreme weather. Climate change is devastating.',
    //         body: "It's just heartbreaking to keep seeing all these reports about extreme weather events globally – record-breaking heatwaves, destructive floods, intense storms. So many people are losing their homes and livelihoods, and communities are being devastated. Climate scientists keep warning us, and it just really brings home the reality of climate change. It's so frustrating that we're not doing enough, fast enough, to address this crisis."
    //     }
    // ]

    // console.log(posts);

    await completeStep(id, "content-generation", true, posts);



    await startStep(id, "persona-routing");

    // posts = posts.map((p,i))
    const persona = posts.map((p) => {
        return {
            id: parseInt(Math.random() % 10 + 1)
        }
    })

    await completeStep(id, "persona-routing", true, persona);

    await startStep(id, "post-packing");

    const packedPost = posts.map((p, i) => {
        return {
            ...p,
            image: news_with_cat[p.id - 1]?.image,
            category: news_with_cat[p.id - 1]?.category.category,
            persona: persona[p.id - 1]?.id,
            predecence: news_with_cat[p.id - 1]?.predecence
        }
    })


    // console.log("final packed posts");
    console.log(packedPost);

    await completeStep(id, "post-packing", true, packedPost);



    await startStep(id, "social-db");

    const resDb = await addPosts2(packedPost);
    console.log(resDb);
    console.log("end");

    await completeStep(id, "social-db", true, resDb);

    await startStep(id, "social-complete");

    setTimeout(async () => {
        await completeStep(id, "social-complete", true, resDb);
    }, 1000);


}
async function rightTree(id) {
    await startStep(id, "important-news-feed")
}



async function start(id) {
    console.log("connected")
    await startStep(id, "news-scrapping");
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(200);
        }, 2000);
    });
    await completeStep(id, "news-scrapping");



    let news = [];

    await Promise.all(
        [new Promise(async (resolve, reject) => {
            startStep(id, "bbc-scraper");
            try {
                const resp = await fetch("https://news-scrapper-three.vercel.app/data/bbc");
                const jsonBbc = await resp.json();
                console.log(jsonBbc)
                news = [...news, ...jsonBbc];
                resolve(jsonBbc)
                completeStep(id, "bbc-scraper", true, JSON.stringify(jsonBbc, null, 2));
            } catch (error) {
                reject(error);
                errorStep(id, "bbc-scraper", false, JSON.stringify(error));
            }

        }),
        new Promise(async (resolve, reject) => {
            startStep(id, "ndtv-scraper");
            try {
                const resp = await fetch("https://news-scrapper-three.vercel.app/data/ndtv");
                const jsonNdtv = await resp.json();
                console.log(jsonNdtv)
                news = [...news, ...jsonNdtv];
                resolve(jsonNdtv)
                completeStep(id, "ndtv-scraper", true, JSON.stringify(jsonNdtv, null, 2));
            } catch (error) {
                reject(error);
                errorStep(id, "ndtv-scraper", false, JSON.stringify(error));

            }

        }),
        new Promise(async (resolve, reject) => {
            startStep(id, "thehindu-scraper");
            try {
                const resp = await fetch("https://news-scrapper-three.vercel.app/data/the_hindu");
                const jsonTheHindu = await resp.json();
                console.log(jsonTheHindu)
                news = [...news, ...jsonTheHindu];
                resolve(jsonTheHindu)
                completeStep(id, "thehindu-scraper", true, JSON.stringify(jsonTheHindu, null, 2));
            } catch (error) {
                reject(error);
                errorStep(id, "thehindu-scraper", false, JSON.stringify(error));

            }

        })]
    )

    await startStep(id, "news-aggregation")

    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    })

    await completeStep(id, "news-aggregation");
    // precedence-engine



    await startStep(id, "precedence-engine");


    const news_with_pred = await calcNewsPredecence(news);
    console.log(news_with_pred)
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(200);
        }, 1500);
    })

    await completeStep(id, "precedence-engine", true, JSON.stringify(news_with_pred, null, 2));


    // 

    await startStep(id, "vector-segregation");

    // await addNewsToDb(news_with_pred);
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(200);
        }, 1500);
    })

    await completeStep(id, "vector-segregation")

    await Promise.all([leftTree(id, news_with_pred), rightTree(id, news_with_pred)]);





}




app.get("/start", (req, res) => {
    console.log("started");
    start();
    res.send("started");
})
app.post("/start", express.text(), (req, res) => {
    console.log(req.body);
    const id = JSON.parse(req.body)?.id;
    if (id == undefined) {
        return res.send("no id present");
    }
    console.log(id);
    setTimeout(async () => {
        console.log("starting");
        start(id);
    }, 2000);
})
app.post("/save", express.text(), async (req, res) => {
    try {
        console.log(req.body);

        const { tab, logs } = JSON.parse(req.body);

        if (!tab?.id) {
            return res.status(400).send("no tab id present");
        }

        console.log("saving tab:", tab.id);

        await uploadWorkflow(tab, logs || []);

        res.send("tab saved successfully");

    } catch (err) {
        console.error("error saving tab:", err);
        res.status(500).send("error saving tab");
    }
});


// app.get("/", (req, res) => {
//     res.send("hello world")
// })

app.get("/one", (req, res) => {
    res.send("Hello World one")
})

app.get("/workflows",async (req,res)=>{
    const workflows = await getAllWorkflows();
    res.json(workflows);
})

io.on("connection", async (socket) => {



    // await completeStep("one","")

    // io.emit("connect");







})



// setInterval(() => {
//     io.emit("foo");
// }, 500);

// app.get("/", (req, res) => {
//     res.send(`
//         `)
// })


httpServer.listen(8080, () => {
    console.log("running");
});