$(document).ready(onReady);

function onReady(){
    getAllTasks();
    $('#addTask').on('click', function(event){
        event.preventDefault();
        addTask();
    });
    $('#viewTasks').on('click','.deleteButton', deleteTask);
    $('#viewTasks').on('click', '.completedButton', taskCompleted);
    $('#viewCompletedTasks').on('click', '.doAgainButton', taskPutBack);
}

function addTask(){
    let newTask = $('#newTask').val();
    $.ajax({
        url: '/task',
        type: 'POST',
        data: {
            'task': newTask
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
    let id = $(this).data('id');
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