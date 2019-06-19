
import moment from 'moment';

moment.defineLocale('mn-MN', {
  months: ['1 сар', '2 сар', '3 сар', '4 сар', '5 сар', '6 сар', '7 сар', '8 сар', '9 сар', '10 сар', '11 сар', '12 сар'],
  monthsShort: ['1 сар', '2 сар', '3 сар', '4 сар', '5 сар', '6 сар', '7 сар', '8 сар', '9 сар', '10 сар', '11 сар', '12 сар'],
  weekdays: 'Ням_Даваа_Мягмар_Лхагва_Пүрэв_Баасан_Бямба'.split('_'),
  weekdaysShort: 'Ням_Дав_Мяг_Лха_Пүр_Баа_Бям'.split('_'),
  weekdaysMin: 'Ням_Дав_Мяг_Лха_Пүр_Баа_Бям'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY/MM/DD',
    LL: 'YYYY оны M-р сарын D-нд',
    LLL: 'YYYY оны M-р сарын D-ны HH:mm цагт',
    LLLL: 'YYYY оны M-р сарын D-ны dddd HH:mm цагт',
    l: 'YYYY/MM/DD',
    ll: 'YYYY оны M-р сарын D-нд',
    lll: 'YYYY оны M-р сарын D-ны HH:mm цагт',
    llll: 'YYYY оны M-р сарын D-ны dddd HH:mm цагт',
  },
  meridiemParse: /Өглөө|Орой/i,
  isPM(input) {
    return input === 'Орой';
  },
  meridiem(hour) {
    if (hour < 12) {
      return 'Өглөө';
    }
    return 'Орой';
  },
  calendar: {
    sameDay: '[Өнөөдөр] LT',
    nextDay: '[Маргайш] LT',
    nextWeek: '[Дараа долоо хоногт]dddd LT',
    lastDay: '[Өчигдөр] LT',
    lastWeek: '[Өнгөрсөн долоо хоногт]dddd LT',
    sameElse: 'L',
  },
  dayOfMonthOrdinalParse: /\d{1,2}Өдөр/,
  ordinal(number, period) {
    switch (period) {
      case 'd':
      case 'D':
      case 'DDD':
        return `${number} өдөр`;
      default:
        return number;
    }
  },
  relativeTime: {
    future: '%s-н дараа',
    past: '%s-н өмнө',
    s: 'хэдэн хормын өмнө',
    m: '1 минут',
    mm: '%d минут',
    h: '1 цаг',
    hh: '%d цаг',
    d: '1 Өдөр',
    dd: '%d Өдөр',
    M: '1 сар',
    MM: '%d сар',
    y: '1 жил',
    yy: '%d жил',
  },
});

