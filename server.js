const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/7atp9o1pksv82qxl385w68zj9w2g675n';
const orderDatabase = {};

app.post('/update-status', (req, res) => {
    const { orderId, status, reason } = req.body;
    if (!orderId) {
        return res.status(400).json({ error: 'Order ID diperlukan' });
    }
    orderDatabase[orderId] = {
        orderId,
        status: status || 'DITERIMA & DALAM PROSES',
        reason: reason || '',
        updatedAt: new Date().toISOString()
    };
    res.status(200).json({ success: true, message: 'Status berjaya disimpan' });
});

app.get('/check-status/:id', (req, res) => {
    const orderId = req.params.id;
    const orderData = orderDatabase[orderId];
    if (orderData) {
        res.status(200).json(orderData);
    } else {
        res.status(404).json({ error: 'ID Pesanan tidak dijumpai' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pelayan Ayenn berjalan di hos 0.0.0.0 pada port ${PORT}`);
});
