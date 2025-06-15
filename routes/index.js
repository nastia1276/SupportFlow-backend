// routes/index

const express = require("express");
const router = express.Router();
const geocodeRoute = require("./geocode");

const authController = require("../controllers/auth.controller");
const requestController = require("../controllers/request.controller");
const commentController = require("../controllers/comment.controller");

const {
  authenticateUser,
  isRequester,
  isVolunteer,
} = require("../middlewares/auth.middleware");

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/profile", authenticateUser, authController.getProfile);
router.put("/auth/profile", authenticateUser, authController.updateProfile);

router.get("/categories", requestController.getCategories);

router.post(
  "/requests",
  authenticateUser,
  isRequester,
  requestController.createRequest
);
router.get("/requests", requestController.getRequests);
router.get("/requests/:id", requestController.getRequestById);
router.put(
  "/requests/:id",
  authenticateUser,
  isRequester,
  requestController.updateRequest
);
router.put(
  "/requests/:id/assign",
  authenticateUser,
  isVolunteer,
  requestController.assignVolunteer
);
router.put(
  "/requests/:id/status",
  authenticateUser,
  requestController.updateRequestStatus
);
router.get(
  "/myrequests",
  authenticateUser,
  isRequester,
  requestController.getMyRequests
);
router.get(
  "/assignedrequests",
  authenticateUser,
  isVolunteer,
  requestController.getAssignedRequests
);

router.post(
  "/requests/:request_id/comments",
  authenticateUser,
  commentController.addComment
);
router.get("/requests/:request_id/comments", commentController.getComments);

router.use("/geocode", geocodeRoute);

module.exports = router;
