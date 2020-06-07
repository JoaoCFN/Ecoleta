import multer from "multer";
import path from "path";
// A crypto gera um hash aleatório de dados
import crypto from "crypto";

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, "..", "..", "uploads"),
        filename(request, file, callback){
            // GERA CARACTERES ALEATÓRIOS
            const hash = crypto.randomBytes(6).toString("hex");

            const fileName = `${hash}-${file.originalname}`;

            callback(null, fileName);
        }
    })
};