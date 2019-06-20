exports.separateFirstLastName = function (name) {
  const parts = name.split(' ')
  if (parts.length === 1) {
    return {
      firstName: '',
      lastName: parts[0]
    }
  } else if (parts.length === 2) {
    return {
      firstName: parts[0],
      lastName: parts[1]
    }
  } else if (parts.length > 2) {
    const firstNameParts = parts.slice(0, -1)
    return {
      firstName: firstNameParts.join(' '),
      lastName: parts.slice(-1)
    }
  } else {
    return {
      firstName: '',
      lastName: ''
    }
  }
}