import express from "express";
import routes from "../routes";
import {
  postAddCommnet,
  postRegisterView,
} from "../controllers/videoController";

const apiRouter = express.Router();

// db를 변경해야하면 post request여야함
apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddCommnet);

export default apiRouter;
