var dominio = 'http://localhost:8000/';

/* [GET] Obtener listado de tareas */
function llenarTabla(){
    $.get(`${dominio}tareas/`, function (tareas) {
        // console.log(tareas);
        for (const tarea of tareas) {
            $('#tareas tbody').append('<tr id="' + tarea.id + '"> <th scope="row" class="id">' + tarea.id + '</th> <td class="titulo"> <a class="detalle-tarea" href="' + dominio + 'tareas/' + tarea.id + '">' + tarea.titulo + '</a></td><td class="estado">' + tarea.nombre_estado + '</td><td><button type="button" class="btn btn-primary" id="boton-editar"><i class="fa fa-edit"></i></td></tr>');
        }
    }).fail(function (x) {
        console.log("Error en la llamada Ajax :(");
        console.log(x);
    });
}

llenarTabla();

/* [POST] Añadir nuevas tareas */
$('#form-tarea').submit(function (e) {
    e.preventDefault();

    $.post('http://localhost:8000/tareas/', $('#form-tarea').serialize(), function (tarea) {
        $('#tareas').append('<tr id="' + tarea.id + '"> <th scope="row" class="id">' + tarea.id + '</th> <td class="titulo"> <a class="detalle-tarea" href="' + dominio + 'tareas/' + tarea.id + '">' + tarea.titulo + '</a></td><td class="estado">' + tarea.nombre_estado + '</td><td><button type="button" class="btn btn-primary" id="boton-editar"><i class="fa fa-edit"></i></td></tr>');
    });
});

/* Mostrar/ocultar alert en el Titulo*/
$('#titulo-id').keyup(function () {
    var len = $(this).val().length;
    if (len > 5) {
        $("#alert-titulo").hide();
    } else {
        $("#alert-titulo").show();
    }
});

/* Cambiar numero de caracteres y mostrar/ocultar alert en la descripcion */
$('#descripcion-id').keyup(function () {
    var len = $(this).val().length;
    if (len > 10) {
        $("#alert-descripcion").hide();
    } else {
        $("#alert-descripcion").show();
    }
    $('#charNum').text('(' + len + ')');
});

/* 
[GET] Mostrar detalles de una TAREA en especifico  
[PUT] Se actualiza el estado de una tarea
Se actualiza en la tabla
*/
$('.table').on('click', '.detalle-tarea', function (e) {
    e.preventDefault();
    // $(".section-tareas").empty();
    $.get(e.currentTarget.href, function (data) {
        $('.section-tareas .titulo').html(data.id + ' ' + data.titulo);
        $('.section-tareas .descripcion').html(data.descripcion);
        // console.log(data);
        if (data.estado == 0) {
            $('.section-tareas button').text('Pasar a estado En Proceso').show().off();
        } else if (data.estado == 1) {
            $('.section-tareas button').text('Pasar a estado Terminada').show().off();
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
$('#boton-crear-tarea').prop('disabled', true);
$('#titulo-id, #descripcion-id').keyup(function(){
    if($('#titulo-id').val().length > 5 && $('#descripcion-id').val().length > 10){
        $('#boton-crear-tarea').prop('disabled', false);
    }
    else{
        $('#boton-crear-tarea').prop('disabled', true);
    }
});

/* Filtro de búsqueda de tareas por [TITULO] */
$('input[type=search]').keyup(function() {
    var input = $('input[type=search]');
    var filter = input.val().toLowerCase()
    var tr = $('tbody tr')

    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('a')[0]
      if (td) {
        if (td.innerHTML.toLowerCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      } 
    }
});

/* Mostrar modal al presionar botón */

$('#tareas').on('click', '#boton-editar', function(e){
    var id = $(this).parents().eq(1).attr('id');
    $('#myModal .modal-body').html('<div class="form-group"><label for="input-titulo">Título</label><input type="text" class="form-control" id="input-titulo"></div><div id="alert-input-titulo" class="alert alert-danger" role="alert" style="display: none">El título debe tener largo mayor a 5 caracteres</div><div class="form-group"><label for="input-descripcion">Descripción</label><input type="text" class="form-control" id="input-descripcion"></div><div id="alert-input-descripcion" class="alert alert-danger" role="alert" style="display: none">La descripción debe tener largo mayor a 10 caracteres</div>');
    $.get(dominio + 'tareas/' + id, function(data){
        $('#myModal .modal-body #input-titulo').val(data.titulo);
        $('#myModal .modal-body #input-descripcion').val(data.descripcion);
        $('#input-titulo').keyup(function () {
            var len = $(this).val().length;
            if (len > 5) {
                $("#alert-input-titulo").hide();
            } else {
                $("#alert-input-titulo").show();
            }
        }); 
        $('#input-descripcion').keyup(function () {
            var len = $(this).val().length;
            if (len > 10) {
                $("#alert-input-descripcion").hide();
            } else {
                $("#alert-input-descripcion").show();
            }
        });  
        $('#input-titulo, #input-descripcion').keyup(function(){
            if($('#input-titulo').val().length > 5 && $('#input-descripcion').val().length > 10){
                $('#boton-guardar').prop('disabled', false);
            }
            else{
                $('#boton-guardar').prop('disabled', true);
            }
        });
        $('#myModal').modal('show');
        $('#boton-guardar').off().click(function(){
            $.ajax({
              url: dominio + 'tareas/' + data.id + '/',
              type: 'PUT',
              data: 'estado=' + data.estado + '&titulo=' + $('#myModal .modal-body #input-titulo').val() + '&descripcion=' + $('#myModal .modal-body #input-descripcion').val()
            }).done(function(){
                console.log('ok');
            }).fail(function(){
                console.log('fail');
            });
            $('#myModal').modal('hide');
            $('#tareas tbody').empty();
            llenarTabla();
        });
    });
});



