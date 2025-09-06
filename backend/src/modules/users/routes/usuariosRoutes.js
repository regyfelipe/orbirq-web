import { Router } from "express"
import { cadastroUsuario, listarUsuariosPorRoleController } from "../controllers/usuariosController.js"

const router = Router()

router.post("/cadastro", cadastroUsuario)
router.get("/", listarUsuariosPorRoleController)

export default router
