/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "djbuw7ic2othqac",
    "created": "2024-04-10 18:33:30.098Z",
    "updated": "2024-04-10 18:33:30.098Z",
    "name": "events",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "un9g47ce",
        "name": "start",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "mymcsbac",
        "name": "end",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
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
  const collection = dao.findCollectionByNameOrId("djbuw7ic2othqac");

  return dao.deleteCollection(collection);
})
