// File: netlify/functions/submit-form.js

exports.handler = async function (event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Get the form data from the front-end request
  const formData = JSON.parse(event.body);

  // Add your secret access key from the environment variable
  formData.access_key = process.env.WEB3FORMS_ACCESS_KEY;

  // Send the data to Web3Forms
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      return { statusCode: 200, body: JSON.stringify(data) };
    } else {
      return { statusCode: response.status, body: JSON.stringify(data) };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Server error.' }) };
  }
};