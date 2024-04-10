/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6vqbh2v4vrbyeq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "x8fe0ptr",
    "name": "animal",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "w1rlvydxfhtijhh",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6vqbh2v4vrbyeq")

  // remove
  collection.schema.removeField("x8fe0ptr")

  return dao.saveCollection(collection)
})
