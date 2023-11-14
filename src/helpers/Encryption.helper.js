
import CryptoJS from 'crypto-js';
import Locals from '../providers/locals.js';

export class EncryptionService {
  constructor() { }
   ivStr = "YHeLeAzUTz2ypCfW" //this.randomString(16, environment.RANDOM)
  //The set method is use for encrypt the value.
  static set(value) {
    let key = Locals.config().appSecret;
    let iv = CryptoJS.enc.Utf8.parse(this.ivStr);
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), key,
      {
        keySize:  128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return encrypted.toString()
  }

  //The get method is use for decrypt the value.
  static get(value)  {
    let key = Locals.config().appSecret;
    let iv = CryptoJS.enc.Utf8.parse(this.ivStr);

      try {

        const bytes = CryptoJS.AES.decrypt(value,key,
            {
            keySize:  128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7

          }
          );
        let stringifiedtext = bytes.toString(CryptoJS.enc.Utf8);
        return stringifiedtext
      } catch (e) {
        Promise.reject(e);
      }
    
  }

  _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  getEncoding(data) {
    let iv64 = btoa(this.ivStr)
    let conCodData = iv64 + data
    let mac = this.hmac(environment.LOGIN_KEY, conCodData)
    let jsonres = { iv: iv64, value: data, mac: mac }
    return btoa(JSON.stringify(jsonres))
  }
  hmac(key, data) {
    const bytes = CryptoJS.HmacSHA256(data, key);
    return bytes.toString(CryptoJS.enc.Hex);
  }

  getCryptLibDecoding(data) {
       
    return this.get(this.ivStr,data)
   
  }



  

  setCryptLibEncode(value)  {
     //let iv64 = atob(ivStr)
     const iv = this.ivStr //"BFpkOHMZ8n0kgccY"; //16 bytes = 128 bit
     const key = cryptLib.getHashSha256(environment.LOGIN_KEY, 32); //32 bytes = 256 bits
     const cipherText = cryptLib.encrypt(value, key, iv);
     let encode = btoa(JSON.stringify({iv:iv,value:cipherText}))
     return cipherText
  }

  encodeAndEncrypt(){
    
  }
  getCDecoding(value){
        console.log(this.get(JSON.parse(atob(value)).iv,JSON.parse(atob(value)).value))
    }


}