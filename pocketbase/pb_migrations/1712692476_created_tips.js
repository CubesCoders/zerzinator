/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "w6vqbh2v4vrbyeq",
    "created": "2024-04-09 19:54:36.776Z",
    "updated": "2024-04-09 19:54:36.776Z",
    "name": "tips",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "zpdayof1",
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
        "id": "81uh2bjd",
        "name": "user",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
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
  const collection = dao.findCollectionByNameOrId("w6vqbh2v4vrbyeq");

  return dao.deleteCollection(collection);
})
