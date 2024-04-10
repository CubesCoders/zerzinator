/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sy7qmwz651firwr")

  collection.options = {
    "query": "SELECT id, tip, SUM(tip) as count FROM tips GROUP BY tip"
  }

  // remove
  collection.schema.removeField("b5cbh0r8")

  // remove
  collection.schema.removeField("ghwp34cx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "x16u3pyk",
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
    "id": "owlzeo0g",
    "name": "count",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sy7qmwz651firwr")

  collection.options = {
    "query": "SELECT id, tip, SUM(tip) as count FROM tips"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "b5cbh0r8",
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
    "id": "ghwp34cx",
    "name": "count",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  // remove
  collection.schema.removeField("x16u3pyk")

  // remove
  collection.schema.removeField("owlzeo0g")

  return dao.saveCollection(collection)
})
