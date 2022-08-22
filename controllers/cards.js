const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      next(new Error('Ошибка загрузки карточек.'));
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400);
        next(new Error('Переданы некорректные данные.'));
      } else {
        next(new Error('Ошибка создания карточки.'));
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;

  Card.findByIdAndRemove({ _id: cardId })
    .then((card) => {
      if (card.owner.toString() !== owner) {
        res.status(400);
        return next(new Error('Вы не можете удалить эту карточку.'));
      }

      return res.send(card);
    })
    .catch(() => {
      res.status(404);
      next(new Error('Карточка с указанным _id не найдена.'));
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404);
        return next(new Error('Передан несуществующий _id карточки.'));
      }
      return res.send(card);
    })
    .catch(() => {
      next(new Error('Ошибка удаления лайка.'));
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404);
        return next(new Error('Передан несуществующий _id карточки.'));
      }
      return res.send(card);
    })
    .catch(() => {
      next(new Error('Ошибка постановки лайка.'));
    });
};

module.exports = {
  getCards, createCard, deleteCard, dislikeCard, likeCard,
};
