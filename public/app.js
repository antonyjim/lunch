(function () {
  'use strict'
  function getOrders() {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', '/api/orders', true)
    xhr.responseType = 'json'
    xhr.onloadend = function () {
      vm.orders = xhr.response
    }
    xhr.send()
  }

  function modifyOrder(e) {
    // Find the order we are looking for
    var ord = vm.orders.find(function (o) {
      return o.item_id == e.target.id
    })

    vm.modifyOrderData = ord
  }

  function addOrder() {
    if (!vm.newOrder.amount || !vm.newOrder.person || !vm.newOrder.description) {
      vm.errors.push({
        message: 'Missing required information'
      })

      return
    }

    var xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/order')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.responseType = 'json'

    xhr.onloadend = function () {
      if (xhr.status === 200) {
        vm.successes.push({
          message: 'Item successfully inserted'
        })

        // Push the id onto the orders array
        if (xhr.response.id) {
          vm.newOrder.id = xhr.response.id
        }
        vm.orders.push(vm.newOrder)
        vm.newOrder = {
          person: '',
          description: '',
          amount: ''
        }
      } else {
        vm.errors.push(xhr.response)
      }
    }

    xhr.send(JSON.stringify(vm.newOrder))

  }

  function submitModifiedOrder() {
    if (!vm.modifyOrderData.item_id) {
      vm.errors.push({
        message: 'Failed to update item'
      })
    }
    var xhr = new XMLHttpRequest()
    xhr.open('PUT', '/api/order/' + vm.modifyOrderData.item_id)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onloadend = function () {
      if (xhr.status === 204) {
        vm.successes.push({
          message: 'Item successfully updated'
        })

        for (var i = 0; i < vm.orders.length; i++) {
          if (vm.orders[i].id == vm.modifyOrderData.item_id) {
            vm.orders[i] = vm.modifyOrderData
            break
          }
        }
      } else {
        vm.errors.push({
          message: "Could not update order"
        })
      }
    }

    xhr.send(JSON.stringify(vm.modifyOrderData))
  }

  function deleteOrder() {
    if (!vm.modifyOrderData.item_id) {
      vm.errors.push({
        message: 'Failed to update item'
      })
    }
    var xhr = new XMLHttpRequest()
    xhr.open('DELETE', '/api/order/' + vm.modifyOrderData.item_id)
    xhr.onloadend = function () {
      if (xhr.status === 204) {
        vm.successes.push({
          message: 'Item successfully deleted'
        })
        for (var i = 0; i < vm.orders.length; i++) {
          if (vm.orders[i].item_id == vm.modifyOrderData.item_id) {
            vm.orders.splice(i, 1)
            break
          }
        }
      } else {
        vm.errors.push({
          message: "Could not delete order"
        })
      }
    }

    xhr.send()
  }

  // First lets get the basic information
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/api/getWeeklyInfo', true)
  xhr.responseType = 'json'
  // We expect xhr.response to look something like: 
  // {"menuLink": "http://jadedragon.com", "weekControl": "June 13th", "loc": "Jade Dragon"}
  xhr.onloadend = function () {
    window.vm = new Vue({
      el: document.getElementById('vue'),
      data: {
        errors: [],
        successes: [],
        info: xhr.response,
        orders: [],
        newOrder: {
          person: '',
          description: '',
          amount: ''
        },
        modifyOrderData: {}
      },
      methods: {
        modifyOrder: modifyOrder,
        addOrder: addOrder,
        submitModifiedOrder: submitModifiedOrder,
        deleteOrder: deleteOrder
      }
    })

    getOrders()

    document.getElementById('vue').style.display = 'block'

    document.getElementById('loading').style.display = 'none'
  }

  xhr.send()

})()