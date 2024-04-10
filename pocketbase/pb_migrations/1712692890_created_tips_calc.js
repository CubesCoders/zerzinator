/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "sy7qmwz651firwr",
    "created": "2024-04-09 20:01:30.438Z",
    "updated": "2024-04-09 20:01:30.438Z",
    "name": "tips_calc",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "epd8ziy8",
        "name": "tip",
        "type": "text",
        "required": true,
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
        "id": "tmib1wdj",
        "name": "count",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT id, tip, SUM(tip) as count FROM tips"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("sy7qmwz651firwr");

  return dao.deleteCollection(collection);
})
