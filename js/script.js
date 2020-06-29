// Creare un calendario dinamico con le festività.
// Partiamo dal gennaio 2018 dando la possibilità di cambiare
// mese, gestendo il caso in cui l’API non possa ritornare
// festività. Il calendario partirà da gennaio 2018 e si
// concluderà a dicembre 2018 (unici dati disponibili sull’API).

$(document).ready(function() {
  // Variabile per cambiare il mese
  var addMonth = 0;

  // Variabile che stabilisce la data inziale
  var currentMonth = '2018-01-01';
  // Variabile che stabilisce la data corrente
  var currentMonthMoment = moment(currentMonth).add(addMonth, 'months').format('MMMM');

  // HANDLEBARS per completare il mese
  var templateMonth = $('#month-template').html();
  var templateMonthToCompile = Handlebars.compile(templateMonth);

  var contextMonth = {month: currentMonthMoment};
  var templateMonthCompiled = templateMonthToCompile(contextMonth);
  $('.calendario').prepend(templateMonthCompiled);

  // Variabile che definisce la lunghezza del mese corrente
  var lengthMonth = moment(currentMonth).add(addMonth, 'months').daysInMonth();

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
      // data: {month: 'addMonth'},
      success: function(data) {

        if (data.response.length !== 0) {
          for (var i = 0; i < data.response.length; i++) {
            var date = moment(data.response[i].date).format('d MMMM');
            console.log(date);
            $('.days li').each(function() {

              console.log($(this).text());
              console.log(date);
              if($(this).text() === date) {
                // console.log('sono dentro');
                $(this).append(' - ' + data.response[i].name);
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
