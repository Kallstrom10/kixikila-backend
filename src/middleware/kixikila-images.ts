import multer from "fastify-multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("../../../uploads/")); // Pasta "uploads"
  },
  filename: (req, file, cb) => {
    const reqBody = req.body as {
      telefone?: string;
      nome_completo?: string;
    };

    const userTelefone = reqBody.telefone || "telefone-nao-informado";
    const userNomeCompleto = reqBody.nome_completo || "nome-nao-informado";
    const dataAtual = new Date().toISOString().replace(/[:.-]/g, "");
    const fileExtension = path.extname(file.originalname);

    let filename = "";

    switch (file.fieldname) {
      case "imagem_perfil":
        filename = `selfie-${userTelefone}-${userNomeCompleto}-${dataAtual}${fileExtension}`;
        break;
      case "imagem_bi_frente":
        filename = `bilhete-frente-${userTelefone}-${userNomeCompleto}-${dataAtual}${fileExtension}`;
        break;
      case "imagem_bi_verso":
        filename = `bilhete-traseira-${userTelefone}-${userNomeCompleto}-${dataAtual}${fileExtension}`;
        break;
      default:
        filename = `arquivo-${dataAtual}${fileExtension}`;
        break;
    }

    cb(null, filename);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos JPG, JPEG e PNG são permitidos."));
    }
  },
}).fields([
  { name: "imagem_perfil", maxCount: 1 },
  { name: "imagem_bi_frente", maxCount: 1 },
  { name: "imagem_bi_verso", maxCount: 1 },
]);
