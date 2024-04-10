/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("djbuw7ic2othqac")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jt6eqpka",
    "name": "animal",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "w1rlvydxfhtijhh",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("djbuw7ic2othqac")

  // remove
  collection.schema.removeField("jt6eqpka")

  return dao.saveCollection(collection)
})
