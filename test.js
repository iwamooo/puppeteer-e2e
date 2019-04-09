'use strict'

import fs from 'fs'
import puppeteer from 'puppeteer'
import test from 'ava'

test.serial('check form searchResult', async (t) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  page.setViewport({width: 1200, height: 800})

  let searchResultDomain

  try {
    await page.goto('https://www.google.co.jp/')
    await page.type('input[name="q"]', '焼肉')
    await page.keyboard.press('Enter')
    await page.waitForNavigation()
    await page.click('.srg .r a')
    await page.waitForNavigation()

    searchResultDomain = await page.evaluate(() => {
      return Promise.resolve(document.domain)
    })
  } catch (e) {
    t.fail(e)
  }

  const testFileDir = './testResulFile/'
  const fileName = `${new Date().getTime()}.png`

  if (!fs.existsSync(testFileDir)) {
    fs.mkdirSync(testFileDir)
  }

  await page.screenshot({ path: `${testFileDir}${fileName}` })

  browser.close()

  console.log(searchResultDomain)
  t.truthy(searchResultDomain === 'tabelog.com')
})
