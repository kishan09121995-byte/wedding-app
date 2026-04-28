#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

/**
 * Render Deployment Script
 * Automates building and deploying the wedding app to Render
 *
 * Usage:
 *   npm run deploy
 *
 * Or with custom API key:
 *   RENDER_API_KEY=your_key npm run deploy
 *
 * Or standalone:
 *   node deploy.js
 */

const API_KEY = process.env.RENDER_API_KEY || 'rnd_tFnHheGEpaJDyeAkBZLKoXkObFFb'
const SERVICE_ID = process.env.RENDER_SERVICE_ID || null // Will be auto-detected

const RENDER_API_BASE = 'https://api.render.com/v1'

async function getServices() {
  console.log('📋 Fetching your Render services...')
  try {
    const res = await fetch(`${RENDER_API_BASE}/services`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    })

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    return data.services || data
  } catch (error) {
    console.error('❌ Failed to fetch services:', error.message)
    process.exit(1)
  }
}

async function findWeddingAppService(services) {
  const weddingApps = services.filter((s) =>
    s.name.toLowerCase().includes('wedding') ||
    s.name.toLowerCase().includes('app')
  )

  if (weddingApps.length === 0) {
    console.error('❌ No service found matching "wedding" or "app"')
    console.log('📌 Available services:')
    services.forEach((s) => {
      console.log(`   - ${s.name} (ID: ${s.id})`)
    })
    console.log('\n💡 Tip: Set RENDER_SERVICE_ID=your_service_id if auto-detection fails')
    process.exit(1)
  }

  if (weddingApps.length > 1) {
    console.log('⚠️ Multiple services found:')
    weddingApps.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.name} (ID: ${s.id})`)
    })
    console.log('\n💡 Tip: Set RENDER_SERVICE_ID=your_service_id to specify one')
    return weddingApps[0] // Return first one
  }

  return weddingApps[0]
}

async function triggerDeploy(serviceId) {
  console.log(`🚀 Triggering deployment for service: ${serviceId}`)
  try {
    const res = await fetch(`${RENDER_API_BASE}/services/${serviceId}/deploys`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`)
    }

    const deploy = await res.json()
    return deploy
  } catch (error) {
    console.error('❌ Failed to trigger deploy:', error.message)
    process.exit(1)
  }
}

async function pollDeployStatus(serviceId, deployId, maxAttempts = 60) {
  console.log('⏳ Waiting for deployment to complete...')
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      const res = await fetch(`${RENDER_API_BASE}/services/${serviceId}/deploys/${deployId}`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      })

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`)
      }

      const deploy = await res.json()
      const status = deploy.status

      console.log(`   Status: ${status}`)

      if (status === 'live') {
        return { success: true, deploy }
      }

      if (status === 'build_failed' || status === 'deploy_failed') {
        return { success: false, deploy, error: `Deployment ${status}` }
      }

      // Wait 5 seconds before next poll
      await new Promise((resolve) => setTimeout(resolve, 5000))
      attempts++
    } catch (error) {
      console.error('❌ Failed to check deploy status:', error.message)
      process.exit(1)
    }
  }

  return { success: false, error: 'Deployment timed out after 5 minutes' }
}

async function main() {
  console.log('🎊 Wedding App Render Deployment Automation\n')

  // Step 1: Fetch services
  const services = await getServices()
  console.log(`✅ Found ${services.length} service(s)\n`)

  // Step 2: Find wedding app service
  let targetService
  if (SERVICE_ID) {
    targetService = services.find((s) => s.id === SERVICE_ID)
    if (!targetService) {
      console.error(`❌ Service not found with ID: ${SERVICE_ID}`)
      process.exit(1)
    }
  } else {
    targetService = await findWeddingAppService(services)
  }

  console.log(`🎯 Target Service: ${targetService.name}`)
  console.log(`   ID: ${targetService.id}`)
  console.log(`   Environment: ${targetService.service}\n`)

  // Step 3: Trigger deployment
  const deploy = await triggerDeploy(targetService.id)
  console.log(`✅ Deployment triggered (ID: ${deploy.id})\n`)

  // Step 4: Poll for completion
  const result = await pollDeployStatus(targetService.id, deploy.id)

  if (result.success) {
    console.log('\n✨ Deployment successful!')
    console.log(`🔗 Your app is live!`)
    if (targetService.url) {
      console.log(`   URL: ${targetService.url}`)
    }
  } else {
    console.error(`\n❌ Deployment failed: ${result.error}`)
    process.exit(1)
  }
}

main()
