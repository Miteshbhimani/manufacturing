import axios from 'axios';

async function testBackend() {
  try {
    const response = await axios.get('http://localhost:3001/api/products');
    console.log('Backend Response Success:', response.data.success);
    console.log('Number of products:', response.data.data.length);
    if (response.data.data.length > 0) {
      console.log('First product:', response.data.data[0]);
    }
  } catch (error: any) {
    console.error('Backend Request Failed:', error.message);
    if (error.response) {
      console.error('Response Data:', error.response.data);
    }
  }
}

testBackend();
