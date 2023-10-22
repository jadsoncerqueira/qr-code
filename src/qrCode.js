import React, { useState, useRef, useEffect } from "react";
// import logo from './images/whats.png';
import { countryCodes } from "./utils/countryCodes";
import { CreateQrCode, Download } from "./utils/qrcode";
// import { QrCodePix } from "qrcode-pix";
// const agora = require("faz-um-pix");
import { createStaticPix, hasError } from "pix-utils";
const QRCode = require("qrcode");

function formatarValor(event) {
  let valor = event.target.value;

  // Substitui ponto por vírgula
  valor = valor.replace(".", ",");

  // Removendo tudo que não é número ou vírgula
  valor = valor.replace(/[^0-9,]/g, "");

  // Verificando se tem mais de uma vírgula
  const ocorrenciasVírgula = (valor.match(/,/g) || []).length;
  if (ocorrenciasVírgula > 1) {
    // Se tiver, remove a última
    valor = valor.substr(0, valor.lastIndexOf(","));
  }

  const partes = valor.split(",");

  // Se tiver parte decimal
  if (partes.length > 1) {
    // Limita a parte decimal a 2 dígitos
    valor = partes[0] + "," + partes[1].slice(0, 2);
  }

  // Atualiza o valor no campo
  event.target.value = valor;

  return valor;
}

