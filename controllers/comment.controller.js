// controllers/comment.controller

const CommentModel = require("../models/comment.model");
const RequestModel = require("../models/request.model");
const { notifyUser } = require("../telegramBot");
const db = require("../config/db");

exports.addComment = async (req, res) => {
  try {
    const { request_id } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Текст коментаря не може бути порожнім",
      });
    }

    const existingRequest = await RequestModel.getRequestById(request_id);
    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        message: "Запит не знайдено",
      });
    }

    if (
      (req.user.role === "requester" &&
        existingRequest.requester_id !== req.user.id) ||
      (req.user.role === "volunteer" &&
        existingRequest.volunteer_id !== req.user.id &&
        existingRequest.status !== "Очікує на виконавця")
    ) {
      return res.status(403).json({
        success: false,
        message: "Ви не маєте дозволу додавати коментарі до цього запиту",
      });
    }

    if (req.user.role === "volunteer") {
      const isAssigned = existingRequest.volunteer_id === req.user.id;
      const isInProgress = existingRequest.status === "В роботі";

      if (!isAssigned && !isInProgress) {
        return res.status(403).json({
          success: false,
          message: "Ви не маєте дозволу додавати коментарі до цього запиту",
        });
      }
    }

    const commentId = await CommentModel.createComment({
      request_id,
      user_id: req.user.id,
      text,
    });

    const comments = await CommentModel.getCommentsByRequestId(request_id);

    if (req.user.role === "volunteer" && existingRequest.requester_id) {
      const [userRow] = await db.query(
        "SELECT telegram_id FROM users WHERE id=?",
        [existingRequest.requester_id]
      );
      if (userRow && userRow[0] && userRow[0].telegram_id) {
        await notifyUser(
          userRow[0].telegram_id,
          `Новий коментар до вашого замовлення "${existingRequest.title}":\n${text}`
        );
      }
    }

    if (req.user.role === "requester" && existingRequest.volunteer_id) {
      const [volRow] = await db.query(
        "SELECT telegram_id FROM users WHERE id=?",
        [existingRequest.volunteer_id]
      );
      if (volRow && volRow[0] && volRow[0].telegram_id) {
        await notifyUser(
          volRow[0].telegram_id,
          `Замовник залишив новий коментар до вашого замовлення "${existingRequest.title}":\n${text}`
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Коментар успішно додано",
      comments,
    });
  } catch (error) {
    console.error("Error in add comment API:", error);
    res.status(500).json({
      success: false,
      message: "Помилка при додаванні коментаря",
      error: error.message,
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { request_id } = req.params;

    const existingRequest = await RequestModel.getRequestById(request_id);
    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        message: "Запит не знайдено",
      });
    }

    const comments = await CommentModel.getCommentsByRequestId(request_id);

    res.status(200).json({
      success: true,
      message: "Коментарі до запиту",
      comments,
    });
  } catch (error) {
    console.error("Error in get comments API:", error);
    res.status(500).json({
      success: false,
      message: "Помилка при отриманні коментарів",
      error: error.message,
    });
  }
};
