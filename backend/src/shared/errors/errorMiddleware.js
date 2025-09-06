// usar: app.use(errorMiddleware) no server.js, após as rotas
export function errorMiddleware(err, req, res, next) {
  console.error("Unhandled error:", err)
  const status = err.status || 500
  res.status(status).json({ error: err.message || "Erro interno" })
}
