const QRCode = require('qrcode');

exports.generarQR = async (req, res) => {
  const { texto } = req.query;

  if (!texto) {
    return res.status(400).json({ error: 'Falta el texto para generar el QR' });
  }

  try {
    const qr = await QRCode.toDataURL(texto);
    res.json({ qr });
  } catch (error) {
    console.error('Error generando QR:', error);
    res.status(500).json({ error: 'Error al generar el QR' });
  }
};
