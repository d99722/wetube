import "./db";
import app from "./app";
import dotenv from "dotenv";
import "./models/Video";
import "./models/Comment";
dotenv.config();
//dotenv : github에 개인정보를 숨기기 위함 -> dotenv.config, process.env.KEY, gitignore와 결합하여 사용

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`🔥 Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
