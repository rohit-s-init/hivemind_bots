// import mysql from "my"
import mysql from "mysql2/promise"



export function getGroupIdByName(groupName) {

    const groups = {
        EnergyPower: 120001,
        Crime: 120002,
        WorldNews: 120003,
        RegionalNews: 120004,
        Sports: 120005,
        BusinessCorporate: 120006,
        Entertainment: 120007,
        Infrastructure: 120008,
        Education: 120009,
        BankingFinance: 120010,
        EmploymentCareers: 120011,
        Economy: 120012,
        HealthMedicine: 120013,
        Politics: 120014,
        SpaceAstronomy: 120015,
        StockMarket: 120016,
        EnvironmentClimate: 120017,
        DefenceMilitary: 120018,
        LawJustice: 120019,
        GovernmentPolicy: 120020,
        RealEstate: 120021,
        Cybersecurity: 120022,
        Pharmaceuticals: 120023,
        Startups: 120024,
        InternationalRelations: 120025,
        Technology: 120026,
        ArtificialIntelligence: 120027
    };

    return groups[groupName] || null;

}


export default async function addPosts2(posts) {

    try {

        const connection = await mysql.createConnection({
            host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
            user: '2ALCrVvP4zHSppn.root',
            password: "0l4sBaxeqVPIRV52",
            database: "hivemind",
            ssl: {
                minVersion: "TLSv1.2",
                rejectUnauthorized: true
            }
        });

        const values = posts.map(post => {

            const userId = parseInt((Math.random() * 10) % 9 + 1);
            const groupId = parseInt((Math.random() * 10) % 28 + 1);

            const p = post.predecence || {};

            const body = post.body +"\n\n" + post.image?.split(" ").map(img=>{
                return `![image](${img})`;
            }).join("\n");

            return [

                // BASIC POST DATA
                post.heading,
                body,
                post.persona || userId,
                getGroupIdByName(p.category) || groupId,

                // VECTOR DATA
                p.EnergyPower || 0.0,
                p.Crime || 0.0,
                p.WorldNews || 0.0,
                p.RegionalNews || 0.0,
                p.Sports || 0.0,
                p.BusinessCorporate || 0.0,
                p.Entertainment || 0.0,
                p.Infrastructure || 0.0,
                p.Education || 0.0,
                p.BankingFinance || 0.0,
                p.EmploymentCareers || 0.0,
                p.Economy || 0.0,
                p.HealthMedicine || 0.0,
                p.Politics || 0.0,
                p.SpaceAstronomy || 0.0,
                p.StockMarket || 0.0,
                p.EnvironmentClimate || 0.0,
                p.DefenceMilitary || 0.0,
                p.LawJustice || 0.0,
                p.GovernmentPolicy || 0.0,
                p.RealEstate || 0.0,
                p.Cybersecurity || 0.0,
                p.Pharmaceuticals || 0.0,
                p.Startups || 0.0,
                p.InternationalRelations || 0.0,
                p.Technology || 0.0,
                p.ArtificialIntelligence || 0.0

            ];

        });

        const placeholders = values
            .map(() => `(
                ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )`)
            .join(",");

        const query = `
            INSERT INTO posts (

                title,
                content,
                user_id,
                group_id,

                EnergyPower,
                Crime,
                WorldNews,
                RegionalNews,
                Sports,
                BusinessCorporate,
                Entertainment,
                Infrastructure,
                Education,
                BankingFinance,
                EmploymentCareers,
                Economy,
                HealthMedicine,
                Politics,
                SpaceAstronomy,
                StockMarket,
                EnvironmentClimate,
                DefenceMilitary,
                LawJustice,
                GovernmentPolicy,
                RealEstate,
                Cybersecurity,
                Pharmaceuticals,
                Startups,
                InternationalRelations,
                Technology,
                ArtificialIntelligence

            )
            VALUES ${placeholders}
        `;

        const result = await connection.execute(
            query,
            values.flat()
        );

        console.log("data added successfully to the database");

        await connection.end();

        return result;

    }
    catch (err) {

        console.log(err);
        console.log("error in adding the database");

        return err;

    }

}