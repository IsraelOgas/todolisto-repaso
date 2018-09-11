var dominio = 'http://localhost:8000/';

/* [GET] Obtener listado de tareas */
$.get(`${dominio}tareas/`, function (tareas) {
    console.log(tareas);

    for (const tarea of tareas) {
        $('#tareas').append('<tr id="' + tarea.id + '"> <th scope="row" class="id">' + tarea.id + '</th> <td class="titulo"> <a class="detalle-tarea" href="' + dominio + 'tareas/' + tarea.id + '">' + tarea.titulo + '</a></td><td class="estado">' + tarea.nombre_estado + '</td> </tr>')
    }
}).fail(function (x) {
    console.log("Error en la llamada Ajax :(");
    console.log(x);
});

/* [POST] Añadir nuevas tareas */
$('#form-tarea').submit(function (e) {
    e.preventDefault();
    // var len_title = $('#titulo_id').val().length;
    // var len_description = $('#descripcion_id').val().length;

    $.post('http://localhost:8000/tareas/', $('#form-tarea').serialize(), function (tarea) {
        $('#tareas').append('<tr id="' + tarea.id + '"> <th scope="row" class="id">' + tarea.id + '</th> <td class="titulo"> <a class="detalle-tarea" href="' + dominio + 'tareas/' + tarea.id + '">' + tarea.titulo + '</a></td><td class="estado">' + tarea.nombre_estado + '</td> </tr>')
    });
});

/* Mostrar/ocultar alert en el Titulo*/
$('#titulo_id').keyup(function () {
    var len = $(this).val().length;

    if (len > 5) {
        $("#alert-titulo").hide();
    } else {
        $("#alert-titulo").show();
    }
});

/* Cambiar numero de caracteres y mostrar/ocultar alert en la descripcion */
$('#descripcion_id').keyup(function () {
    var len = $(this).val().length;

    if (len > 10) {
        $("#alert-descripcion").hide();
    } else {
        $("#alert-descripcion").show();
    }
    $('#charNum').text('(' + len + ')');
});


// $('input').on('blur keyup', function() {
//     var len_title = $('#titulo_id').val().length;
//     var len_description = $('#descripcion_id').val().length;

//     if (len_title >= 5 && len_description >= 10) {
//         $('.add-tarea').prop('disabled', false);  
//     } else {
//         $('.add-tarea').prop('disabled', 'disabled');
//     }
// });

/*
$(function() {
    $('.add-tarea').prop('disabled', true);

    $('#titulo_id').keyup(function () {
        if($(this).val() > 5) {
            $('.add-tarea').prop('disabled', false);
        }
    });
});
*/

/* 
[GET] Mostrar detalles de una TAREA en especifico  
[PUT] Se actualiza el estado de una tarea
Se actualiza en la tabla
*/
$('.table').on('click', '.detalle-tarea', function (e) {
    e.preventDefault();
    // $(".section-tareas").empty();
    console.log(e.currentTarget.href);
    $.get(e.currentTarget.href, function (data) {
        $('.section-tareas .titulo').html(data.id + ' ' + data.titulo);
        $('.section-tareas .descripcion').html(data.descripcion);
        console.log(data);
        if (data.estado == 0) {
            $('.section-tareas button').html('Pasar a estado En Proceso').show().off();
        } else if (data.estado == 1) {
            $('.section-tareas button').html('Pasar a estado Terminada').show().off();
        } else {
            $('.section-tareas button').hide();
        }
        $('.section-tareas button').click(function(){
            $.get(e.currentTarget.href, function (data){
                if (data.estado == 0) {
                    $.ajax({
                      url: dominio + 'tareas/' + data.id + '/',
                      type: 'PUT',
                      data: 'estado=1&titulo=' + data.titulo + '&descripcion=' + data.descripcion
                    }).done(function(){
                        console.log('ok');
                    }).fail(function(){
                        console.log('fail');
                    });
                    $('.section-tareas button').html('Pasar a estado Terminada');
                    $("#tareas #" + data.id + " .estado").html("En Proceso");   
                } else {
                    $.ajax({
                      url: dominio + 'tareas/' + data.id + '/',
                      type: 'PUT',
                      data: 'estado=2&titulo=' + data.titulo + '&descripcion=' + data.descripcion
                    }).done(function(){
                        console.log('ok');
                    }).fail(function(){
                        console.log('fail');
                    });
                    $('.section-tareas button').hide();
                    $("#tareas #" + data.id + " .estado").html("Terminada");
                }
            });
        });
    });
});

/* Activar botón Crear Tarea cuando se cumplan condiciones en formulario */

$('#boton_crear_tarea').prop('disabled', true);

$('#titulo_id, #descripcion_id').keyup(function(){
    if($('#titulo_id').val().length > 5 && $('#descripcion_id').val().length > 10){
        $('#boton_crear_tarea').prop('disabled', false);
    }
    else{
        $('#boton_crear_tarea').prop('disabled', true);
    }
});




