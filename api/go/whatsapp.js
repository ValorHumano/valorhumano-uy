export default function handler(req, res) {
  const target = "/contacto/#formulario-contacto";
  res.statusCode = 302;
  res.setHeader("Location", target);
  res.setHeader("Cache-Control", "no-store");
  res.end();
}
