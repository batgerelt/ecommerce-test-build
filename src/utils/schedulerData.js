let _ = require('lodash');
// let fs = require('fs');

const weekdays = [
  { title: 'Даваа', short: 'Дав', dataIndex: 'mo' },
  { title: 'Мягмар', short: 'Мяг', dataIndex: 'tu' },
  { title: 'Лхагва', short: 'Лха', dataIndex: 'we' },
  { title: 'Пүрэв', short: 'Пүр', dataIndex: 'th' },
  { title: 'Баасан', short: 'Баа', dataIndex: 'fr' },
  { title: 'Бямба', short: 'Бям', dataIndex: 'sa' },
  { title: 'Ням', short: 'Ням', dataIndex: 'su' },
];

const partOfDay = [
  { title: 'I', dataIndex: 1 },
  { title: 'II', dataIndex: 2 },
  { title: 'III', dataIndex: 3 },
  { title: 'IV', dataIndex: 4 },
  { title: 'V', dataIndex: 5 },
  { title: 'VI', dataIndex: 6 },
  { title: 'VII', dataIndex: 7 },
];

const universities = ['Хууль зүйн сургууль', 'Эдийн засаг-Бизнесийн удирдлагын сургууль', 'Хүмүүнлэгийн сургууль'];

const lesson = [
  {
    code: 'AAA001',
    type: 'lecture',
  },
  {
    code: 'ABA002',
    type: 'seminar',
  },
  {
    code: 'AAC003',
    type: 'lab',
  },
  {
    code: 'TAA004',
    type: 'referat',
  },
];

const teacher = [
  {
    code: 'ACA001',
  },
  {
    code: 'FAA002',
  },
  {
    code: 'HAJ003',
  },
];

const data = [];

const init = () => {
  const Index = {};
  for (let i = 1; i <= 100; i++) {
    const hallName = Math.floor(Math.random() * 10) + 1;
    if (!Index[hallName]) {
      Index[hallName] = {};
    }
    const day = _.sample(weekdays);
    if (!Index[hallName][day.dataIndex]) {
      Index[hallName][day.dataIndex] = {};
    }
    const time = _.sample(partOfDay);
    if (!Index[hallName][day.dataIndex][time.dataIndex]) {
      let tempObj = {
        id: `room_${i}`,
        hall: {
          university: _.sample(universities),
          name: hallName,
        },
        day,
        time,
        plan_lesson_teacher: {
          teacher: _.sample(teacher),
          lesson: _.sample(lesson),
        },
      };

      data.push(tempObj);
      // console.log('######', JSON.stringify(Index, null, 2));
      Index[hallName][day.dataIndex][time.dataIndex] = true;
    }
  }

  console.log('data: ', JSON.stringify(data, false, 2));
};

export {
  init,
  teacher,
  lesson,
  universities,
  partOfDay,
  weekdays,
};
