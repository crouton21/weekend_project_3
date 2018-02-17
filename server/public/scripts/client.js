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
}

function addTask(){
    let newTask = $('#newTask').val();
    let calendar = $('#whichCalendar').val();
    
    $.ajax({
        url: '/task',
        type: 'POST',
        data: {
            'task': newTask,
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
    $('#viewTasks').empty();
    $('#viewCompletedTasks').empty();
    $('#newTask').val('');
    let notCompletedToAppend;
    let completedToAppend;
    for (todo of listOfTasks){
        if (todo.completed == 'false'){
            notCompletedToAppend += `<tr><td><button data-id="${todo.id}" class="completedButton"></button></td>
                        <td>${todo.task}</td>
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
    $('#whichCalendar').empty();
    for (calendar of listOfCalendars){
        calendarsToAppend+=`<option>${calendar.calendar_name}<option>`;
    }
    $('#whichCalendar').append(calendarsToAppend);
}

//add a due date