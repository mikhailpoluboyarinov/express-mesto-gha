const express = require('express');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

async function dataBaseServer() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  /* console.log('Connected to db'); */

  await app.listen(PORT);
  /* console.log(`Server listen on ${PORT} port`); */
}

dataBaseServer();

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});
