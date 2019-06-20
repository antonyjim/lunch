const connection = require('./connection')()
const separateFirstLastName = require('./utils').separateFirstLastName

function createPerson(person) {
  return new Promise((resolve, reject) => {
    let query = 'INSERT INTO person (first_name, last_name) VALUES (?, ?)'
    let params = [person.firstName, person.lastName]

    connection.query(query, params, (err, results) => {
      if (err) reject(err)
      resolve()
    })
  })
}

exports.getPerson = function getPerson(person) {
  return new Promise((resolve, reject) => {
    // This will probably be used the most
    let query = 'SELECT * FROM person WHERE first_name = ? AND last_name = ?'
    let params = []
    let qPerson = {
      firstName: '',
      lastName: ''
    }
    if (typeof person === 'string') {
      qPerson = separateFirstLastName(person)
      params = [qPerson.firstName, qPerson.lastName]
    } else {
      if (person.firstName || person.lastName) {
        params = [person.firstName, person.lastName]
      } else if (person.person_id) {
        query = 'SELECT * FROM person WHERE person_id = ?'
        params = [person.person_id]
      } else {
        reject(new Error('Missing person details'))
      }
    }

    connection.query(query, params, (err, results) => {
      if (err) reject(err)
      console.log(results)
      if (results.length === 0 && person.lastName) {
        createPerson(person).then(() => {
          getPerson(person)
            .then(resolve)
            .catch(reject)
        }).catch(reject)
      } else if (results.length > 0) {
        resolve(results[0])
      } else {
        reject(new Error('An unknown error occurred. Please try again later'))
      }
    })
  })
}