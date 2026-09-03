    // console.log("client connected");
    //         runWorkflow("one");
    // setInterval(()=>{
    //     runWorkflow("one");
    // },60000);
    //     await runStep("one", "cron");


    //     startStep("one", "search");
    //     let searchOutput;
    //     let jsonSearchOutput;
    //     try {
    //         searchOutput = await fetch("https://news-scrapper-three.vercel.app/data");
    //         jsonSearchOutput = await searchOutput.json();
    //         completeStep("one", "search", true, new Date().toLocaleString() + " > " + JSON.stringify(jsonSearchOutput, null, 2));
    //     } catch (error) {
    //         console.log(error);
    //         errorStep("one", "search", false, `${new Date().toLocaleString()}
    //  > ${error.message}
    // ${error.name}
    // ${error.stack}`);
    //         return;
    //     }

    //     startStep("one", "scraping");
    //     const newsRatings = await new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve(new Array(15).map(() => {
    //                 return {
    //                     "cat1": 0,
    //                     "cat2": 0,
    //                     "cat3": 0,
    //                     "cat4": 0,
    //                     "cat5": 0,
    //                     "cat6": 0,
    //                     "cat7": 0,
    //                     "cat8": 0,
    //                 }
    //             }))
    //         }, 2000);
    //     });
    //     completeStep("one", "scraping");



    //     startStep("one","gemini");
    //     startStep("one","");
    //     let aiGeneratedPosts = [];
    //     try {
    //         if (IS_DEV) {
    //             aiGeneratedPosts = temp_gemini_data;
    //         }
    //         else {
    //             aiGeneratedPosts = await newsToPosts(JSON.stringify(jsonSearchOutput));
    //         }


    //     } catch (error) {

    //     }