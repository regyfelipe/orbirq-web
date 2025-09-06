import { loginUsuario } from "../services/authService.js";

export async function login(req, res) {
  try {
    const { emailOrUsername, senha } = req.body;
    const result = await loginUsuario(emailOrUsername, senha);
    res.json(result);
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(400).json({ error: err.message });
  }
}
