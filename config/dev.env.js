'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"https://172.26.22.193/TroilaEnterpriseLive"',
  // BASE_API: '"https://172.26.106.52/TroilaEnterpriseLive"',
  BASE_API: '"https://live.troila.com/TroilaEnterpriseLive"',
  LIVE_URL: '"https://live.troila.com/room/index-host.html"',
  ROOM_URL: '"https://live.troila.com/room"',
})
