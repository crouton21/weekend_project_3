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
    $('#viewTasks').on('click', '.editButton', editButtonClicked);
    $('#viewTasks').on('click', '.saveButton', saveButtonClicked);
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
        getAllCalendars();
      }).fail(function(error){
        console.log(error)
      });
}

function displayAllTasks(listOfTasks){
    console.log('listOfTasks', listOfTasks);
    $('#viewTasks').empty();
    $('#viewCompletedTasks').empty();
    $('#newTask').val('');
    $('#dueDate').val('');
    let notCompletedToAppend;
    let completedToAppend;
    for (todo of listOfTasks){
        if (todo.duedate == ''){
            todo.duedate = "no due date";
        }
        if (todo.completed == 'false'){
            notCompletedToAppend += `<tr class="${todo.calendar}"><td><button data-id="${todo.id}" class="completedButton"></button></td>
                        <td><div id="taskColumn${todo.id}">${todo.task}</div><div><input type="text" id="taskInput${todo.id}" value="${todo.task}" class="hidden"></div></td>
                        <td><div id="dueDateColumn${todo.id}" class=${determineDueDate(todo.duedate)}>${todo.duedate}</div><div><input type="text" id="dueDateInput${todo.id}" value="${todo.duedate}" class="hidden"></div></td>
                        <td><div id=calendarColumn${todo.id}>${todo.calendar}</div>
                        <div><select class="tableSelector hidden" id="calendarSelector${todo.id}" value="${todo.calendar}"></select></div></td>
                        <td><button class="editButton" data-id="${todo.id}">Edit</button><button data-id="${todo.id}" class="saveButton hidden" data-id="${todo.id}">Save</button></td>
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
    if (dueDate==''){
        return 'notOverdue';}
    //find month, day and year from due date
    var dateNumbers = dueDate.replace(/\D/g,'');
    console.log('length of dueDate', dueDate.length);
    var dueMonth = dateNumbers.substring(0,2);
    let dueDay = dateNumbers.substring(2,4);
    let dueYear = dateNumbers.substring(4,8);
    //get today's date
    var q = new Date();
    var month = q.getMonth()+1;
    var day = q.getDate();
    var year = q.getFullYear();
    console.log('current date',month,day,year);
    console.log('due date',dueMonth, dueDay, dueYear);
    console.log(year>dueYear);
    
    
    //compare the dates
    if (year > dueYear){
        console.log('stopping at years');
        return 'notOverdue';
    }
    else{
        if (month < dueMonth){
            console.log('stopping at months');
            return 'notOverdue';
        }
        else{
            if (day < dueDay){
                console.log('stopping at days');
                return 'notOverdue';
            }
            else{
                console.log('stopping at the end');
                return 'overdue';}}}}

function editButtonClicked(){
    $('.editButton').addClass("hidden");
    $('.saveButton').removeClass("hidden");
    let id = $(this).data('id');
    $(`#taskColumn${id}`).addClass("hidden");
    $(`#taskInput${id}`).removeClass("hidden");
    $(`#dueDateInput${id}`).removeClass("hidden");
    $(`#dueDateColumn${id}`).addClass("hidden");
    $(`#calendarSelector${id}`).removeClass("hidden");
    $(`#calendarColumn${id}`).addClass("hidden");
    
}

function saveButtonClicked(){
    //send values to server to update db
    let id = $(this).data('id');
    let newTask = $(`#taskInput${id}`).val();
    let newDueDate = $(`#dueDateInput${id}`).val();
    let newCalendar = $(`#calendarSelector${id}`).val();
    taskToEdit = {
        id: id,
        newTask: newTask,
        newDueDate: newDueDate,
        newCalendar: newCalendar
    }    
    $.ajax({
        url: '/task/edit',
        type: 'PUT',
        data: taskToEdit
      }).done(function(response){
        console.log('Everything is edited:', response);
        getAllTasks();
      }).fail(function(error){
        console.log(error)
      }); 
    $('.editButton').removeClass("hidden");
    $('.saveButton').addClass("hidden");
    $(`#taskInput${id}`).addClass("hidden");
    $(`#taskColumn${id}`).removeClass("hidden");
    $(`#dueDateInput${id}`).addClass("hidden");
    $(`#dueDateColumn${id}`).removeClass("hidden");
    $(`#calendarSelector${id}`).addClass("hidden");
    $(`#calendarColumn${id}`).removeClass("hidden");
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
        $('#whichCalendar2').empty();
        addCalendarToSelector(response);
        changeColorsOfRows(response);
      }).fail(function(error){
        console.log(error)
      });
}

function changeColorsOfRows(listOfCalendars){
    let color;
    for (calendar of listOfCalendars){
        if (calendar.color == 'yellow'){
            color = "#E8A87C";
        }
        else if(calendar.color == 'orange'){
            color = "#E8A87C";
        }
        else if(calendar.color == 'blue'){
            color = "#85DCB";
        }
        else if (calendar.color == 'green'){
            color = "#41B3A3";
        }
        else if (calendar.color == 'purple'){
            color = "#C38D9E"
        }
        else{
            color = "white";
        }
        $(`.${calendar.calendar_name}`).css("background-color", color);
    }
}

function addCalendarToSelector(listOfCalendars){
    let calendarsToAppend;
    console.log('list Of Calendars:', listOfCalendars);
    $('#whichCalendar').empty();
    $('#whichCalendarw2').empty();
    $('.tableSelector').empty();
    //
    for (calendar of listOfCalendars){
        calendarsToAppend+=`<option>${calendar.calendar_name}</option>`;
    }
    $('#whichCalendar').append(calendarsToAppend);
    $('#whichCalendar2').append(calendarsToAppend);
    $('.tableSelector').append(calendarsToAppend);
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

//what happens to task that belongs to deleted calendar?
