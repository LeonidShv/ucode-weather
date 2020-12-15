function status(response) {  
    if (response.status >= 200 && response.status < 300) {  
      return Promise.resolve(response)  
    } else {  
      return Promise.reject(new Error(response.statusText))  
    }  
  }
  
  function json(response) {  
    return response.json();
  }
  
  let url = 'https://api.openweathermap.org/data/2.5/forecast?q=kiev&appid=b426a72becfdc90d6fbc62b75fe3ef15&units=metric';

  fetch(url)  
    .then(status)  
    .then(json)  
    .then(function(data) {  
      main(data);
    }).catch(function(error) {  
      console.log('Request failed', error);  
    });

let weatherItemIndex = 0;
let weekWeather;
let weatherItems;

function main(weather) {
  weekWeather = makeStorage(weather);
  week.innerHTML = makeWeekList(weekWeather);
  makeDayList(weekWeather[0]);
  weatherItems = document.querySelectorAll('.weather__item');
  weatherItems.forEach((day) => day.addEventListener('click', chooseDay));
  chooseDay();
}

function chooseDay(e) {
  if (!e) {
    weatherItems[0].classList.add('dayActive');
    return;
  }

  let day = this.classList[1];
  weatherItems.forEach((day) => day.classList.remove('dayActive'));

  this.classList.add('dayActive');
  makeDayList(weekWeather[day]);
}

let week = document.querySelector('.weather__week');
let weatherChoosen = document.querySelector('.weather__choosen');
let weatherToday = document.querySelector('.weather__today');
let weatherDetails = document.querySelector('.weather__details');

function makeWeekList(weekWeather) {
  let htmlElements = '';

  for (let i = 0; i < weekWeather.length; i++) {
    htmlElements += makeWeekItem(weekWeather[i]);
  }

  return htmlElements;
}

function makeWeekItem(dayWeather) {
  let minMax = findMinMax(dayWeather);
  let iconInDay = findIcon(dayWeather, false);
  let date = findDate(dayWeather);

  return `
  <div class="weather__item ${weatherItemIndex++}">
      <p class="weather__day">${date[0]}</p>
      <p class="weather__date">${date[1]}</p>
      <p class="weather__month">${date[2]}</p>
      <img src="assets/images/${iconInDay}.png" alt="icon weather" class="weather__icon">
      <div class="weather__info">
          <p class="info__text">min</p>
          <p class="info__text">max</p>
          <p class="info__numb">${minMax[0]}</p>
          <p class="info__numb">${minMax[1]}</p>
      </div>
  </div>
  `;
}

function makeStorage(weather) {
  let week = [[]];

  for (let i = 0, k = 0; i < weather.list.length; i++) {
    if (week[k].length === 8 || weather.list[i].dt_txt.split(' ')[1].split(':')[0] == '00') {
      k++;
      week.push([]);
    }

    week[k].push(weather.list[i]);
  }

  return week;
}

function findMinMax(dayWeather) {
  let max = dayWeather.reduce((prev, day) => {
    if (day.main.temp_max > prev) {
      return day.main.temp_max;
    } else {
      return prev;
    }
  }, -Infinity);

  let min = dayWeather.reduce((prev, day) => {
    if (day.main.temp_max < prev) {
      return day.main.temp_max;
    } else {
      return prev;
    }
  }, Infinity);

  return [min, max];
}

function findIcon(dayWeather, key) {
  let middle = Math.floor(dayWeather.length / 2);

  if (!key) {
    return dayWeather[middle].weather[0].icon;
  }
}

let monthes = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
let days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

function findDate(dayWeather) {
  let date = new Date(dayWeather[0].dt_txt);
  let numbDay = date.getDay();
  let numbMonth = date.getMonth();
  let dateDay = date.getDate();
  
  return [days[numbDay], dateDay, monthes[numbMonth]];
}

/*table*/
function makeDayList(choosenDay) {
  let htmlElements = '';
  htmlElements += makeWeatrherToday(choosenDay);
  htmlElements += makeTableWeather(choosenDay);
  weatherChoosen.innerHTML = htmlElements;
}

function makeWeatrherToday(day) {
  let date = findDate(day);
  return `
  <div class="weather__today">
      <p class="choosen__day">${date[0]}</p>
      <p class="choosen__date">${date[1]}</p>
      <p class="choosen__month">${date[2]}</p>
  </div>
  `;
}

function makeStorageTable(choosenDay) {
  let storage = [];
  let times = ['time'],
  icons = ['icon'],
  temperatures = ['Температура'],
  feelTemperatures = ['Ощущение'],
  pressures = ['Давлениеб мм'],
  humidityes = ['Влажность, %'],
  winds = ['Ветер, м/сек'];

  for (let i = 1; i <= choosenDay.length; i++) {
    times[i] = choosenDay[i-1].dt_txt.split(' ')[1].slice(0, 5);
    icons[i] = choosenDay[i-1].weather[0].icon;
    temperatures[i] = choosenDay[i-1].main.temp;
    feelTemperatures[i] = choosenDay[i-1].main.feels_like;
    pressures[i] = choosenDay[i-1].main.pressure;
    humidityes[i] = choosenDay[i-1].main.humidity;
    winds[i] = choosenDay[i-1].wind.speed;
  }
  
  storage.push(times, icons, temperatures, feelTemperatures, pressures, humidityes, winds);
  return storage;
}

function makeFirstRow(storageTable) {
  let tableHtml = `
    <table class="weather__details">
      <tr class="details__row">
      <td class="details__item"></td>
  `;

  for (let i = 1; i < storageTable[0].length; i += 2) {
    switch (storageTable[0][i]) {
      case '00:00':
      case '03:00':
        tableHtml += `<td class="details__item" colspan="2">ночь</td>`;
        break;
      case '06:00':
      case '09:00':
        tableHtml += `<td class="details__item" colspan="2">утро</td>`;
        break;
      case '12:00':
      case '15:00':
        tableHtml += `<td class="details__item" colspan="2">день</td>`;
        break;
      case '18:00':
      case '21:00':
        tableHtml += `<td class="details__item" colspan="2">вечер</td>`;
        break;
    }
  }

  tableHtml += '</tr>';
  return tableHtml;
}

function makeTableWeather(dayWeather) {
  let storageTable = makeStorageTable(dayWeather);
  let tableHtml = makeFirstRow(storageTable);

  for (let i = 0; i < storageTable.length; i++) {
    let row = '<tr class="details__row">';
    for (let j = 0; j < storageTable[i].length; j++) {    
      if (j === 0) {
        if (storageTable[i][j] === 'time' || storageTable[i][j] === 'icon') {
          row += `<td class="details__title"></td>`;
          continue;
        }
        
        row += `<td class="details__title">${storageTable[i][j]}</td>`;
        continue;
      }

      if (storageTable[i][0] === 'icon') {
        row += `
        <td class="details__title">
          <img src="assets/images/${storageTable[i][j]}.png" alt="icon weather" class="weather__icon">
        </td>`;

        continue;
      } else if((storageTable[i][0] === 'Температура' || storageTable[i][0] === 'Ощущение') && j !== 0) {
        row += `
        <td class="details__item">${storageTable[i][j]}<sup class="details__sup">o</sup></td>
        `;
        continue;
      }

      row += `<td class="details__item">${storageTable[i][j]}</td>`;
    }

    row += '</tr>';
    tableHtml += row;
  }

  return tableHtml + '</table>';
}
