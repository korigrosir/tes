const express = require('express');
const axios = require('axios');
const app = express();

app.get('/oauth2callback', async (req, res) => {
    const authorizationCode = req.query.code; // Tangkap kode otorisasi

    try {
        // Tukar kode otorisasi dengan access token
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            code: authorizationCode,
            client_id: 'YOUR_CLIENT_ID',
            client_secret: 'YOUR_CLIENT_SECRET',
            redirect_uri: 'https://maskorii.vercel.app/oauth2callback',
            grant_type: 'authorization_code'
        });

        const accessToken = response.data.access_token;
        // Lakukan sesuatu dengan access token, misalnya simpan atau kirim kembali ke aplikasi Android

        // Mengarahkan kembali ke aplikasi dengan parameter access token atau status
        res.redirect('yourapp://callback?access_token=' + accessToken);
    } catch (error) {
        res.status(500).send('Error getting access token');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
