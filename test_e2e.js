const http = require('http');
const https = require('https');

const baseURL = 'https://project-final-7sjb.onrender.com';
const username = '23bd1a663n';
const password = 'Satvik1@123';
const accNo = '7674815381';

// A tiny 1x1 base64 GIF image for dummy data
const dummyBase64 = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

async function request(path, method, data, isMultipart = false) {
  return new Promise((resolve, reject) => {
    const url = new URL(baseURL + path);
    
    let options = {
      method: method,
      headers: {}
    };

    let postData = '';
    
    if (data) {
      if (!isMultipart) {
        postData = JSON.stringify(data);
        options.headers['Content-Type'] = 'application/json';
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      } else {
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        options.headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
        
        // Construct multipart form data
        postData = `--${boundary}\r\n`;
        postData += `Content-Disposition: form-data; name="account_number"\r\n\r\n`;
        postData += `${data.account_number}\r\n`;
        postData += `--${boundary}\r\n`;
        postData += `Content-Disposition: form-data; name="verifying_signature"; filename="dummy.jpg"\r\n`;
        postData += `Content-Type: image/jpeg\r\n\r\n`;
        postData += `dummy binary data\r\n`;
        postData += `--${boundary}--\r\n`;
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }
    }

    const req = https.request(url, options, (res) => {
      let resData = '';
      res.on('data', (chunk) => resData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(resData) });
        } catch(e) {
          resolve({ status: res.statusCode, body: resData });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (postData) req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('1. Signing up...');
  const signupRes = await request('/api/auth/signup', 'POST', {
    firstName: 'Automated',
    lastName: 'Test',
    username: username,
    password: password
  });
  console.log('Signup result:', signupRes);

  console.log('\n2. Logging in...');
  const loginRes = await request('/api/auth/login', 'POST', {
    username: username,
    password: password
  });
  console.log('Login result:', loginRes);

  console.log('\n3. Uploading account info...');
  const uploadRes = await request('/api/account/add-account', 'POST', {
    accountNumber: accNo,
    userName: username,
    email: 'test@test.com',
    image: dummyBase64
  });
  console.log('Upload account result:', uploadRes);

  console.log('\n4. Verifying Signature...');
  const verifyRes = await request('/api/signature/verify', 'POST', {
    account_number: accNo
  }, true);
  console.log('Verify signature result:', verifyRes);
}

run();
