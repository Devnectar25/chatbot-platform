const axios = require('axios');

async function testNodeApi() {
    try {
        console.log('Testing Node.js /api/chat endpoint...');
        const response = await axios.post('http://127.0.0.1:3000/api/chat', {
            app_id: 'demo_app_1',
            question: 'What are the office hours?'
        });
        console.log('Status:', response.status);
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testNodeApi();
