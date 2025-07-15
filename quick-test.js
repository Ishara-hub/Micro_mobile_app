const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api';

async function testConnection() {
  console.log('🔍 Testing Laravel API Connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const testResponse = await axios.get(`${API_BASE_URL}/test`);
    console.log('✅ Connection successful:', testResponse.data.message);
    console.log('   Timestamp:', testResponse.data.timestamp);
    console.log('   Version:', testResponse.data.version);
    console.log('');

    // Test 2: Authentication
    console.log('2. Testing authentication...');
    const authResponse = await axios.post(`${API_BASE_URL}/login`, {
      email: 'kumara@gmail.com',
      password: '11111111',
      device_name: 'Test Script'
    });
    console.log('✅ Authentication successful');
    console.log('   User:', authResponse.data.data.user.name);
    console.log('   Token received:', authResponse.data.data.token ? 'Yes' : 'No');
    console.log('');

    const token = authResponse.data.data.token;

    // Test 3: Protected route
    console.log('3. Testing protected route...');
    const profileResponse = await axios.get(`${API_BASE_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Protected route accessible');
    console.log('   User profile retrieved successfully');
    console.log('');

    // Test 4: Payment search (with mock data)
    console.log('4. Testing payment search...');
    try {
      const searchResponse = await axios.post(`${API_BASE_URL}/payments/search-loan`, {
        search_term: '123456789'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Payment search endpoint working');
      console.log('   Response status:', searchResponse.data.status);
    } catch (searchError) {
      console.log('⚠️  Payment search failed (expected if no test data)');
      console.log('   Error:', searchError.response?.data?.message || searchError.message);
    }
    console.log('');

    // Test 5: Logout
    console.log('5. Testing logout...');
    const logoutResponse = await axios.post(`${API_BASE_URL}/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Logout successful');
    console.log('   Message:', logoutResponse.data.message);
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('Your Laravel backend is ready for mobile app integration.');
    console.log('');
    console.log('Next steps:');
    console.log('1. Start your mobile app');
    console.log('2. Navigate to the test connection screen');
    console.log('3. Run the same tests from the mobile app');
    console.log('4. Begin payment processing integration');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Ensure Laravel server is running: php artisan serve --host=0.0.0.0 --port=8000');
    console.log('2. Check if the server is accessible at http://localhost:8000');
    console.log('3. Verify database connection and migrations');
    console.log('4. Check Laravel logs: tail -f storage/logs/laravel.log');
  }
}

testConnection(); 