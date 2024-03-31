import { getData, setData } from './dataStore';
import { checkToken, tokenId } from './other';
import HTTPError from 'http-errors';

/**
 * Creates a channel array in data.channels.
 * @function
 * @param {string} token - Token of user.
 * @param {string} name - Name of channel.
 * @param {boolean} isPublic - Returns 1 for public and 0 for private.
 * @throws 400 error if the length of the name is less than 1 or more than 20.
 * @throws 403 error if token is invalid.
 * @throws 403 error if isPublic is not provided.
 * @returns {integer} channelId - Channel's unique ID.
 */

function channelsCreateV1(token: string, name: string, isPublic: boolean): { error?: string, channelId?: number, token?: string } {
  const data = getData();

  if (name.length < 1) throw HTTPError(400, 'Name too short.');
  if (name.length > 20) throw HTTPError(400, 'Name too long.');
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');

  const authUserId = tokenId(token);

  let user = {
    email: data.users[0].email,
    handleStr: data.users[0].handleStr,
    nameFirst: data.users[0].nameFirst,
    nameLast: data.users[0].nameLast,
    uId: data.users[0].uId,
  };

  for (const i in data.users) {
    if (data.users[i].uId === authUserId) {
      user = {
        email: data.users[i].email,
        handleStr: data.users[i].handleStr,
        nameFirst: data.users[i].nameFirst,
        nameLast: data.users[i].nameLast,
        uId: data.users[i].uId,
      };
      break;
    }
  }

  const currChannelId = data.channels.length + 1;

  data.channels[data.channels.length] = {
    channelId: currChannelId,
    isPublic: isPublic,
    name: name,
    allMembers: [user],
    ownerMembers: [user],
    messages: [],
  };

  setData(data);

  return {
    channelId: currChannelId,
  };
}

/**
 * Lists all channels that have the userId as a member.
 * @function
 * @param {string} token - Token of user.
 * @throws 403 error if token is invalid.
 * @returns {array} channels - Objects of channel, each containing channelId and channel name.
 */

function channelsListV1(token: string) {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');

  const authUserId = tokenId(token);

  const channels = [];
  let counter = 0;
  for (const channel in data.channels) {
    for (const user in data.channels[channel].allMembers) {
      if (data.channels[channel].allMembers[user].uId === authUserId) {
        channels[counter] = {
          channelId: data.channels[channel].channelId,
          name: data.channels[channel].name,
        };
        counter++;
        break;
      }
    }
  }
  return {
    channels: channels
  };
}

/**
 * Lists all channels, including private channels, with their associated details.
 * @function
 * @param {string} token - Token of user.
 * @throws 403 error if token is invalid.
 * @returns {array} channels - Objects of channel, each containing channelId and channel name.
 */

function channelsListallV1(token: string) {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Invalid token');

  const channels = [];
  let counter = 0;
  for (const channel in data.channels) {
    channels[counter] = {
      channelId: data.channels[channel].channelId,
      name: data.channels[channel].name,
    };
    counter++;
  }

  return {
    channels: channels
  };
}

export { channelsCreateV1, channelsListV1, channelsListallV1 };
