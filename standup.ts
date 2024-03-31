import { getData, setData } from './dataStore';
import { checkChannelId, checkToken, tokenId, checkUserInChannel, whichUser } from './other';
import HTTPError from 'http-errors';

/**
 * Initiate a stand-up
 * @function
 * @param {string} token - Token of user.
 * @param {integer} channelId - Id of desired channel
 * @param {integer} length - amount of seconds you want it to last
 * @throws 400 error if channelId does not refer to a valid channel.
 * @throws 400 error if length is negative.
 * @throws 403 error if token is invalid.
 * @throws 400 error if channel already in session
 * @throws 403 error if user is not in channel
 * @returns {integer} timeFinish - time in seconds
 */
export function standupStart(token: string, channelId: number, length: number) {
  const data = getData();
  const uId = tokenId(token);
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token!');
  if (!checkChannelId(channelId)) throw HTTPError(400, "Channel doesn't exist!");
  if (length < 0) throw HTTPError(400, 'Length is negative!');
  if (checkActive(channelId)) throw HTTPError(400, 'Channel already in session!');
  if (!checkUserInChannel(uId, channelId)) throw HTTPError(403, 'User not in channel!');
  const timetoEnd = Math.floor((new Date()).getTime() / 1000) + length;

  data.standups.push({
    channelId: channelId,
    message: '',
    timeFinish: timetoEnd,
  });

  setData(data);

  setTimeout(finishStandup, length * 1000, token, timetoEnd, channelId);

  return { timeFinish: timetoEnd };
}
/**
 * Check if a channel is in stand-up
 * @function
 * @param {string} token - Token of user.
 * @param {integer} channelId - Id of desired channel
 * @throws 400 error if channelId does not refer to a valid channel.
 * @throws 403 error if token is invalid.
 * @throws 403 error if user is not in channel
 * @returns {boolean} isactive - true if active, false if not
 * @returns {integer} timeFinish - Time in seconds that standup will finish
 */
export function checkstandupActive(token: string, channelId: number) {
  const data = getData();
  const uId = tokenId(token);
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token!');
  if (!checkChannelId(channelId)) throw HTTPError(400, "Channel doesn't exist!");
  if (!checkUserInChannel(uId, channelId)) throw HTTPError(403, 'User not in channel!');
  for (const i in data.standups) {
    if (data.standups[i].channelId === channelId) {
      return { isActive: true, timeFinish: data.standups[i].timeFinish };
    } else {
      continue;
    }
  }
  return { isActive: false, timeFinish: null };
}
/**
 * Check if a channel is in standup
 * @function
 * @param {integer} channelId - Id of desired channel
 * @returns {boolean} true if in standup, false otherwise
 */
function checkActive(channelId: number) {
  const data = getData();
  for (const i in data.standups) {
    if (data.standups[i].channelId === channelId) {
      return true;
    } else {
      continue;
    }
  }
  return false;
}
/**
 * Returns the index of a channelId's standup in the standup array
 * @function
 * @param {integer} channelId - Id of desired channel
 * @returns {integer} i - index of the channel
 */
function findIndex(channelId: number) {
  const data = getData();
  for (const i in data.standups) {
    if (data.standups[i].channelId === channelId) {
      return parseInt(i);
    } else {
      continue;
    }
  }
}
/**
 * Send message to a stand-up session
 * @function
 * @param {string} token - Token of user.
 * @param {integer} channelId - Id of desired channel
 * @param {string} message - desired message
 * @throws 400 error if channelId does not refer to a valid channel.
 * @throws 400 error if messagelength is invalid.
 * @throws 403 error if token is invalid.
 * @throws 400 error if channel is not in session
 * @throws 403 error if user is not in channel
 * @returns {}
 */
export function standupSend(token: string, channelId: number, message: string) {
  const data = getData();
  const uId = tokenId(token);
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token!');
  if (!checkChannelId(channelId)) throw HTTPError(400, "Channel doesn't exist!");
  if (!checkActive(channelId)) throw HTTPError(400, 'No standup!');
  if (message.length > 1000) throw HTTPError(400, 'Message length too long');
  if (message.length === 0) throw HTTPError(400, 'Message too short');
  if (!checkUserInChannel(uId, channelId)) throw HTTPError(403, 'User not in channel!');

  const index = findIndex(channelId);
  const uIndex = whichUser(token);
  let string = data.users[uIndex].handleStr;
  string += ': ';
  string += message;

  if (data.standups[index].message.length === 0) {
    data.standups[index].message = string;
  } else {
    data.standups[index].message += '\n' + string;
  }

  setData(data);
  return {};
}
/**
 * Finishes the stand-up
 * @function
 * @param {string} token - Token of user.
 * @param {integer} channelId - Id of desired channel
 * @param {integer} timetoEnd - Finish time
 * @returns
 */
function finishStandup(token: string, timetoEnd: number, channelId: number) {
  const data = getData();
  const index = findIndex(channelId);
  const authUserId = tokenId(token);
  const currMessageId = Math.floor(Math.random() * 1000000000000);
  if (data.standups[index].message.length === 0) {
    data.standups.splice(index, 1);
    setData(data);
    return;
  }
  for (let i = 0; i < data.channels.length; i++) {
    if (data.channels[i].channelId === channelId) {
      data.channels[i].messages.unshift({
        messageId: currMessageId,
        uId: authUserId,
        message: data.standups[index].message,
        timeSent: Math.floor((new Date()).getTime() / 1000),
      });
      break;
    } else {
      continue;
    }
  }
  data.standups.splice(index, 1);
  setData(data);
}
