import express from "express";
import routes from "../routes";
import {
  postAddCommnet,
  postRegisterView,
  postRemoveComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

// db를 변경해야하면 post request여야함
apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddCommnet);
apiRouter.post(routes.removeComment, postRemoveComment);

export default apiRouter;
