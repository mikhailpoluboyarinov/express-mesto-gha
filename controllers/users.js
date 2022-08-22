const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      next(new Error('Ошибка закгрузки пользователей.'));
    });
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404);
        return next(new Error('Пользователь по указанному _id не найден.'));
      }
      return res.send(user);
    })
    .catch(() => {
      next(new Error('Ошибка загрузки пользователя.'));
    });
};

const editUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (!user) {
        res.status(404);
        return next(new Error('Пользователь с указанным _id не найден.'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400);
        next(new Error('Переданы некорректные данные.'));
      } else {
        next(new Error('Ошибка.'));
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400);
        next(new Error('Переданы некорректные данные.'));
      }
      next(new Error('Ошибка создания пользователя.'));
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (!user) {
        res.status(404);
        return next(new Error('Пользователь с указанным _id не найден.'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400);
        next(new Error('Переданы некорректные данные.'));
      } else {
        next(new Error('Ошибка.'));
      }
    });
};

module.exports = {
  getUsers, getUser, editUser, createUser, updateAvatar,
};
