import axios from 'axios';
import type { AxiosResponse as AxiosResponseType } from 'axios';

const API_URL = 'http://localhost:5000/api';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

async function runTests() {
  try {
    console.log('Starting authentication tests...\n');

    // Test 1: Successful Registration
    console.log('Test 1: Testing successful registration');
    try {
      const registerResponse: AxiosResponseType<AuthResponse> = await axios.post(`${API_URL}/auth/register`, testUser);
      console.log('✅ Registration successful:', {
        status: registerResponse.status,
        token: registerResponse.data.token ? '(Token received)' : '(No token)',
        user: registerResponse.data.user
      });
    } catch (error: any) {
      console.log('❌ Registration failed:', error.response?.data || error.message);
    }

    // Test 2: Duplicate Registration
    console.log('\nTest 2: Testing duplicate registration');
    try {
      await axios.post(`${API_URL}/auth/register`, testUser);
      console.log('❌ Expected duplicate registration to fail');
    } catch (error: any) {
      if (error.response?.status === 409) {
        console.log('✅ Correctly rejected duplicate registration:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // Test 3: Invalid Registration (missing fields)
    console.log('\nTest 3: Testing invalid registration');
    try {
      await axios.post(`${API_URL}/auth/register`, { email: testUser.email });
      console.log('❌ Expected invalid registration to fail');
    } catch (error: any) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly rejected invalid registration:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // Test 4: Successful Login
    console.log('\nTest 4: Testing successful login');
    try {
      const loginResponse: AxiosResponseType<AuthResponse> = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login successful:', {
        status: loginResponse.status,
        token: loginResponse.data.token ? '(Token received)' : '(No token)',
        user: loginResponse.data.user
      });
    } catch (error: any) {
      console.log('❌ Login failed:', error.response?.data || error.message);
    }

    // Test 5: Invalid Login
    console.log('\nTest 5: Testing invalid login');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: 'wrongpassword'
      });
      console.log('❌ Expected invalid login to fail');
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected invalid login:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

  } catch (error: any) {
    console.error('Test suite error:', error.message);
  }
}

// Run the tests
runTests(); 