import dotenv from "dotenv";
import "./db";
import app from "./app";

//dotenv : github에 개인정보를 숨기기 위함 -> dotenv.config, process.env.KEY, gitignore와 결합하여 사용
dotenv.config();

import "./models/Video";
import "./models/Comment";
import "./models/User";

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`🔥 Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
