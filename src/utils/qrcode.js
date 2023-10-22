export const CreateQrCode = (QRCode, el, message, quality = 220) => {
  const text = message === "" ? "qrcode" : message;
  console.log("aqui " + text);
  QRCode.toCanvas(
    el.current,
    text,
    {
      width: quality,
      errorCorrectionLevel: "H",
      margin: 2,
      light: "#005af5",
    },
    (error) => {
      if (error) {
        console.log(error);
      }
    }
  );
};

export const Download = (QRCode, el, message, quality = 1080) => {
  console.log(message);
  const link = document.createElement("a");
  link.download = "qr-code-generated.png";

  CreateQrCode(QRCode, el, message, quality);

  link.href = el.current.toDataURL("image/jpeg", 5.0);
  link.click();
};
