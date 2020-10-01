DB_PASSWORD=SET_YOUR NODE_ENV=test npx sequelize db:migrate
DB_PASSWORD=SET_YOUR NODE_ENV=test npx sequelize db:seed:undo:all
DB_PASSWORD=SET_YOUR NODE_ENV=test npx sequelize db:seed:all
DB_PASSWORD=SET_YOUR NODE_ENV=test mocha --exit