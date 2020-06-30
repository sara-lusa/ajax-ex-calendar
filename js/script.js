// Creare un calendario dinamico con le festività.
// Partiamo dal gennaio 2018 dando la possibilità di cambiare
// mese, gestendo il caso in cui l’API non possa ritornare
// festività. Il calendario partirà da gennaio 2018 e si
// concluderà a dicembre 2018 (unici dati disponibili sull’API).

$(document).ready(function() {
  // Variabile che stabilisce la data inziale
  var currentDate = '2018-01-01';
  var currentDateNumber = moment(currentDate).month();

  // Variabile che stabilisce la data corrente
  var currentDateMoment = moment(currentDate).format('MMMM');

  printMonth(currentDate, currentDateMoment);
  printFestivity(currentDateNumber);

  $('.precedente').click(function() {
    if(currentDateNumber > 0 || currentDateNumber <= 11) {
      var currentMonth = $('.days').attr('data-month');
      var currentMonthMoment = moment(currentMonth).subtract(1, 'months');
      // $('.days').attr("data-month", prevMonth.format('YYYY-MM-DD'));
      var prevMonth = currentMonthMoment.format('YYYY-MM-DD');

      printMonth(prevMonth, currentMonthMoment.format('MMMM'));
      printFestivity(currentMonthMoment.month());
    }
  });

  $('.successivo').click(function() {
    if(currentDateNumber >= 0 || currentDateNumber < 11) {
      var currentMonth = $('.days').attr('data-month');
      var currentMonthMoment = moment(currentMonth).add(1, 'months');
      // $('.days').attr("data-month", succMonth.format('YYYY-MM-DD'));
      var succMonth = currentMonthMoment.format('YYYY-MM-DD');

      printMonth(succMonth, currentMonthMoment.format('MMMM'));
      printFestivity(currentMonthMoment.month());
    }
  });



  // FUNCTIONS

  function printMonth(currentDate, currentDateMoment) {
    $('h2').html('');
    $('.days').html('');

    // HANDLEBARS per completare il mese
    var templateMonth = $('#month-template').html();
    var templateMonthToCompile = Handlebars.compile(templateMonth);

    var contextMonth = {month: currentDateMoment};
    var templateMonthCompiled = templateMonthToCompile(contextMonth);
    $('.calendario').prepend(templateMonthCompiled);

    var currentDateFormat = moment(currentDate).format('YYYY-MM-DD');
    $('.days').attr('data-month', currentDateFormat)

    // Variabile che definisce la lunghezza del mese corrente
    var lengthMonth = moment(currentDate).daysInMonth();

    // HANDLBARS per completare la lista
    var templateDays = $('#days-template').html();
    var templateDaysToCompile = Handlebars.compile(templateDays);

    // Ciclo for per riempire e incollare il template copiato
    // Con giorno e mese
    for (var i = 1; i <= lengthMonth; i++) {
      var contextDays = {
        day: i + ' ' + currentDateMoment,
      };
      var templateDaysCompiled = templateDaysToCompile(contextDays);

      $('.calendario .days').append(templateDaysCompiled);
    }
  }


  function printFestivity(currentMonthNumber) {
    // Chiamata Ajax per scrivere la festività
    $.ajax(
      {
        url: "https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0",
        method: "GET",
        // Aggiungi variabile per stabilire il mese
        data: {month: currentMonthNumber },
        success: function(data) {

          if (data.response.length !== 0) {
            for (var i = 0; i < data.response.length; i++) {
              var date = moment(data.response[i].date).format('d MMMM');
              $('.days li').each(function() {

                if($(this).text() === date) {
                  $(this).append(' - ' + data.response[i].name);
                  $(this).addClass('festivity');
                }
              });
            }
          }
        },
        error: function() {
          alert('Si è verificato un errore!');
        }
      }
    );
  }

});
