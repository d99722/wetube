import express from "express"; // server
import morgan from "morgan"; // logger
import helmet from "helmet"; // security
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"; // get inform
import { localsMiddleware } from "./middlewares"; // alpabet order
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";
const app = express();

// app.use(helmet()); // 보안 : good practice
app.use(helmet({ contentSecurityPolicy: false })); // video 예제 위한 임시코드
app.set("view engine", "pug");
app.use(cookieParser()); // 쿠키전달받음 - 유저 인증
app.use(bodyParser.json()); // 사용자가 웹사이트로 전달하는 정보들을 검사
app.use(bodyParser.urlencoded({ extended: true })); // 서버로부터 form 데이터를 받아옴
// bodyParser를 통해 join 등의 상황에서 사용자의 입력을 처리 가능함
app.use(morgan("dev")); // log 확인

app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;
