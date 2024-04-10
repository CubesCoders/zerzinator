/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "9tgm7n047e31jeq",
    "created": "2024-04-09 19:58:33.689Z",
    "updated": "2024-04-09 19:58:33.689Z",
    "name": "leaderboard",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fghv6dwl",
        "name": "points",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "gfpkvkbt",
        "name": "username",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
      "query": "SELECT id, points, username FROM users"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9tgm7n047e31jeq");

  return dao.deleteCollection(collection);
})
