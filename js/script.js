// Creare un calendario dinamico con le festività.
// Partiamo dal gennaio 2018 dando la possibilità di cambiare
// mese, gestendo il caso in cui l’API non possa ritornare
// festività. Il calendario partirà da gennaio 2018 e si
// concluderà a dicembre 2018 (unici dati disponibili sull’API).

$(document).ready(function() {
  // Aggiungi variabile per stabilire il mese
  var addMonth = 0;

  var currentMonth = '2018-01-01';
  var currentMonthMoment = moment(currentMonth).add(addMonth, 'months').format('MMMM');
  console.log(currentMonthMoment);

  var lengthMonth = moment(currentMonth).add(addMonth, 'months').daysInMonth();
  console.log(lengthMonth);

  var source = $('#days-template').html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < lengthMonth; i++) {
    var context = {
      day: (i + 1) + ' ' + currentMonthMoment,
    };
    var html = template(context);

    $('.calendario .days').append(html);
  }
  $.ajax(
    {
      url: "https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0",
      method: 'GET',
      // Aggiungi variabile per stabilire il mese
      success: function(data) {
        // var currentMonthDays = moment(currentDate).format('MMMM');
        // console.log(currentMonthDays);

        for (var i = 0; i < data.response.length; i++) {
          var date = moment(data.response[i].date).format('d MMMM');

          var source = $('#days-template').html();
          var template = Handlebars.compile(source);

          var context = {
            // day: (i + 1) + ' ' + currentMonthMoment,
            day: date,
            festivity: data.response[i].name,
          };
          var html = template(context);

          $('.calendario .days').append(html);
        }
      },
      error: function() {
        alert('Si è verificato un errore!');
      }
    }
  );

});
