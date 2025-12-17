import { AdminAuth } from '../lib/auth'

async function createDefaultAdmin() {
  try {
    console.log('Creating default admin...')
    
    const admin = await AdminAuth.createAdmin({
      username: 'admin',
      password: 'admin123',
      nama: 'Administrator System',
      email: 'admin@ppdb.sch.id',
      role: 'super_admin'
    })

    console.log('✅ Default admin created successfully:')
    console.log(`   Username: admin`)
    console.log(`   Password: admin123`)
    console.log(`   Name: ${admin.nama}`)
    console.log(`   ID: ${admin.id}`)
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      console.log('ℹ️  Admin dengan username "admin" sudah ada')
    } else {
      console.error('❌ Error creating admin:', error)
    }
  }
}

// Run if this file is executed directly
if (require.main === module) {
  createDefaultAdmin()
    .then(() => {
      console.log('Seed completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seed failed:', error)
      process.exit(1)
    })
}

export { createDefaultAdmin }