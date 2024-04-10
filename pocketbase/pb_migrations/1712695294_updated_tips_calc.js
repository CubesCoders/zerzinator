/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sy7qmwz651firwr")

  collection.options = {
    "query": "SELECT id, tip, COUNT(tip) as count FROM tips GROUP BY tip"
  }

  // remove
  collection.schema.removeField("x16u3pyk")

  // remove
  collection.schema.removeField("owlzeo0g")

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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sy7qmwz651firwr")

  collection.options = {
    "query": "SELECT id, tip, SUM(tip) as count FROM tips GROUP BY tip"
  }

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

  // remove
  collection.schema.removeField("ensmpiaa")

  // remove
  collection.schema.removeField("dqmrjefi")

  return dao.saveCollection(collection)
})
