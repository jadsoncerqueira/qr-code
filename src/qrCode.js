import React, { useState, useRef, useEffect } from 'react';
// import logo from './images/whats.png';
import { countryCodes } from './utils/countryCodes';
import { CreateQrCode, Download } from './utils/qrcode';
const QRCode = require('qrcode');

export default function GenerateQrCode() {

  const dwn = useRef();
  let aux = '';

  const canvas = useRef();
  const cls1 = useRef();
  const cls2 = useRef();
  const infos = useRef();
  const area = useRef();

  const [text, setText] = useState("");
  const [place, setPlace] = useState("Text or Url...");
  const [count, setCount] = useState("");
  const [phon, setPhon] = useState("");

  const verifivationOptionQrCode = (e) => {
    if (e.target.value === 'WhatsApp') {
      cls1.current.classList.add('block');
      cls2.current.classList.add('block');
      infos.current.classList.add('infos');
      area.current.classList.add('margin');
      setPlace("Message...");
    } else {
      cls1.current.classList.remove('block');
      cls2.current.classList.remove('block');
      infos.current.classList.remove('infos');
      area.current.classList.remove('margin');
      setPlace("Text or Url...");
    }
  };

  useEffect(() => {
    
    CreateQrCode(QRCode, canvas, aux, 220);
  })

  if (place === "Message...") {
    console.log(place)
    aux = text;
    aux = `https://wa.me/${ count }${ phon }?text=${aux.replace(/ /g, '%20')}`
  } else {
    aux = text
  }

  const teste = aux === '' ? 'qrcode' : aux;
  aux = teste;

  return (
    <>
      <div id="radio">
          <h1>Qr Code Generator</h1>
          <div id="radio-input">

            <label>
              <input
                onClick={ verifivationOptionQrCode }
                name="eu" value="Text/Url"
                defaultChecked={ true }
                type="radio"
              />
              Text/Url
            </label>

            <label>
              <input
                onClick={ verifivationOptionQrCode }
                name="eu"
                value="WhatsApp"
                type="radio"
              />
              WhatsApp
            </label>

          </div>
      </div>
      <section id="principal">
          
          <div ref={ infos } id="infor">

            <label ref={ cls1 } className="label">
              Country code
              <select
                onChange={ (e) => { setCount(e.target.value) } }
                value={ count } id="country"
              >
                <option value="">--</option>
                { 
                  countryCodes.map((countrys, index) => {
                    return (
                      <option key={ index } value={countrys.code}>
                        {`${countrys.country} (+${countrys.code})`}
                      </option>
                    );
                  })
                }
              </select>
            </label>

            <label ref={ cls2 } className="label">
              Phone Number
              <input
                id="phone"
                type="text"
                value={ phon }
                onChange={ (e) => { setPhon(e.target.value) } }
              />
            </label>
            <textarea
              ref={ area }
              placeholder={ place }
              value={ text }
              onChange={ (e) => { setText(e.target.value) } }
            />
          </div>
          
          <div id="area-imagem">
            <div  id="canvas">
              <canvas ref={ canvas }></canvas>
              <canvas style={ {
                display: 'none'
              }} ref={ dwn }></canvas>
              {/* <div id="logo"><img src={ logo }/></div> */}
            </div>
            <button onClick={ () => Download(QRCode, dwn, aux) }>Download</button>
          </div>
      </section>
    </>
  )
}
