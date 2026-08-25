import { useCallback, useEffect, useRef, useState } from "react";

export default function useTabs() {
    const sampleTab = {
        id: "one",
        // map: [
        //     {
        //         id: "cron",
        //         name: "Scheduled Cron Trigger",
        //         iconId: "cron",
        //         x: 430,
        //         y: 20,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Temporal daemon scheduler heartbeat trigger",
        //         status: "inactive"
        //     },
        //     {
        //         id: "search",
        //         name: "Brave News Search",
        //         iconId: "search",
        //         x: 430,
        //         y: 130,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Brave search API integration index crawl",
        //         status: "inactive"
        //     },
        //     {
        //         id: "scraping",
        //         name: "Feed Collector & Scraper",
        //         iconId: "scraping",
        //         x: 430,
        //         y: 240,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Pull matching RSS and article source payload data",
        //         status: "inactive"
        //     },
        //     {
        //         id: "gemini",
        //         name: "Gemini AI Core Engine",
        //         iconId: "gemini",
        //         x: 210,
        //         y: 360,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Multimodal Gemini intelligence reasoner model",
        //         status: "inactive"
        //     },
        //     {
        //         id: "reschedule-5m",
        //         name: "Reschedule After 5 Min",
        //         iconId: "reschedule-5m",
        //         x: 10,
        //         y: 430,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Standby scheduling task to retry active engine request on error",
        //         status: "inactive"
        //     },
        //     {
        //         id: "posts-generated",
        //         name: "Social Content Synthesizer",
        //         iconId: "posts-generated",
        //         x: 210,
        //         y: 480,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Prepares raw social post variance templates",
        //         status: "inactive"
        //     },
        //     {
        //         id: "assign-user",
        //         name: "Target Profile Allocation",
        //         iconId: "assign-user",
        //         x: 210,
        //         y: 600,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Assigns matching profiles for output channels",
        //         status: "inactive"
        //     },
        //     {
        //         id: "assign-group",
        //         name: "Audience Target Routing",
        //         iconId: "assign-group",
        //         x: 210,
        //         y: 720,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Determines niche segment audiences and groups",
        //         status: "inactive"
        //     },
        //     {
        //         id: "db-insert",
        //         name: "Database SQL Insertion",
        //         iconId: "db-insert",
        //         x: 210,
        //         y: 840,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Atomically stores transaction records in database",
        //         status: "inactive"
        //     },
        //     {
        //         id: "branch-a-success",
        //         name: "Social Workflow Complete",
        //         iconId: "branch-a-success",
        //         x: 210,
        //         y: 960,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Success checkpoint for social channels ingestion loop",
        //         status: "inactive"
        //     },
        //     {
        //         id: "precedence-determination",
        //         name: "Precedence Determination Block",
        //         iconId: "precedence-determination",
        //         x: 610,
        //         y: 360,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Scores news items based on immediate priority",
        //         status: "inactive"
        //     },
        //     {
        //         id: "no-important-terminate",
        //         name: "No Important News Terminate",
        //         iconId: "no-important-terminate",
        //         x: 820,
        //         y: 430,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Gracefully shutdown thread if news priority score is lower than threshold"
        //         , status: "inactive"
        //     },
        //     {
        //         id: "sorting",
        //         name: "News Sorting Block",
        //         iconId: "sorting",
        //         x: 610,
        //         y: 480,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Filter & sort news with priority score > 9.0",
        //         status: "inactive"
        //     },
        //     {
        //         id: "whatsapp-generation",
        //         name: "WhatsApp Message Generator",
        //         iconId: "whatsapp-generation",
        //         x: 610,
        //         y: 600,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Synthesizes urgent formatted brief broadcast template",
        //         status: "inactive"
        //     },
        //     {
        //         id: "add-important-news-app",
        //         name: "Add to Important News App",
        //         iconId: "add-important-news-app",
        //         x: 610,
        //         y: 720,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Publishes selected items to executive hot-list board",

        //     },
        //     {
        //         id: "branch-b-success",
        //         name: "Important News Complete",
        //         iconId: "branch-b-success",
        //         x: 610,
        //         y: 840,
        //         sourcePosition: "bottom",
        //         targetPosition: "top",
        //         description: "Success checkpoint for elite priority intelligence broadcast loop",
        //         status: "inactive"
        //     }
        // ],
        // edges: [
        //     { from: "cron", fromPort: "bottom", to: "search", toPort: "top" },
        //     { from: "search", fromPort: "bottom", to: "scraping", toPort: "top" },
        //     // Branch A
        //     { from: "scraping", fromPort: "bottom", to: "gemini", toPort: "top" },
        //     { from: "gemini", fromPort: "bottom", to: "posts-generated", toPort: "top" },
        //     { from: "gemini", fromPort: "left", to: "reschedule-5m", toPort: "top" },
        //     { from: "posts-generated", fromPort: "bottom", to: "assign-user", toPort: "top" },
        //     { from: "assign-user", fromPort: "bottom", to: "assign-group", toPort: "top" },
        //     { from: "assign-group", fromPort: "bottom", to: "db-insert", toPort: "top" },
        //     { from: "db-insert", fromPort: "bottom", to: "branch-a-success", toPort: "top" },
        //     // Branch B
        //     { from: "scraping", fromPort: "bottom", to: "precedence-determination", toPort: "top" },
        //     { from: "precedence-determination", fromPort: "bottom", to: "sorting", toPort: "top" },
        //     { from: "precedence-determination", fromPort: "right", to: "no-important-terminate", toPort: "top" },
        //     { from: "sorting", fromPort: "bottom", to: "whatsapp-generation", toPort: "top" },
        //     { from: "whatsapp-generation", fromPort: "bottom", to: "add-important-news-app", toPort: "top" },
        //     { from: "add-important-news-app", fromPort: "bottom", to: "branch-b-success", toPort: "top" }
        // ]

        map: [
            {
                id: "cron-trigger",
                name: "Scheduled Cron Trigger",
                iconId: "cron",
                x: 500,
                y: -140,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Timed scheduler heartbeat event for automated workflow activation",
                status: "active"
            },

            {
                id: "wake-master",
                name: "Wake Master VM",
                iconId: "server",
                x: 500,
                y: -10,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Activates sleeping orchestration VM and initializes workflow lifecycle",
                status: "completed"
            },
            {
                id: "news-scrapping",
                name: "newsscrapping",
                iconId: "cron",
                x: 500,
                y: 120,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Timed scheduler heartbeat event for automated workflow activation",
                status: "inactive"
            },

            {
                id: "bbc-scraper",
                name: "BBC Feed Scraper",
                iconId: "scraping",
                x: 80,
                y: 280,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Collects and parses BBC news feed articles and metadata",
                status: "inactive"
            },

            {
                id: "ndtv-scraper",
                name: "NDTV Feed Scraper",
                iconId: "scraping",
                x: 500,
                y: 280,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Collects and parses NDTV news feed articles and metadata",
                status: "inactive"
            },

            {
                id: "thehindu-scraper",
                name: "The Hindu Feed Scraper",
                iconId: "scraping",
                x: 920,
                y: 280,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Collects and parses The Hindu news feed articles and metadata",
                status: "inactive"
            },

            {
                id: "news-aggregation",
                name: "News Aggregation Engine",
                iconId: "aggregation",
                x: 500,
                y: 470,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Merges all distributed scraper outputs into unified normalized JSON payload",
                status: "inactive"
            },

            {
                id: "precedence-engine",
                name: "Precedence Detection Engine",
                iconId: "precedence",
                x: 500,
                y: 620,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Analyzes urgency, importance and semantic relevance of incoming news",
                status: "inactive"
            },

            {
                id: "vector-segregation",
                name: "Vector Segregation and add news db",
                iconId: "vector",
                x: 500,
                y: 770,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Routes articles into semantic vectors for downstream processing pipelines",
                status: "inactive"
            },

            // LEFT BRANCH

            {
                id: "category-ai",
                name: "Category Classification AI",
                iconId: "ai-category",
                x: 180,
                y: 980,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Classifies articles into 30 semantic audience categories",
                status: "inactive"
            },

            {
                id: "content-generation",
                name: "AI Content Generation",
                iconId: "content-ai",
                x: 180,
                y: 1130,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Generates adaptive social content variants from classified articles",
                status: "inactive"
            },

            {
                id: "persona-routing",
                name: "Agent Personality Selector",
                iconId: "persona-routing",
                x: 180,
                y: 1280,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Selects optimal publishing persona using vector similarity matching",
                status: "inactive"
            },

            {
                id: "post-packing",
                name: "Post Packaging Engine",
                iconId: "packing",
                x: 180,
                y: 1430,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Combines generated text, metadata and persona payload into publishable structure",
                status: "inactive"
            },

            {
                id: "social-db",
                name: "Social Database Insert",
                iconId: "db-insert",
                x: 180,
                y: 1580,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Persists generated social content into distributed storage system",
                status: "inactive"
            },

            {
                id: "social-complete",
                name: "Social Pipeline Complete",
                iconId: "success",
                x: 180,
                y: 1730,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Successful completion checkpoint for social intelligence workflow",
                status: "inactive"
            },

            // RIGHT BRANCH

            {
                id: "important-news-feed",
                name: "Important News Feed",
                iconId: "important-feed",
                x: 820,
                y: 980,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Filters high-priority articles for direct important-news distribution",
                status: "inactive"
            },

            {
                id: "news-app-publish",
                name: "News Application Publisher",
                iconId: "news-app",
                x: 820,
                y: 1130,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Publishes important news articles into realtime executive news application",
                status: "inactive"
            },

            {
                id: "important-complete",
                name: "Important News Complete",
                iconId: "success",
                x: 820,
                y: 1280,
                sourcePosition: "bottom",
                targetPosition: "top",
                description: "Successful completion checkpoint for priority news delivery pipeline",
                status: "inactive"
            }
        ],

        edges: [

            // CORE FLOW

            {
                from: "cron-trigger",
                fromPort: "bottom",
                to: "wake-master",
                toPort: "top"
            },
            {
                from: "wake-master",
                fromPort: "bottom",
                to: "news-scrapping",
                toPort: "top"
            },

            // PARALLEL SCRAPERS

            {
                from: "news-scrapping",
                fromPort: "bottom",
                to: "bbc-scraper",
                toPort: "top"
            },

            {
                from: "news-scrapping",
                fromPort: "bottom",
                to: "ndtv-scraper",
                toPort: "top"
            },

            {
                from: "news-scrapping",
                fromPort: "bottom",
                to: "thehindu-scraper",
                toPort: "top"
            },

            // AGGREGATION

            {
                from: "bbc-scraper",
                fromPort: "bottom",
                to: "news-aggregation",
                toPort: "top"
            },

            {
                from: "ndtv-scraper",
                fromPort: "bottom",
                to: "news-aggregation",
                toPort: "top"
            },

            {
                from: "thehindu-scraper",
                fromPort: "bottom",
                to: "news-aggregation",
                toPort: "top"
            },

            // INTELLIGENCE LAYER

            {
                from: "news-aggregation",
                fromPort: "bottom",
                to: "precedence-engine",
                toPort: "top"
            },

            {
                from: "precedence-engine",
                fromPort: "bottom",
                to: "vector-segregation",
                toPort: "top"
            },

            // LEFT PIPELINE

            {
                from: "vector-segregation",
                fromPort: "left",
                to: "category-ai",
                toPort: "top"
            },

            {
                from: "category-ai",
                fromPort: "bottom",
                to: "content-generation",
                toPort: "top"
            },

            {
                from: "content-generation",
                fromPort: "bottom",
                to: "persona-routing",
                toPort: "top"
            },

            {
                from: "persona-routing",
                fromPort: "bottom",
                to: "post-packing",
                toPort: "top"
            },

            {
                from: "post-packing",
                fromPort: "bottom",
                to: "social-db",
                toPort: "top"
            },

            {
                from: "social-db",
                fromPort: "bottom",
                to: "social-complete",
                toPort: "top"
            },

            // RIGHT PIPELINE

            {
                from: "vector-segregation",
                fromPort: "right",
                to: "important-news-feed",
                toPort: "top"
            },

            {
                from: "important-news-feed",
                fromPort: "bottom",
                to: "news-app-publish",
                toPort: "top"
            },

            {
                from: "news-app-publish",
                fromPort: "bottom",
                to: "important-complete",
                toPort: "top"
            }

        ]


    }
    const [tabs, setTabs] = useState({});
    const [activeTab, setActiveTab] = useState(null);
    const tabsRef = useRef(tabs);
    const activeTabRef = useRef(activeTab);

    const createTab = () => {

        let fetched = JSON.parse(JSON.stringify(sampleTab));
        fetched.id = Date.now();

        setTabs((prev) => {
            let data = JSON.parse(JSON.stringify(prev));
            if (data == undefined) {
                data = {};
            }
            data[fetched.id] = fetched;
            return data;
        });

        setActiveTab(fetched);

        return fetched.id;
    };
    let startState = useCallback((id, state) => {
        console.log("tabs id is ");
        console.log(id);
        console.log(tabsRef.current);
        console.log(tabsRef.current[id]);
        // if (!tabs[id]) return;
        setTabs((prev) => {
            let data = JSON.parse(JSON.stringify(prev));
            console.log(prev[id])
            data[id].map.find(edge => (edge.id == state)).status = "active";
            return data;
        })
    }, []);
    let completeState = useCallback((id, state) => {
        // if (!tabs[id]) return;
        setTabs((prev) => {
            let data = JSON.parse(JSON.stringify(prev));
            data[id].map.find(edge => (edge.id == state)).status = "completed";
            return data;
        })
    }, []);
    let errorState = useCallback((id, state) => {
        // if (!tabs[id]) return;
        setTabs((prev) => {
            let data = JSON.parse(JSON.stringify(prev));
            data[id].map.find(edge => (edge.id == state)).status = "error";
            return data;
        })
    }, []);
    let updateActiveTab = (id) => {
        const tempTab = tabs[id];
        if (tempTab == null) {
            console.log("no such tab exist");
            return;
        }
        setActiveTab(JSON.parse(JSON.stringify(tempTab)));
    }
    useEffect(() => {
        console.log("active tab is ");
        console.log(activeTab);
        console.log("tabs is ");
        console.log(tabs);
        if (activeTab) {
            updateActiveTab(activeTab.id)
        }

        tabsRef.current = tabs;
    }, [tabs]);

    useEffect(() => {
        activeTabRef.current = activeTab;
        console.log("active tab is ");
        console.log(activeTab);
    }, [activeTab]);

    useEffect(() => {
        const loadWorkflows = async () => {
            try {
                const response = await fetch("/workflows");

                if (!response.ok) {
                    throw new Error(`Failed to fetch workflows: ${response.status}`);
                }

                const workflows = await response.json();

                const loadedTabs = {};

                workflows.forEach((workflow) => {
                    loadedTabs[workflow.id] = {
                        ...workflow.tab,
                        logs: workflow.logs
                    };
                });

                console.log("fetched worflows are ");
                console.log(loadedTabs);

                setTabs((prev)=>{
                    return {...loadedTabs}
                });

                // Select the first workflow
                if (workflows.length > 0) {
                    setActiveTab({
                        ...workflows[0].tab,
                        logs: workflows[0].logs
                    });
                }

            } catch (error) {
                console.error("Error loading workflows:", error);
            }
        };

        loadWorkflows();
    }, []);






    return {
        tabsRef, tabs, createTab, activeTab, updateActiveTab, startState, completeState, errorState
    }

}