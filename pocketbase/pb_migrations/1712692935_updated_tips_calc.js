/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sy7qmwz651firwr")

  collection.listRule = ""
  collection.viewRule = ""

  // remove
  collection.schema.removeField("oei9bzzl")

  // remove
  collection.schema.removeField("fqnhgne0")

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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sy7qmwz651firwr")

  collection.listRule = "@request.auth.id != \"\""
  collection.viewRule = "@request.auth.id != \"\""

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oei9bzzl",
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
    "id": "fqnhgne0",
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
  collection.schema.removeField("b5cbh0r8")

  // remove
  collection.schema.removeField("ghwp34cx")

  return dao.saveCollection(collection)
})
