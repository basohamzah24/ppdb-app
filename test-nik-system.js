// Test script to verify NIK-based dual button system functionality
const axios = require('axios')

const BASE_URL = 'http://localhost:3000'

async function testNIKSystem() {
  console.log('🧪 Testing NIK-based dual button system...\n')

  // Test 1: Check NIK that doesn't exist
  console.log('1️⃣ Testing NIK that doesn\'t exist...')
  try {
    const testNIK = '1234567890123456'
    const response = await axios.get(`${BASE_URL}/api/public/check-nik?nik=${testNIK}`)
    
    if (response.status === 200) {
      console.log(`✅ NIK Check API works: ${JSON.stringify(response.data)}`)
    }
  } catch (error) {
    console.log(`❌ Error checking NIK: ${error.message}`)
  }

  // Test 2: Check status API with non-existing NIK
  console.log('\n2️⃣ Testing status check with non-existing NIK...')
  try {
    const testNIK = '1234567890123456'
    const response = await axios.get(`${BASE_URL}/api/public/status?nik=${testNIK}`)
    
    console.log(`Status: ${response.status}`)
  } catch (error) {
    if (error.response?.status === 404) {
      console.log(`✅ Status API correctly returns 404 for non-existing NIK`)
    } else {
      console.log(`❌ Unexpected error: ${error.message}`)
    }
  }

  // Test 3: Check if pendaftaran page loads
  console.log('\n3️⃣ Testing pendaftaran page accessibility...')
  try {
    const response = await axios.get(`${BASE_URL}/pendaftaran`)
    
    if (response.status === 200) {
      console.log(`✅ Pendaftaran page loads successfully`)
    }
  } catch (error) {
    console.log(`❌ Error loading pendaftaran page: ${error.message}`)
  }

  // Test 4: Check if status page loads
  console.log('\n4️⃣ Testing status page accessibility...')
  try {
    const response = await axios.get(`${BASE_URL}/status`)
    
    if (response.status === 200) {
      console.log(`✅ Status page loads successfully`)
    }
  } catch (error) {
    console.log(`❌ Error loading status page: ${error.message}`)
  }

  console.log('\n✨ Testing completed!\n')
  
  console.log('🎯 Summary of NIK-based dual button system:')
  console.log('   • NIK used as unique identifier for registration')
  console.log('   • "Kirim Pendaftaran" button for new registrations')
  console.log('   • "Cek Status Pendaftaran" button for existing registrations')
  console.log('   • Automatic NIK validation before action')
  console.log('   • Pre-fill NIK in pendaftaran and status pages via URL params')
  console.log('   • Visual distinction: solid vs outline button styles')
}

// Run the test
testNIKSystem().catch(console.error)