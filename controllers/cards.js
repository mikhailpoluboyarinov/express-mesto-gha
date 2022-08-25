const Card = require('../models/card');

const ERROR_DEFAULT_CODE = 500;
const ERROR_VALIDATION_CODE = 400;
const ERROR_NOT_FOUND_ERROR = 404;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(ERROR_DEFAULT_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION_CODE).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(ERROR_DEFAULT_CODE).send({ message: 'Ошибка создания карточки.' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove({ _id: cardId })
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION_CODE).send({ message: 'Передан некорректные Id.' });
      } else {
        res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка.' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION_CODE).send({ message: 'Передан некорректные Id.' });
      } else {
        res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка.' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION_CODE).send({ message: 'Передан некорректные Id.' });
      } else {
        res.status(ERROR_DEFAULT_CODE).send({ message: 'Произошла ошибка.' });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, dislikeCard, likeCard,
};
