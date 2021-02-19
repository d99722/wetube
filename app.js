import express from "express"; // server
import morgan from "morgan"; // logger
import helmet from "helmet"; // security
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"; // get inform
import { userRouter } from "./router";

const app = express();

const handleHome = (req, res) => res.send("Hello from lee");
const handleProfile = (req, res) => res.send("You are on my profile");

app.use(cookieParser()); // 쿠키
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // 서버로부터 form 데이터를 받아옴
app.use(helmet()); // 보안 : good practice
app.use(morgan("dev")); // log 확인

app.get("/", handleHome);
app.get("/profile", handleProfile);
app.use("/user", userRouter);

export default app;
