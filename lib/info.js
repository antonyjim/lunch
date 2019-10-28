// Lets get random crap like the current week and current location

const connection = require('./connection')()
const moment = require('moment')

function updateCurrentControl() {
  return new Promise((resolve, reject) => {
    const currentWeek = parseInt(moment().format('YYW'), 10) // Get the current week
    const defaultPlace = 1 // Jade dragon will be id 1
    connection.query('SELECT week FROM order_control WHERE week = ?', currentWeek, (err, results) => {
      if (err) reject(err)
      if (results.length > 0) {
        resolve(currentWeek)
      } else {
        connection.query('INSERT INTO order_control (week, location) VALUES (?, ?)', [currentWeek, defaultPlace], (err) => {
          if (err) reject(err)
          return resolve()
        })
      }
    })
  })
}

function getGeneralInfo() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT oc.week, oc.location, ol.tradestyle, ol.menu_link FROM order_control oc LEFT JOIN order_location ol ON oc.location = ol.loc_id WHERE oc.week = (SELECT MAX(week) FROM order_control)', (err, results) => {
      if (err) reject(err)
      if (!results || results.length === 0) {
        updateCurrentControl()
          .then(() => {
            getGeneralInfo().then(resolve).catch(reject)
          })
      } else {
        const info = results[0]
        info.week = moment(info.week.toString(), 'YYW').format('MMMM DD, YY')
        resolve(info)
      }
    })
  })
}

setInterval(updateCurrentControl, 86400)

module.exports = {
  getGeneralInfo
}