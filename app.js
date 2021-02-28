import express from "express"; // server
import morgan from "morgan"; // logger
import helmet from "helmet"; // security
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"; // get inform
import passport from "passport"; // user authentication
import mongoose from "mongoose";
import session from "express-session"; // session 생성
import MongoStore from "connect-mongo"; // session 정보 저장
import { localsMiddleware } from "./middlewares"; // alpabet order
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRouter";
import routes from "./routes";

import "./passport";

const app = express();

const CookieStore = MongoStore(session);

// app.use(helmet()); // 보안 : good practice
app.use(helmet({ contentSecurityPolicy: false })); // video 예제 위한 임시코드
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));
app.use(cookieParser()); // 쿠키전달받음 - 유저 인증
app.use(bodyParser.json()); // 사용자가 웹사이트로 전달하는 정보들을 검사
app.use(bodyParser.urlencoded({ extended: true })); // 서버로부터 form 데이터를 받아옴
// bodyParser를 통해 join 등의 상황에서 사용자의 입력을 처리 가능함
app.use(morgan("dev")); // log 확인
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CookieStore({ mongooseConnection: mongoose.connection }),
  })
); // session을 통해 쿠키로 유저 정보 확인이 가능하다.
// 쿠키는 express로 보내짐
app.use(passport.initialize());
app.use(passport.session()); // session을 통해 passport를 진행
// 이후 middleware를 통해 아무데서나 그 유저에 대한 접근이 가능하다.

app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

export default app;
