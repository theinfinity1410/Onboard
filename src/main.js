import express from 'express';
const app = express();

app.get('/signup', (req, res) => {
    const code = req.query.code;
    console.log('Received code:', code);
    res.send('Signup callback received. Check server logs for code.');
});

app.listen(3000, () => console.log('Server running on port 3000'));