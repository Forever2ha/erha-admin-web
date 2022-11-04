import JSEncrypt from 'jsencrypt';

const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxSMKVfuKmiJSQhwqNKHiZ5l8y\n' +
  'r/JZHYIWnsYGNGDPD7gIU/oficihek/FVQI69IwJE9P7zpayCbq/z6nomB0C40J3\n' +
  'vVhC7lvWsr8+WDOQTdKDf4Wal4Xc9nN0JbGFA1qbD52GtrbcsL9gziGaqoAhwy0l\n' +
  '/51IT9I5JiHws0ytzwIDAQAB';

// http://web.chacuo.net/netrsakeypair 生成密钥
export default function encrypt(txt: string): string {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(publicKey);
  return jsEncrypt.encrypt(txt) as string;
}
