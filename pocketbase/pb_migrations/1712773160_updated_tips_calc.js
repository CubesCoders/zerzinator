/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sy7qmwz651firwr")

  collection.options = {
    "query": "SELECT a.id, a.name, COUNT(t.animal) as count FROM tips t JOIN animals a ON t.animal = a.id GROUP BY t.animal"
  }

  // remove
  collection.schema.removeField("phu8podh")

  // remove
  collection.schema.removeField("cunqjenj")

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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sy7qmwz651firwr")

  collection.options = {
    "query": "SELECT t.id, a.name, COUNT(t.animal) as count FROM tips t JOIN animals a ON t.animal = a.id GROUP BY t.animal"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "phu8podh",
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
    "id": "cunqjenj",
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
  collection.schema.removeField("adikdeky")

  // remove
  collection.schema.removeField("vwwozbje")

  return dao.saveCollection(collection)
})
