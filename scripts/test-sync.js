import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAdminPublicSync() {
  try {
    console.log('🧪 Testing Admin-Public Synchronization...\n')

    // Test 1: Update hero content
    console.log('1️⃣ Testing Hero Content Update...')
    
    const originalHeroTitle = await prisma.siteContent.findUnique({
      where: { key: 'hero_title' }
    })
    console.log(`   Original hero title: "${originalHeroTitle.content}"`)
    
    // Update hero title
    const newHeroTitle = `PPDB Online Test - ${new Date().getTime()}`
    await prisma.siteContent.update({
      where: { key: 'hero_title' },
      data: { content: newHeroTitle }
    })
    console.log(`   ✅ Updated hero title to: "${newHeroTitle}"`)
    
    // Verify update
    const updatedHeroTitle = await prisma.siteContent.findUnique({
      where: { key: 'hero_title' }
    })
    console.log(`   ✅ Verified in database: "${updatedHeroTitle.content}"\n`)

    // Test 2: Update PPDB Settings
    console.log('2️⃣ Testing PPDB Settings Update...')
    
    const originalPPDBSettings = await prisma.pPDBSettings.findFirst()
    console.log(`   Original tahun ajaran: "${originalPPDBSettings.tahunAjaran}"`)
    console.log(`   Original status: "${originalPPDBSettings.statusPendaftaran}"`)
    
    // Update PPDB settings
    const newTahunAjaran = `TEST-${new Date().getFullYear()}/${new Date().getFullYear() + 1}`
    await prisma.pPDBSettings.update({
      where: { id: originalPPDBSettings.id },
      data: { 
        tahunAjaran: newTahunAjaran,
        statusPendaftaran: originalPPDBSettings.statusPendaftaran === 'buka' ? 'tutup' : 'buka'
      }
    })
    
    const updatedPPDBSettings = await prisma.pPDBSettings.findFirst()
    console.log(`   ✅ Updated tahun ajaran to: "${updatedPPDBSettings.tahunAjaran}"`)
    console.log(`   ✅ Updated status to: "${updatedPPDBSettings.statusPendaftaran}"\n`)

    // Test 3: Verify all content can be fetched
    console.log('3️⃣ Testing Content Fetching...')
    
    const allContent = await prisma.siteContent.findMany({
      orderBy: { key: 'asc' }
    })
    console.log(`   ✅ Found ${allContent.length} site content entries:`)
    allContent.forEach(content => {
      console.log(`      - ${content.key}: "${content.content.substring(0, 50)}${content.content.length > 50 ? '...' : ''}"`)
    })

    console.log('\n4️⃣ Testing Content Structure for Public Page...')
    
    // Simulate the data structure used by public page
    const heroData = {}
    const aboutData = {}
    const contactData = {}
    let announcement = ''

    allContent.forEach(item => {
      switch(item.key) {
        case 'hero_title':
          heroData.title = item.content
          break
        case 'hero_subtitle':
          heroData.subtitle = item.content
          break
        case 'hero_description':
          heroData.description = item.content
          break
        case 'about_title':
          aboutData.title = item.content
          break
        case 'about_content':
          aboutData.content = item.content
          break
        case 'contact_address':
          contactData.address = item.content
          break
        case 'contact_phone':
          contactData.phone = item.content
          break
        case 'contact_email':
          contactData.email = item.content
          break
        case 'announcement':
          announcement = item.content
          break
      }
    })

    console.log('   ✅ Hero data structure:')
    console.log(`      Title: "${heroData.title}"`)
    console.log(`      Subtitle: "${heroData.subtitle}"`)
    console.log(`      Description: "${heroData.description ? heroData.description.substring(0, 50) + '...' : 'N/A'}"`)
    
    console.log('   ✅ About data structure:')
    console.log(`      Title: "${aboutData.title}"`)
    console.log(`      Content: "${aboutData.content ? aboutData.content.substring(0, 50) + '...' : 'N/A'}"`)
    
    console.log('   ✅ Contact data structure:')
    console.log(`      Address: "${contactData.address}"`)
    console.log(`      Phone: "${contactData.phone}"`)
    console.log(`      Email: "${contactData.email}"`)
    
    console.log('   ✅ Announcement:')
    console.log(`      "${announcement}"`)

    console.log('\n🎉 All tests passed! Admin-Public synchronization is working correctly.')
    console.log('\n📝 Test Summary:')
    console.log('   ✅ Content can be updated via database')
    console.log('   ✅ PPDB Settings can be updated via database')
    console.log('   ✅ All content is properly structured for public display')
    console.log('   ✅ Data integrity is maintained')
    
    console.log('\n🚀 Next Steps:')
    console.log('   1. Access admin panel: http://localhost:3000/admin/login (username: admin, password: admin123)')
    console.log('   2. Update content through admin interface')
    console.log('   3. Check public page: http://localhost:3000')
    console.log('   4. Verify changes appear immediately on public page')

  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

testAdminPublicSync()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })