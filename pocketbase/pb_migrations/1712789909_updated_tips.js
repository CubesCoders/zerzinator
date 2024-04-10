/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6vqbh2v4vrbyeq")

  collection.updateRule = "@request.auth.id != user.id || @request.auth.role = \"admin\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6vqbh2v4vrbyeq")

  collection.updateRule = "@request.auth.id != \"\""

  return dao.saveCollection(collection)
})
