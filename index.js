
const express = require("express");
const bodyParser = require("body-parser");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Konfigurasi OAuth
const CLIENT_ID = "351423920988-r76n0qoa1nsgqbi692mdi0rln0m7l20s.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://tes2-hebvjingm-korigrosirs-projects.vercel.app"; // Redirect URI sesuai dengan yang diatur di Google Cloud Console

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Endpoint utama untuk memulai proses OAuth
app.get("/auth", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.upload"],
  });
  res.redirect(authUrl);
});

// Endpoint Redirect URI untuk menerima authorization code
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code is missing.");
  }

  try {
    // Tukar authorization code dengan access token
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Simpan access token (bisa di database atau variabel sementara)
    const accessToken = tokens.access_token;

    // Contoh: Panggil YouTube API untuk mendapatkan channel pengguna
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const channelData = response.data;
    res.send({
      message: "Authentication successful",
      tokens,
      channelData,
    });
  } catch (error) {
    console.error("Error exchanging code for tokens:", error.message);
    res.status(500).send("Failed to exchange code for tokens.");
  }
});

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
