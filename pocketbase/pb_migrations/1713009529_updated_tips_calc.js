/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sy7qmwz651firwr")

  collection.options = {
    "query": "SELECT a.id, a.name, COUNT(t.animal) as count, t.event FROM tips t JOIN animals a ON t.animal = a.id GROUP BY t.animal"
  }

  // remove
  collection.schema.removeField("adikdeky")

  // remove
  collection.schema.removeField("vwwozbje")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4b9hr9hj",
    "name": "name",
    "type": "text",
    "required": false,
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
    "id": "wltst4yi",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kd9z9bkr",
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
  const collection = dao.findCollectionByNameOrId("sy7qmwz651firwr")

  collection.options = {
    "query": "SELECT a.id, a.name, COUNT(t.animal) as count FROM tips t JOIN animals a ON t.animal = a.id GROUP BY t.animal"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "adikdeky",
    "name": "name",
    "type": "text",
    "required": false,
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
    "id": "vwwozbje",
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
  collection.schema.removeField("4b9hr9hj")

  // remove
  collection.schema.removeField("wltst4yi")

  // remove
  collection.schema.removeField("kd9z9bkr")

  return dao.saveCollection(collection)
})
