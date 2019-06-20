// Lets store all of the routes here

const router = require('express').Router()
const getGeneralInfo = require('./lib/info').getGeneralInfo
const orders = require('./lib/order')
const getOrders = orders.getOrders
const createOrder = orders.createOrder
const updateOrder = orders.updateOrder
const deleteOrder = orders.deleteOrder

router.get('/getWeeklyInfo', (req, res) => {
  getGeneralInfo()
    .then(info => {
      res.status(200).json(info)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: err.message,
        success: false
      })
    })
})

router.get('/orders', (req, res) => {
  getOrders()
    .then(orders => {
      res.status(200).json(orders)
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
        success: false
      })
    })
})


router.post('/order', (req, res) => {
  console.log(req.body)
  createOrder(req.body)
    .then(() => {
      res.status(200).json({
        success: true
      })
    })
    .catch(err => {
      console.error(err)
      res.status(400).json({
        message: err.message,
        success: false
      })
    })
})

router.put('/order/:orderId', (req, res) => {
  updateOrder(req.params.orderId, req.body)
    .then(() => {
      res.status(204).send()
    })
    .catch(err => {
      console.error(err)
      res.status(400).send()
    })
})

router.delete('/order/:orderId', (req, res) => {
  deleteOrder(req.params.orderId)
    .then(() => {
      res.status(204).send()
    })
    .catch(err => {
      console.error(err)
      res.status(400).send()
    })
})

module.exports = router