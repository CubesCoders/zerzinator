/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "w1rlvydxfhtijhh",
    "created": "2024-04-10 17:37:34.964Z",
    "updated": "2024-04-10 17:37:34.964Z",
    "name": "animals",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fgpdvsix",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "epu3zahc",
        "name": "species",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Säugetier",
            "Vogel",
            "Reptil",
            "Amphib",
            "Fisch",
            "Gliedertier",
            "Weichtier oder Stachelhäuter"
          ]
        }
      },
      {
        "system": false,
        "id": "jj000ro7",
        "name": "type",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Wirbeltier",
            "Wirbellos"
          ]
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("w1rlvydxfhtijhh");

  return dao.deleteCollection(collection);
})
