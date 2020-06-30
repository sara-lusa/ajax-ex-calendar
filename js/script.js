// Creare un calendario dinamico con le festività.
// Partiamo dal gennaio 2018 dando la possibilità di cambiare
// mese, gestendo il caso in cui l’API non possa ritornare
// festività. Il calendario partirà da gennaio 2018 e si
// concluderà a dicembre 2018 (unici dati disponibili sull’API).

$(document).ready(function() {
  // Variabile che stabilisce la data inziale
  var currentMonth = $('.days').attr('data-month');
  var currentMonthNumber = moment(currentMonth).month();

  // Variabile che stabilisce la data corrente
  var currentMonthMoment = moment(currentMonth).format('MMMM');

  $('.precedente').click(function() {
    if(currentMonthNumber > 0 || currentMonthNumber <= 11) {
      var preMonth = moment(currentMonth).subtract(1, 'months');
      $('.days').attr("data-month", preMonth.format('YYYY-MM-DD'));
    }
  });

  $('.successivo').click(function() {
    if(currentMonthNumber >= 0 || currentMonthNumber < 11) {
      var succMonth = moment(currentMonth).add(1, 'months');
      $('.days').attr("data-month", succMonth.format('YYYY-MM-DD'));
    }
  });

  // HANDLEBARS per completare il mese
  var templateMonth = $('#month-template').html();
  var templateMonthToCompile = Handlebars.compile(templateMonth);

  var contextMonth = {month: currentMonthMoment};
  var templateMonthCompiled = templateMonthToCompile(contextMonth);
  $('.calendario').prepend(templateMonthCompiled);

  // Variabile che definisce la lunghezza del mese corrente
  var lengthMonth = moment(currentMonth).daysInMonth();

  // HANDLBARS per completare la lista
  var templateDays = $('#days-template').html();
  var templateDaysToCompile = Handlebars.compile(templateDays);

  // Ciclo for per riempire e incollare il template copiato
  // Con giorno e mese
  for (var i = 0; i < lengthMonth; i++) {
    var contextDays = {
      day: (i + 1) + ' ' + currentMonthMoment,
    };
    var templateDaysCompiled = templateDaysToCompile(contextDays);

    $('.calendario .days').append(templateDaysCompiled);
  }

  // Chiamata Ajax per scrivere la festività
  $.ajax(
    {
      url: "https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0",
      method: "GET",
      // Aggiungi variabile per stabilire il mese
      data: {month: "0" },
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

});
