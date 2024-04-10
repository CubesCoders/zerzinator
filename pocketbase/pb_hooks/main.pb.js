/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
$app.rootCmd.addCommand(new Command({
    use: "import-animals",
    run: (cmd, args) => {
        // read the path to the json file from the arguments list
        // aka. require("/path/to/data.json")
        const rawData = require(args[0]);

        const collection = $app.dao().findCollectionByNameOrId("animals");

        $app.dao().runInTransaction((txDao) => {
            for (let species of Object.keys(rawData)) {
                for (let animal of rawData[species]) {
                    const record = new Record(collection, {
                        name: animal,
                        species: species,
                        type: (species === "Gliedertier" || species === "Weichtier oder Stachelhäuter") ? "Wirbellos" : "Wirbeltier",
                    });

                    txDao.saveRecord(record);
                }
            }
        });
    },
}));

$app.rootCmd.addCommand(new Command({
    use: "import-events",
    run: (cmd, args) => {
        // read the path to the json file from the arguments list
        // aka. require("/path/to/data.json")
        const rawData = require(args[0]);

        const collection = $app.dao().findCollectionByNameOrId("events");

        $app.dao().runInTransaction((txDao) => {
            for (let event of rawData) {
                    const record = new Record(collection, event);

                    txDao.saveRecord(record);
            }
        });
    },
}));