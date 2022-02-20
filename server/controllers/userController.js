const mysql = require('mysql')
//connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.PASS,
  database: process.env.DB_NAME,
})
// view users
exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err //not connected
    console.log('Connected as ID' + connection.threadId)

    //use connection
    connection.query(
      'SELECT * FROM user WHERE status ="active"',
      (err, rows) => {
        //when done with the connection, release it
        connection.release()
        if (!err) {
          let removedUser = req.query.removed
          res.render('home', { rows, removedUser })
        } else {
          console.log(err)
        }
        console.log('The data from user table: \n', rows)
      }
    )
  })
}

//find user by search
exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err //not connected
    console.log('Connected as ID' + connection.threadId)

    let searchTerm = req.body.search
    //use connection
    connection.query(
      'SELECT * FROM user WHERE first_name LIKE ? OR last_name  LIKE ?',
      ['%' + searchTerm + '%', '%' + searchTerm + '%'],
      (err, rows) => {
        //when done with the connection, release it
        connection.release()
        if (!err) {
          res.render('home', { rows })
        } else {
          console.log(err)
        }
        console.log('The data from user table: \n', rows)
      }
    )
  })
}

exports.form = (req, res) => {
  res.render('add-user')
}
//add new user
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body
  pool.getConnection((err, connection) => {
    if (err) throw err //not connected
    console.log('Connected as ID' + connection.threadId)

    let searchTerm = req.body.search
    //use connection
    connection.query(
      'INSERT INTO user SET first_name = ?,last_name = ?, email=?, phone=?, comments=?',
      [first_name, last_name, email, phone, comments],
      (err, rows) => {
        //when done with the connection, release it
        connection.release()
        if (!err) {
          res.render('add-user', { alert: 'User added successfully' })
        } else {
          console.log(err)
        }
        console.log('The data from user table: \n', rows)
      }
    )
  })
}

//edit user
exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err //not connected
    console.log('Connected as ID' + connection.threadId)

    //use connection

    connection.query(
      'SELECT * FROM user WHERE id = ?',
      [req.params.id],
      (err, rows) => {
        //when done with the connection, release it
        connection.release()
        if (!err) {
          res.render('edit-user', { rows })
        } else {
          console.log(err)
        }
        console.log('The data from user table: \n', rows)
      }
    )
  })
}

//update user
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body

  pool.getConnection((err, connection) => {
    if (err) throw err //not connected
    console.log('Connected as ID' + connection.threadId)
    //use connection
    connection.query(
      'UPDATE user SET first_name = ?, last_name = ?, email = ? , phone = ? , comments =? WHERE id = ?',
      [first_name, last_name, email, phone, comments, req.params.id],
      (err, rows) => {
        //when done with the connection, release it
        connection.release()
        if (!err) {
          pool.getConnection((err, connection) => {
            if (err) throw err //not connected
            console.log('Connected as ID' + connection.threadId)

            //use connection

            connection.query(
              'SELECT * FROM user WHERE id = ?',
              [req.params.id],
              (err, rows) => {
                //when done with the connection, release it
                connection.release()
                if (!err) {
                  res.render('edit-user', {
                    rows,
                    alert: `${first_name} has been updated`,
                  })
                } else {
                  console.log(err)
                }
                console.log('The data from user table: \n', rows)
              }
            )
          })
        } else {
          console.log(err)
        }
        console.log('The data from user table: \n', rows)
      }
    )
  })
}

//delete user
exports.delete = (req, res) => {
  //   pool.getConnection((err, connection) => {
  //     if (err) throw err //not connected
  //     console.log('Connected as ID' + connection.threadId)

  //     //use connection
  //     connection.query(
  //       'DELETE FROM user WHERE id = ?',
  //       [req.params.id],
  //       (err, rows) => {
  //         //when done with the connection, release it
  //         connection.release()
  //         if (!err) {
  //           res.redirect('/')
  //         } else {
  //           console.log(err)
  //         }
  //         console.log('The data from user table: \n', rows)
  //       }
  //     )
  //   })
  pool.getConnection((err, connection) => {
    if (err) throw err
    connection.query(
      'UPDATE user SET status = ? WHERE id = ?',
      ['removed', req.params.id],
      (err, rows) => {
        connection.release() //return the connection to pool
        if (!err) {
          let removedUser = encodeURIComponent('User successfully removed.')
          res.redirect('/?removed=' + removedUser)
        } else {
          console.log(err)
        }
        console.log('The data from beer table are: \n', rows)
      }
    )
  })
}

// view users
exports.viewall = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err //not connected
    console.log('Connected as ID' + connection.threadId)

    //use connection
    connection.query(
      'SELECT * FROM user WHERE id = ?',
      [req.params.id],
      (err, rows) => {
        //when done with the connection, release it
        connection.release()
        if (!err) {
          res.render('view-user', { rows })
        } else {
          console.log(err)
        }
        console.log('The data from user table: \n', rows)
      }
    )
  })
}