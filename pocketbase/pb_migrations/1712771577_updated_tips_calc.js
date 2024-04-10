/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sy7qmwz651firwr")

  collection.options = {
    "query": "SELECT id, animal, COUNT(animal) as count FROM tips GROUP BY animal"
  }

  // remove
  collection.schema.removeField("ensmpiaa")

  // remove
  collection.schema.removeField("dqmrjefi")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cflc27lc",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lzi19phb",
    "name": "count",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sy7qmwz651firwr")

  collection.options = {
    "query": "SELECT id, tip, COUNT(tip) as count FROM tips GROUP BY tip"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ensmpiaa",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dqmrjefi",
    "name": "count",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // remove
  collection.schema.removeField("cflc27lc")

  // remove
  collection.schema.removeField("lzi19phb")

  return dao.saveCollection(collection)
})
