import { Router } from "https://deno.land/x/oak/mod.ts";
import { uploadAndRecognizeCard } from "../controllers/uploadController.ts";    

const uploadrouter = new Router();
uploadrouter.post("/api/cards/upload", uploadAndRecognizeCard);

export default uploadrouter;