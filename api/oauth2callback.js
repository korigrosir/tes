export default function handler(req, res) {
  if (req.method === "GET") {
    const { code } = req.query; // Ambil parameter 'code' dari query string

    if (!code) {
      return res.status(400).json({ error: "Missing 'code' parameter" });
    }

    // Lakukan sesuatu dengan kode, misalnya tukar dengan token akses
    res.status(200).json({ message: "Code received", code });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
