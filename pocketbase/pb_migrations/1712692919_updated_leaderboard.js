/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9tgm7n047e31jeq")

  collection.listRule = ""
  collection.viewRule = ""

  // remove
  collection.schema.removeField("fghv6dwl")

  // remove
  collection.schema.removeField("gfpkvkbt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "93ys9fpl",
    "name": "points",
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
    "id": "wu73w20d",
    "name": "username",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9tgm7n047e31jeq")

  collection.listRule = null
  collection.viewRule = null

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fghv6dwl",
    "name": "points",
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
    "id": "gfpkvkbt",
    "name": "username",
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

  // remove
  collection.schema.removeField("93ys9fpl")

  // remove
  collection.schema.removeField("wu73w20d")

  return dao.saveCollection(collection)
})
