/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6vqbh2v4vrbyeq")

  // remove
  collection.schema.removeField("zpdayof1")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6vqbh2v4vrbyeq")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
