/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6vqbh2v4vrbyeq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qfwremmt",
    "name": "event",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "djbuw7ic2othqac",
      "cascadeDelete": false,
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
  collection.schema.removeField("qfwremmt")

  return dao.saveCollection(collection)
})
