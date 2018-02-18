$(document).ready(onReady);

function onReady(){
    getAllTasks();
    getAllCalendars();
    $('#addTask').on('click', function(event){
        event.preventDefault();
        addTask();
    });
    $('#tables').on('click','.deleteButton', deleteTask);
    $('#viewTasks').on('click', '.completedButton', taskCompleted);
    $('#viewCompletedTasks').on('click', '.doAgainButton', taskPutBack);
    $('#addCalendar').on('click', addCalendar);
    $('#deleteCalendar').on('click', updateCalendars);
}

function addTask(){
    let newTask = $('#newTask').val();
    let dueDate = $('#dueDate').val()
    let calendar = $('#whichCalendar').val();
    $.ajax({
        url: '/task',
        type: 'POST',
        data: {
            'task': newTask,
            'dueDate': dueDate,
            'calendar': calendar
        }
      }).done(function(response){
        console.log('task added:', response);
        getAllTasks();
      }).fail(function(error){
        console.log(error)
      });
}

function getAllTasks(){
    $.ajax({
        url: '/task',
        type: 'GET',
      }).done(function(response){
        console.log('get all tasks:', response);
        displayAllTasks(response);
      }).fail(function(error){
        console.log(error)
      });
}

function displayAllTasks(listOfTasks){
    console.log('listOfTasks', listOfTasks);
    $('#viewTasks').empty();
    $('#viewCompletedTasks').empty();
    $('#newTask').val('');
    let notCompletedToAppend;
    let completedToAppend;
    for (todo of listOfTasks){
        if (todo.completed == 'false'){
            notCompletedToAppend += `<tr><td><button data-id="${todo.id}" class="completedButton"></button></td>
                        <td id="taskColumn">${todo.task}</td>
                        <td class=${determineDueDate(todo.duedate)}>${todo.duedate}</td>
                        <td>${todo.calendar}</td>
                        <td><button class="deleteButton" data-id="${todo.id}">Delete</button></td></tr>`;
        }
        else{
            completedToAppend += `<tr><td>${todo.task}</td>
            <td><button class="deleteButton" data-id="${todo.id}">Delete</button></td>
            <td><button class="doAgainButton" data-id="${todo.id}">Do Again</button></td></tr>`
        }
    }
    $('#viewTasks').append(notCompletedToAppend);
    $('#viewCompletedTasks').append(completedToAppend);
}

function determineDueDate(dueDate){
    //check for no due date
    if (dueDate==null){
        return 'notOverdue';}
    //find month, day and year from due date
    var dateNumbers = dueDate.replace(/\D/g,'');
    if (dateNumbers.length != 8){
        alert ('Please enter date in the format mm/dd/yyyy');
        return;
    }
    var dueMonth = dateNumbers.substring(0,2);
    let dueDay = dateNumbers.substring(2,4);
    let dueYear = dateNumbers.substring(4,8);
    //get today's date
    var q = new Date();
    var month = q.getMonth()+1;
    var day = q.getDate();
    var year = q.getFullYear();
    //compare the dates
    if (year > dueYear){
        return 'overdue';
    }
    else{
        if (month > dueMonth){
            return 'overdue';
        }
        else{
            if (day > dueDay){
                return 'overdue';
            }
            else{
                return 'notOverdue';
            }
        }
    }   
}

function deleteTask(){
    if (confirm('Are you sure you want to delete this task?')) {
    let id = $(this).data('id');
    console.log('id', id);
    
    $.ajax({
      type: 'delete',
      url: '/task',
      data: {
          'id': id
        }
    }).done(function(response){
      console.log('Task Deleted', response);
      getAllTasks();
    }).fail(function(error){
      console.log(error)
    });
    }
}

function taskCompleted(){
    let id = $(this).data('id');
    $.ajax({
        url: '/task',
        type: 'PUT',
        data: {
            'id': id
        }
      }).done(function(response){
        console.log('task completed:', response);
        getAllTasks();
      }).fail(function(error){
        console.log(error)
      }); 
}

function taskPutBack(){
    let id = $(this).data('id');
    $.ajax({
        url: '/task/redo',
        type: 'PUT',
        data: {
            'id': id
        }
      }).done(function(response){
        console.log('task completed:', response);
        getAllTasks();
      }).fail(function(error){
        console.log(error)
      }); 
}

function addCalendar(){
    let newCalendar = $('#newCalendar').val();
    let colorOfCalendar = $('#whichColor').val();
    $.ajax({
        url: '/task/calendar',
        type: 'POST',
        data: {
            'calendar': newCalendar,
            'color': colorOfCalendar
        }
      }).done(function(response){
        console.log('calendar added:', response);
        getAllCalendars();
      }).fail(function(error){
        console.log(error)
      });
}

function getAllCalendars(){
    $.ajax({
        url: '/task/calendar',
        type: 'GET',
      }).done(function(response){
        console.log('get all calendars:', response);
        addCalendarToSelector(response);
      }).fail(function(error){
        console.log(error)
      });
}

function addCalendarToSelector(listOfCalendars){
    let calendarsToAppend;
    console.log('list Of Calendars:', listOfCalendars);
    $('#whichCalendar').empty();
    $('#whichCalendarw2').empty();
    for (calendar of listOfCalendars){
        calendarsToAppend+=`<option>${calendar.calendar_name}</option>`;
    }
    $('#whichCalendar').append(calendarsToAppend);
    $('#whichCalendar2').append(calendarsToAppend);
}

function updateCalendars(){
    let calendarToDelete =  $('#whichCalendar2').val();
    $.ajax({
        url: '/task/calendar',
        type: 'PUT',
        data: {
            'calendar': calendarToDelete
        }
      }).done(function(response){
        console.log('calendar deleted', response);
        getAllCalendars();
      }).fail(function(error){
        console.log(error)
      });
}

//populate the calendar column with a select so you can change the calendar
//what happens to task that belongs to deleted calendar?
//be able to change the due date
//be able to edit the task