export default function GenerateQrCode() {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  function gerarQRCodePIX() {
    if (tipo === "EMAIL" && !regex.test(chavePix)) {
      throw new Error(tiposChavePixAux[tipo].erro);
    } else if (
      tipo !== "EMAIL" &&
      chavePix.length !== tiposChavePixAux[tipo].quantidade
    ) {
      throw new Error(tiposChavePixAux[tipo].erro);
    }

    return createStaticPix({
      merchantName: nomePix.length < 1 ? "teste" : nomePix,
      merchantCity: cidadePix.length < 1 ? "teste" : cidadePix,
      pixKey:
        tipo === "TELEFONE"
          ? tiposChavePixAux[tipo].prefixo + chavePix
          : chavePix,
      infoAdicional: "",
      transactionAmount: parseFloat(String(valorPix).replace(",", ".")),
    });
  }

  const tiposChavePix = ["CNPJ", "CPF", "EMAIL", "TELEFONE"];
  const tiposChavePixAux = {
    CNPJ: {
      erro: "(O CNPJ precisa ter 14 numeros  e somente numeros)",
      quantidade: 14,
      placeholder: "Digite seu CNPJ",
    },
    CPF: {
      erro: "(O CPF precisa ter 11 numeros e somente numeros)",
      quantidade: 11,
      placeholder: "Digite seu CPF",
    },
    EMAIL: { erro: "(Email inválido)", placeholder: "seuemmail@email.com" },
    TELEFONE: {
      erro: "(Numero precisa ter 11 numeros)",
      quantidade: 11,
      prefixo: "+55",
      placeholder: "DD+Numero",
    },
  };

  const dwn = useRef();

  const canvas = useRef();
  const cls1 = useRef();
  const pixRef = useRef();
  const cls2 = useRef();
  const infos = useRef();
  const area = useRef();

  const [text, setText] = useState("");
  const [place, setPlace] = useState("Text or Url...");
  const [count, setCount] = useState("");
  const [phon, setPhon] = useState("");

  const [chavePix, setChavePix] = useState("");
  const [cidadePix, setCidadePix] = useState("");
  const [nomePix, setNomePix] = useState("");
  const [valorPix, setValorPix] = useState(0.0);
  const [tipo, setTipo] = useState(tiposChavePix[1]);
  const [messageErro, setMessageErro] = useState("");

  const verifivationOptionQrCode = (e) => {
    if (e.target.value === "WhatsApp") {
      cls1.current.classList.add("block");
      cls2.current.classList.add("block");
      infos.current.classList.add("infos");
      area.current.classList.add("margin");

      pixRef.current.classList.remove("flex");
      area.current.classList.remove("none");
      setPlace("Message...");
    } else if (e.target.value === "Pix") {
      cls1.current.classList.remove("block");
      cls2.current.classList.remove("block");
      infos.current.classList.remove("infos");
      area.current.classList.remove("margin");

      pixRef.current.classList.add("flex");
      area.current.classList.add("none");
      setPlace("Chave pix...");
    } else {
      cls1.current.classList.remove("block");
      cls2.current.classList.remove("block");
      infos.current.classList.remove("infos");
      area.current.classList.remove("margin");

      pixRef.current.classList.remove("flex");
      area.current.classList.remove("none");
      setPlace("Text or Url...");
    }
  };

  // useEffect(() => {

  // });
  function gene() {
    let aux = text === "" ? "qrcode" : text;
    if (place === "Message...") {
      aux = `https://wa.me/${count}${phon}?text=${aux.replace(/ /g, "%20")}`;
    } else if (place === "Chave pix...") {
      // aux = text;

      try {
        const pix = gerarQRCodePIX();
        if (!hasError(pix)) {
          aux = pix.toBRCode();
        }
        setMessageErro("");
      } catch (error) {
        setMessageErro(error.message);
      }
    } else {
      aux = text;
    }
    CreateQrCode(QRCode, canvas, aux, 220);
    return aux;
  }
  useEffect(() => {
    // let aux = "qrcode";

    // const teste = aux === "" ? "qrcode" : text;
    // aux = teste;
    gene();
    /* eslint-disable */
  }, [text, count, phon, chavePix, cidadePix, nomePix, valorPix, tipo, place]);

  return (
    <>
      <div id="radio">
        <h1>Qr Code Generator</h1>
        <h2 style={{ margin: "0", marginBottom: "10px", color: "green" }}>
          {">>>"} ESCOLHA UMA OPÇÃO {"<<<"}
        </h2>
        <div id="radio-input">
          <label>
            <input
              onClick={verifivationOptionQrCode}
              name="eu"
              value="Text/Url"
              defaultChecked={true}
              type="radio"
            />
            Text/Url
          </label>

          <label>
            <input
              onClick={verifivationOptionQrCode}
              name="eu"
              value="WhatsApp"
              type="radio"
            />
            WhatsApp
          </label>

          <label>
            <input
              onClick={verifivationOptionQrCode}
              value="Pix"
              name="eu"
              type="radio"
            />
            Pix
          </label>
        </div>
      </div>
      <section id="principal">
        <div ref={infos} id="infor">
          <label ref={cls1} className="label">
            Country code
            <select
              onChange={(e) => {
                setCount(e.target.value);
              }}
              value={count}
              id="country"
            >
              <option value="">--</option>
              {countryCodes.map((countrys, index) => {
                return (
                  <option key={index} value={countrys.code}>
                    {`${countrys.country} (+${countrys.code})`}
                  </option>
                );
              })}
            </select>
          </label>

          <label ref={cls2} className="label">
            Phone Number
            <input
              id="phone"
              type="text"
              value={phon}
              onChange={(e) => {
                setPhon(e.target.value);
              }}
            />
          </label>

          <div ref={pixRef} className="pix_div">
            <label>
              <p className="text_pix">
                Chave Pix <span className="erro_pix"> {messageErro}</span>
              </p>
              <div className="chave_pix">
                <select
                  defaultValue={tipo}
                  onChange={(e) => {
                    setTipo(e.target.value);
                  }}
                >
                  {tiposChavePix.map((ti, i) => (
                    <option key={i} value={ti}>
                      {ti}
                    </option>
                  ))}
                </select>
                <input
                  className="chaveInput"
                  placeholder={tiposChavePixAux[tipo].placeholder}
                  type="text"
                  value={chavePix}
                  onChange={(e) => {
                    setChavePix(e.target.value);
                  }}
                />
              </div>
            </label>

            <label>
              Nome - Opcional
              <input
                type="text"
                className="outroInput"
                placeholder="Carlos Antônio"
                value={nomePix}
                onChange={(e) => {
                  setNomePix(e.target.value);
                }}
              />
            </label>

            <label>
              Cidade - Opcional
              <input
                className="outroInput"
                placeholder="Candeias"
                type="text"
                value={cidadePix}
                onChange={(e) => {
                  setCidadePix(e.target.value);
                }}
              />
            </label>

            <label>
              Valor - Opcional
              <input
                className="outroInput"
                placeholder="0,00"
                type="text"
                value={valorPix}
                onChange={(e) => {
                  setValorPix(formatarValor(e));
                }}
              />
            </label>
          </div>
          <textarea
            ref={area}
            placeholder={place}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        </div>

        <div id="area-imagem">
          <div id="canvas">
            <canvas ref={canvas}></canvas>
            <canvas
              style={{
                display: "none",
              }}
              ref={dwn}
            ></canvas>
            {/* <div id="logo"><img src={ logo }/></div> */}
          </div>
          <button onClick={() => Download(QRCode, dwn, gene())}>
            Download
          </button>
        </div>
      </section>
    </>
  );
}
