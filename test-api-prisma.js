// Test API endpoints dengan Prisma
const testEndpoints = async () => {
  const baseUrl = 'http://localhost:3000/api'

  console.log('🧪 Testing PPDB API Endpoints with Prisma\n')

  try {
    // 1. Test database connection
    console.log('1️⃣ Testing database connection...')
    const dbTest = await fetch(`${baseUrl}/test-db`)
    const dbResult = await dbTest.json()
    console.log('✅ Database test:', dbResult.message)
    console.log('📊 PostgreSQL version:', dbResult.database_info?.[0]?.pg_version?.substring(0, 50) + '...')

    // 2. Get existing data
    console.log('\n2️⃣ Getting existing pendaftar data...')
    const getResponse = await fetch(`${baseUrl}/pendaftar`)
    const getData = await getResponse.json()
    console.log(`✅ Found ${getData.total} existing pendaftar`)
    
    if (getData.data.length > 0) {
      console.log('📋 Sample data:', {
        nama: getData.data[0].nama,
        nik: getData.data[0].nik,
        created_at: getData.data[0].created_at
      })
    }

    // 3. Test new registration
    console.log('\n3️⃣ Testing new registration...')
    const newPendaftar = {
      nama: 'Test Prisma User',
      nik: '3171234567890999',
      tempat_lahir: 'Jakarta',
      tanggal_lahir: '2012-06-15',
      jenis_kelamin: 'Laki-laki',
      alamat: 'Jl. Test Prisma No. 123, Jakarta Timur',
      nama_ayah: 'Bapak Test',
      nama_ibu: 'Ibu Test',
      no_telp: '081234567999',
      email: 'test@prisma.example.com'
    }

    const postResponse = await fetch(`${baseUrl}/pendaftar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPendaftar)
    })

    if (postResponse.ok) {
      const postData = await postResponse.json()
      console.log('✅ New registration successful!')
      console.log('🆔 New ID:', postData.data.id)
      console.log('📝 Registered name:', postData.data.nama)
    } else {
      const errorData = await postResponse.json()
      console.log('❌ Registration failed:', errorData.error)
    }

    // 4. Test duplicate registration
    console.log('\n4️⃣ Testing duplicate NIK validation...')
    const duplicateResponse = await fetch(`${baseUrl}/pendaftar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPendaftar)
    })

    if (!duplicateResponse.ok) {
      const duplicateError = await duplicateResponse.json()
      console.log('✅ Duplicate validation working:', duplicateError.error)
    }

    // 5. Final count
    console.log('\n5️⃣ Final count check...')
    const finalResponse = await fetch(`${baseUrl}/pendaftar`)
    const finalData = await finalResponse.json()
    console.log(`✅ Total pendaftar now: ${finalData.total}`)

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run tests
testEndpoints()