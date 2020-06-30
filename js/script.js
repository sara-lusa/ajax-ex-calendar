// Creare un calendario dinamico con le festività.
// Partiamo dal gennaio 2018 dando la possibilità di cambiare
// mese, gestendo il caso in cui l’API non possa ritornare
// festività. Il calendario partirà da gennaio 2018 e si
// concluderà a dicembre 2018 (unici dati disponibili sull’API).

$(document).ready(function() {
  // Variabile che stabilisce la data inziale
  var currentDate = moment('2018-01-01');
  // var currentDateNumber = moment(currentDate).month();

  // Variabile che stabilisce la data corrente
  // var currentDateMoment = moment(currentDate).format('MMMM');

  printMonth(currentDate);
  printFestivity(currentDate);

  $('.precedente').click(function() {
    var currentMonth = moment($('.days').attr('data-month'));
    var currentMonthMoment = currentMonth.subtract(1, 'months');

    if(currentMonth.year() === 2018) {
      var prevMonth = currentMonthMoment.format('YYYY-MM-DD');
      var prevMonthMoment = moment(prevMonth);

      printMonth(prevMonthMoment);
      printFestivity(prevMonthMoment);
    } else {
      alert('Mi dispiace puoi navigare solo nel 2018');
    }
  });

  $('.successivo').click(function() {
    var currentMonth = moment($('.days').attr('data-month'));
    var currentMonthMoment = currentMonth.add(1, 'months');

    if(currentMonth.year() === 2018) {
      var succMonth = currentMonthMoment.format('YYYY-MM-DD');
      var succMonthMoment = moment(succMonth);

      printMonth(succMonthMoment);
      printFestivity(succMonthMoment);
    } else {
      alert('Mi dispiace puoi navigare solo nel 2018');
    }
  });



  // FUNCTIONS

  function printMonth(currentDate) {

    // HANDLEBARS per completare il mese
    $('h2.month').text('');
    $('.month').text(currentDate.format('MMMM'));

    var currentDateFormat = currentDate.format('YYYY-MM-DD');
    $('.days').attr('data-month', currentDateFormat)

    // Variabile che definisce la lunghezza del mese corrente
    var lengthMonth = currentDate.daysInMonth();

    // HANDLBARS per completare la lista
    $('.days').html('');

    var templateDays = $('#days-template').html();
    var templateDaysToCompile = Handlebars.compile(templateDays);

    // Ciclo for per riempire e incollare il template copiato
    // Con giorno e mese
    for (var i = 1; i <= lengthMonth; i++) {
      var contextDays = {
        day: i + ' ' + currentDate.format('MMMM'),
      };
      var templateDaysCompiled = templateDaysToCompile(contextDays);

      $('.calendario .days').append(templateDaysCompiled);
    }
  }


  function printFestivity(currentDate) {
    // Chiamata Ajax per scrivere la festività
    $.ajax(
      {
        url: "https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0",
        method: "GET",
        // Aggiungi variabile per stabilire il mese
        data: {month: currentDate.month() },
        success: function(data) {

          // if (data.response.length !== 0) {
            for (var i = 0; i < data.response.length; i++) {
              var date = moment(data.response[i].date).format('D MMMM');

              $('.days li').each(function() {

                if($(this).text() === date) {
                  $(this).append(' - ' + data.response[i].name);
                  $(this).addClass('festivity');
                }
              });
            }
          // }
        },
        error: function() {
          alert('Si è verificato un errore!');
        }
      }
    );
  }

});
