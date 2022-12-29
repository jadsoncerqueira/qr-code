export const CreateQrCode = (QRCode , el, message = 'qrcode', quality = 220) => {
  QRCode.toCanvas(el.current, message, {
    width: quality,
    errorCorrectionLevel: 'H',
    margin: 2,
    light: '#005af5',
  }, (error) => {
    if(error) {
      console.log(error)
    }
  })
}

export const Download = (QRCode , el, message, quality = 1080) => {
  const link = document.createElement('a');
  link.download = 'qr-code-generated.png';

  CreateQrCode(QRCode, el, message, quality);

  link.href = el.current.toDataURL('image/jpeg', 5.0)
  link.click();
}