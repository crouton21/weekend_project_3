const express = require('express');
const router = express.Router();

const pool = require('../modules/pool.js');

router.post('/', function(request, response){
    taskToAdd = request.body;
    const sqlText = `INSERT INTO todo (task, completed, calendar, duedate) VALUES($1, $2, $3, $4)`
    pool.query(sqlText, [taskToAdd.task, false, taskToAdd.calendar, taskToAdd.dueDate])
    .then(function(result){
        console.log('Added task:', result);
        response.send(201);
    })
    .catch(function(error){
        console.log('Error adding task:', error);
        response.sendStatus(500);
    })
});

router.get('/', function(request, response){
    const sqlText = 'SELECT * FROM todo ORDER BY id;';
    pool.query(sqlText)
    .then(function(result){
        response.send(result.rows);
    }).catch(function(error){
        response.sendStatus(500);
    })
})

router.delete('/', function(request, response){
    taskToBeDeleted = request.body.id;
    console.log('taskToBeDeleted', taskToBeDeleted);
    
    const sqlText = `DELETE FROM todo WHERE id=$1`;
    pool.query(sqlText,[taskToBeDeleted])
    .then(function(result){
        console.log('Task deleted:', result);
        response.send(200);
    }).catch(function(error){
        console.log('Error deleting task:', error);
        response.sendStatus(500);
    })
})

router.put('/', function(request, response){
    id = request.body.id;
    const sqlText = `UPDATE todo SET completed=true where id=$1`;
    pool.query(sqlText,[id])
    .then(function(result){
        console.log('task completed:', result);
        response.send(200);
    }).catch(function(error){
        console.log('Error, task not completed:', error);
        response.sendStatus(500);
    })
})

router.put('/redo', function(request, response){
    id = request.body.id;
    const sqlText = `UPDATE todo SET completed=false where id=$1`;
    pool.query(sqlText,[id])
    .then(function(result){
        console.log('task put back:', result);
        response.send(200);
    }).catch(function(error){
        console.log('Error, task not put back:', error);
        response.sendStatus(500);
    })
})

router.post('/calendar', function(request, response){
    calendarToAdd = request.body;
    console.log('calendarToAdd', calendarToAdd);
    
    const sqlText = `INSERT INTO calendars (calendar_name, color) VALUES($1, $2)`
    pool.query(sqlText, [calendarToAdd.calendar, calendarToAdd.color])
    .then(function(result){
        console.log('Added calendar:', result);
        response.send(201);
    })
    .catch(function(error){
        console.log('Error adding calendar:', error);
        response.sendStatus(500);
    })
});

router.get('/calendar', function(request, response){
    console.log('in calendar get');
    const sqlText = 'SELECT * FROM calendars';
    pool.query(sqlText)
    .then(function(result){
        console.log('result', result);
        
        response.send(result.rows);
    }).catch(function(error){
        response.sendStatus(500);
    })
})

router.put('/calendar', function(request, response){
    calendarToDelete = request.body.calendar;
    console.log('in calendar put');
    const sqlText = 'DELETE FROM calendars WHERE calendar_name=$1;'
    pool.query(sqlText, [calendarToDelete])
    .then(function(result){
        console.log('Deleted calendar:', calendarToDelete);
        response.send(200);
    })
    .catch(function(error){
        console.log('Error deleting calendar:', error);
        response.sendStatus(500);
    })
})

module.exports = router;