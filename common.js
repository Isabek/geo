Schema = {};

Schema.place = new SimpleSchema({
  type: {
    type: String,
    label: "Тип объекта"
  },
  name: {
    type: String,
    label: "Название",
    max: 50
  },
  dangerLevel: {
    type: Number,
    label: "Уровень опасности"
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
});