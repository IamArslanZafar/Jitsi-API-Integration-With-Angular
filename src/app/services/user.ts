export class User {
  room: String = 'arslanRoom'; // set your room name
  name: String = ''; // set your room name

  constructor() {
    this.room = 'Arslan Meeting Room';
  }

  getRoom() {
    return this.room;
  }

  setame(roomName: String) {
    this.room = roomName;
  }

  getName() {
    return this.name;
  }

  setName(name: String) {
    this.name = name;
  }
}
