const User = require('../models/user');

const ERROR_DEFAULT_CODE = 500;
const ERROR_VALIDATION_CODE = 400;
const ERROR_NOT_FOUND_ERROR = 404;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(ERROR_DEFAULT_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION_CODE).send({ message: 'Передан некорректные Id.' });
      } else {
        res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка.' });
      }
    });
};

const editUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION_CODE).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка.' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION_CODE).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка.' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION_CODE).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка.' });
      }
    });
};

module.exports = {
  getUsers, getUser, editUser, createUser, updateAvatar,
};
