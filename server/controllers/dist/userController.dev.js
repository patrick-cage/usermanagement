"use strict";

var mysql = require('mysql'); //connection pool


var pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.PASS,
  database: process.env.DB_NAME
}); // view users

exports.view = function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; //not connected

    console.log('Connected as ID' + connection.threadId); //use connection

    connection.query('SELECT * FROM user WHERE status ="active"', function (err, rows) {
      //when done with the connection, release it
      connection.release();

      if (!err) {
        var removedUser = req.query.removed;
        res.render('home', {
          rows: rows,
          removedUser: removedUser
        });
      } else {
        console.log(err);
      }

      console.log('The data from user table: \n', rows);
    });
  });
}; //find user by search


exports.find = function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; //not connected

    console.log('Connected as ID' + connection.threadId);
    var searchTerm = req.body.search; //use connection

    connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name  LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], function (err, rows) {
      //when done with the connection, release it
      connection.release();

      if (!err) {
        res.render('home', {
          rows: rows
        });
      } else {
        console.log(err);
      }

      console.log('The data from user table: \n', rows);
    });
  });
};

exports.form = function (req, res) {
  res.render('add-user');
}; //add new user


exports.create = function (req, res) {
  var _req$body = req.body,
      first_name = _req$body.first_name,
      last_name = _req$body.last_name,
      email = _req$body.email,
      phone = _req$body.phone,
      comments = _req$body.comments;
  pool.getConnection(function (err, connection) {
    if (err) throw err; //not connected

    console.log('Connected as ID' + connection.threadId);
    var searchTerm = req.body.search; //use connection

    connection.query('INSERT INTO user SET first_name = ?,last_name = ?, email=?, phone=?, comments=?', [first_name, last_name, email, phone, comments], function (err, rows) {
      //when done with the connection, release it
      connection.release();

      if (!err) {
        res.render('add-user', {
          alert: 'User added successfully'
        });
      } else {
        console.log(err);
      }

      console.log('The data from user table: \n', rows);
    });
  });
}; //edit user


exports.edit = function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; //not connected

    console.log('Connected as ID' + connection.threadId); //use connection

    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], function (err, rows) {
      //when done with the connection, release it
      connection.release();

      if (!err) {
        res.render('edit-user', {
          rows: rows
        });
      } else {
        console.log(err);
      }

      console.log('The data from user table: \n', rows);
    });
  });
}; //update user


exports.update = function (req, res) {
  var _req$body2 = req.body,
      first_name = _req$body2.first_name,
      last_name = _req$body2.last_name,
      email = _req$body2.email,
      phone = _req$body2.phone,
      comments = _req$body2.comments;
  pool.getConnection(function (err, connection) {
    if (err) throw err; //not connected

    console.log('Connected as ID' + connection.threadId); //use connection

    connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ? , phone = ? , comments =? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], function (err, rows) {
      //when done with the connection, release it
      connection.release();

      if (!err) {
        pool.getConnection(function (err, connection) {
          if (err) throw err; //not connected

          console.log('Connected as ID' + connection.threadId); //use connection

          connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], function (err, rows) {
            //when done with the connection, release it
            connection.release();

            if (!err) {
              res.render('edit-user', {
                rows: rows,
                alert: "".concat(first_name, " has been updated")
              });
            } else {
              console.log(err);
            }

            console.log('The data from user table: \n', rows);
          });
        });
      } else {
        console.log(err);
      }

      console.log('The data from user table: \n', rows);
    });
  });
}; //delete user


exports["delete"] = function (req, res) {
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
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], function (err, rows) {
      connection.release(); //return the connection to pool

      if (!err) {
        var removedUser = encodeURIComponent('User successfully removed.');
        res.redirect('/?removed=' + removedUser);
      } else {
        console.log(err);
      }

      console.log('The data from beer table are: \n', rows);
    });
  });
}; // view users


exports.viewall = function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; //not connected

    console.log('Connected as ID' + connection.threadId); //use connection

    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], function (err, rows) {
      //when done with the connection, release it
      connection.release();

      if (!err) {
        res.render('view-user', {
          rows: rows
        });
      } else {
        console.log(err);
      }

      console.log('The data from user table: \n', rows);
    });
  });
};