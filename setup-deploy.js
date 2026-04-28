#!/usr/bin/env node

/**
 * Setup script for Render deployment automation
 * Creates .env file with API key and detects service ID
 *
 * Usage: npm run setup-deploy
 */

import fs from 'fs'
import path from 'path'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (prompt) =>
  new Promise((resolve) => {
    rl.question(prompt, resolve)
  })

async function main() {
  console.log('🎊 Render Deployment Setup\n')

  // Check if .env exists
  const envPath = path.join(process.cwd(), '.env')
  const envExists = fs.existsSync(envPath)

  if (envExists) {
    console.log('✅ .env file already exists')
    const overwrite = await question('Overwrite? (y/n): ')
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Aborted.')
      rl.close()
      return
    }
  }

  // Get API key
  const apiKey = await question('\n🔑 Enter your Render API Key: ')
  if (!apiKey.trim()) {
    console.log('❌ API key is required')
    rl.close()
    process.exit(1)
  }

  // Get service ID (optional)
  const serviceId = await question(
    '📦 Enter your Render Service ID (optional, auto-detect if blank): '
  )

  // Create .env content
  let envContent = `# Render Deployment Configuration\n`
  envContent += `# Generated: ${new Date().toISOString()}\n\n`
  envContent += `RENDER_API_KEY=${apiKey.trim()}\n`
  if (serviceId.trim()) {
    envContent += `RENDER_SERVICE_ID=${serviceId.trim()}\n`
  }

  // Write .env file
  fs.writeFileSync(envPath, envContent)
  console.log('\n✅ .env file created!\n')

  // Show next steps
  console.log('📋 Next Steps:\n')
  console.log('1. Add .env to .gitignore (already done if you cloned from repo)')
  console.log('2. Deploy with: npm run deploy\n')

  console.log('💡 Tips:')
  console.log('   - Keep .env file private (never commit to GitHub)')
  console.log('   - Regenerate API key if you shared it publicly')
  console.log('   - Service ID auto-detected if not provided\n')

  rl.close()
}

main().catch(console.error)
