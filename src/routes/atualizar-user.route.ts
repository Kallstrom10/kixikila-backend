import { FastifyInstance } from "fastify";
import { Multipart, MultipartFile } from "@fastify/multipart";
import { atualizarUsuarioService } from "../services/user/atualizar-user";
import fs from "fs";
import path from "path";

const timeZone = "Africa/Luanda";

function ajustarFusoHorario(date: Date, timeZone: string): Date {
  const formatter = new Intl.DateTimeFormat("pt-PT", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedParts = formatter.formatToParts(date);
  const [year, month, day, hour, minute, second] = [
    formattedParts.find((part) => part.type === "year")?.value,
    formattedParts.find((part) => part.type === "month")?.value,
    formattedParts.find((part) => part.type === "day")?.value,
    formattedParts.find((part) => part.type === "hour")?.value,
    formattedParts.find((part) => part.type === "minute")?.value,
    formattedParts.find((part) => part.type === "second")?.value,
  ];

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
}

export async function atualizarUser(app: FastifyInstance) {
  // Adiciona tipagem para os parâmetros da rota
  app.patch<{ Params: { id: string } }>(
    "/atualizar-usuario/:id",
    async (req, res) => {
      const parts = req.parts();
      const body: Record<string, string> = {};
      const files: Record<string, { filename: string; mimetype: string; path: string }> = {};

      // Ajustar para a pasta uploads na raiz do projeto
      const uploadDir = path.join(__dirname, "../../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      try {
        for await (const part of parts) {
          if ((part as MultipartFile).file) {
            const filePart = part as MultipartFile;

            // Dados dinâmicos para o nome dos arquivos
            const userTelefone = body.telefone || "telefone-nao-informado";
            const userNomeCompleto = body.nome_completo || "nome-nao-informado";
            const dataAtual = ajustarFusoHorario(new Date(), timeZone).toISOString().replace(/[:.-]/g, "");
            const fileExtension = path.extname(filePart.filename);

            let filename = "";

            switch (filePart.fieldname) {
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

            const filePath = path.join(uploadDir, filename); // Caminho completo para salvar o arquivo

            const writeStream = fs.createWriteStream(filePath);
            for await (const chunk of filePart.file) {
              writeStream.write(chunk);
            }
            writeStream.end();

            files[filePart.fieldname] = {
              filename, // Nome único gerado
              mimetype: filePart.mimetype,
              path: filePath, // Caminho do arquivo no disco
            };

            console.log(`Arquivo salvo em: ${filePath}`);
          } else {
            const fieldPart = part as Multipart;
            body[fieldPart.fieldname] = "value" in fieldPart ? (fieldPart as any).value as string : "";
          }
        }

        console.log("BODY RECEBIDO NA ROTA:", body);
        console.log("FILES RECEBIDOS NA ROTA:", files);

        // Consolidar dados para o serviço
        const adjustedFiles: Record<string, MultipartFile> = {};
        Object.keys(files).forEach((key) => {
          adjustedFiles[key] = {
            fieldname: key,
            filename: files[key].filename,
            mimetype: files[key].mimetype,
            type: "file",
            encoding: "binary",
            fields: {},
            file: fs.createReadStream(files[key].path),
            toBuffer: async () => {
              return fs.promises.readFile(files[key].path);
            },
          } as unknown as MultipartFile;
        });

        // Chamada ao serviço com o ID tipado
        await atualizarUsuarioService(req.params.id, body, adjustedFiles, res);
      } catch (error) {
        console.error("Erro durante o processamento da requisição:", error);
        return res.status(500).send({ mensagem: "Erro interno ao processar a requisição." });
      }
    }
  );
}
