Places = new Mongo.Collection('places');

Places.attachSchema(new SimpleSchema({
  type: {
    type: Number,
    label: "Тип объекта",
    allowedValues: [1, 2, 3, 4, 5, 6, 7],
    autoform: {
      options: [
        {label: "Транспорт", value: 1},
        {label: "Учреждение", value: 2},
        {label: "Природа", value: 3},
        {label: "Территория", value: 4},
        {label: "Инфраструктура", value: 5},
        {label: "Человек", value: 6},
        {label: "Неопределённый", value: 7}
      ]
    }
  },
  name: {
    type: String,
    label: "Название",
    max: 50
  },
  dangerLevel: {
    type: Number,
    label: "Уровень опасности",
    allowedValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    autoform: {
      options: [
        {label: 1, value: 1},
        {label: 2, value: 2},
        {label: 3, value: 3},
        {label: 4, value: 4},
        {label: 5, value: 5},
        {label: 6, value: 6},
        {label: 7, value: 7},
        {label: 8, value: 8},
        {label: 9, value: 9},
        {label: 10, value: 10}
      ]
    }
  },
  description: {
    type: String,
    label: "Описание"
  },
  location: {
    type: String,
    label: "Местоположение",
    autoform: {
      afFieldInput: {
        type: 'map',
        autolocate: true,
        height: '400px',
        defaultLat: 42.87244164855117,
        defaultLng: 74.58446502685547
      }
    }
  },
  'location.lat': {
    type: Number,
    decimal: true
  },
  'location.lng': {
    type: Number,
    decimal: true
  }
}));