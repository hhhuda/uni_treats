const fs = require('fs');

type react = {
  reactId: number,
  uIds: number[],
  isThisUserReacted: boolean,
}

type notification = {
  channelId: number,
  dmId: number,
  notificationMessage: string,
}

type userNotifications = {
  uId: number,
  notifications: notification[],
}

type message = {
  messageId: number,
  uId: number,
  message: string,
  timeSent: number,
  isPinned?: boolean,
  reacts?: react[],
}

type user = {
  email: string,
  uId: number,
  password?: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string,
  tokens?: string[],
  resetcode?: number,
}

type dm = {
  members: user[],
  owner?: number,
  dmId: number,
  name: string,
  messages?: message[],
  isPinned?: boolean,
  reacts?: react[],
}

type channel = {
  channelId: number,
  isPublic: boolean,
  name: string,
  allMembers: user[],
  ownerMembers: user[],
  messages: message[],
}

type standup = {
  channelId: number,
  message: string,
  timeFinish: number,
}

type dataStore = {
  users: user[],
  channels: channel[],
  dms: dm[],
  standups: standup[],
  globalowners: number[],
  notifications: userNotifications[],
};

let data: dataStore = {
  users: [],
  channels: [],
  dms: [],
  standups: [],
  globalowners: [],
  notifications: [],
};

// Use get() to access the data
function getData() {
  const fileName = './currentData.json';

  data = JSON.parse(fs.readFileSync(fileName));

  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData:dataStore) {
  data = newData;

  fs.writeFileSync('./currentData.json', JSON.stringify(newData, null, 2));
}

export { getData, setData, message };
