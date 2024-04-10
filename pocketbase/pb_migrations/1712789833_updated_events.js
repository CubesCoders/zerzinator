/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("djbuw7ic2othqac")

  collection.updateRule = "@request.auth.role = \"admin\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("djbuw7ic2othqac")

  collection.updateRule = null

  return dao.saveCollection(collection)
})
