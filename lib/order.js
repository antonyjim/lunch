const separateFirstLastName = require('./utils').separateFirstLastName
const connection = require('./connection')()
const getPerson = require('./person').getPerson
const moment = require('moment')

// Handle creating, modifying, and deleting orders

// Orders should be in the following format:

// o = {
//   person,
//   order,
//   itemId ? ,
//   price
// }

exports.getOrders = function (period = parseInt(moment().format('YYW'), 10)) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT oi.item_id, oi.description, oi.amount, CONCAT( p.first_name, \' \', p.last_name ) AS person FROM order_item oi LEFT JOIN person p ON oi.person = p.person_id WHERE oi.order_period = ?'
    let params = [period]

    connection.query(query, params, (err, results) => {
      if (err) {
        reject(err)
      }
      resolve(results)
    })
  })


}

exports.updateOrder = function (orderId, orderDetails) {
  return new Promise((resolve, reject) => {
    if (!orderDetails) {
      reject(new Error('Nothing to update!'))
    }
    let hasSetObject = false

    let baseQ = 'UPDATE order_item SET ? WHERE item_id = ?'
    let orderObject = {}

    if (orderDetails.person) {
      hasSetObject = true
      getPerson(orderDetails.person.trim())
        .then((personDetails) => {
          orderObject.person = personDetails.person_id
          if (orderDetails.description) {
            orderObject.description = orderDetails.description
          }

          if (orderDetails.amount) {
            orderObject.amount = orderDetails.amount
          }

          console.log(orderObject)
          connection.query(baseQ, [orderObject, orderId], (err, result) => {
            if (err) reject(err)
            resolve()
          })
        })
        .catch(reject)
    } else {
      console.log(orderDetails)
      if (orderDetails.description) {
        orderObject.description = orderDetails.description
        hasSetObject = true
      }

      if (orderDetails.amount) {
        orderObject.amount = orderDetails.amount
        hasSetObject = true
      }

      if (!hasSetObject) {
        reject()
      }
      connection.query(baseQ, [orderObject, orderId], (err, result) => {
        if (err) reject(err)
        resolve()
      })
    }

  })
}


exports.createOrder = function (orderDetails) {
  return new Promise((resolve, reject) => {
    let {
      person,
      description,
      itemId,
      amount
    } = orderDetails

    if (!person) {
      reject(new Error('Missing name of person ordering'))
    } else if (!description) {
      reject(new Error('Missing order details'))
    } else if (!amount) {
      reject(new Error('Missing price for ' + order))
    }

    person = separateFirstLastName(person)

    getPerson(person)
      .then(personDetails => {
        connection.query('INSERT INTO order_item (person, order_period, description, amount) VALUES (?, ?, ?, ?)', [
          personDetails.person_id,
          moment().format('YYW'),
          description,
          amount
        ], (err, results) => {
          if (err) reject(err)
          resolve(results)
        })
      })
      .catch(reject)

  })
}

exports.deleteOrder = function (orderId) {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM order_item WHERE item_id = ?', [orderId], (err, results) => {
      if (err) reject(err)
      resolve()
    })
  })
}