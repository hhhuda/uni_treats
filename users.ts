import { getData, setData } from './dataStore';
import { checkUserId, checkToken, tokenId, checkEmail } from './other';
import validator from 'validator';
import HTTPError from 'http-errors';

/**
 * Gives a valid user's information, including their userId, email, first name, last name, and handle.
 * @function
 * @param {string} token - Token of user.
 * @param {integer} uId - User ID of user.
 * @throws 400 error if uId is invalid.
 * @throws 403 error if token is invalid.
 * @returns {object} user - User's uId, email, nameFirst, nameLast, and handleStr.
 */

export function userProfileV1(token: string, uId: number) {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');
  if (!checkUserId(uId)) throw HTTPError(400, 'uId is invalid.');

  let selectedUser = 0;
  for (const user in data.users) {
    if (data.users[user].uId === uId) {
      selectedUser = parseInt(user);
    }
  }

  return {
    user: {
      uId: data.users[selectedUser].uId,
      email: data.users[selectedUser].email,
      nameFirst: data.users[selectedUser].nameFirst,
      nameLast: data.users[selectedUser].nameLast,
      handleStr: data.users[selectedUser].handleStr,
    }
  };
}

/**
 * Updates the authorised user's first and last name.
 * @function
 * @param {string} token - Token of user.
 * @throws 403 error if token is invalid.
 * @returns {array} users - Objects of user, each containing uId, email, nameFirst, nameLast, and handleStr.
 */

export function usersAllV1(token: string) {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');

  const users = [];
  let counter = 0;
  for (const user in data.users) {
    users[counter] = {
      uId: data.users[user].uId,
      email: data.users[user].email,
      nameFirst: data.users[user].nameFirst,
      nameLast: data.users[user].nameLast,
      handleStr: data.users[user].handleStr,
    };
    counter++;
  }

  return { users };
}

/**
 * Updates the authorised user's first and last name.
 * @function
 * @param {string} token - Token of user.
 * @param {string} nameFirst - First name of user.
 * @param {string} nameLast - Last name of user.
 * @throws 403 error if token is invalid.
 * @throws 400 error if length of nameFirst is not between 1 and 50 characters inclusive.
 * @throws 400 error if length of nameLast is not between 1 and 50 characters inclusive.
 * @returns {}.
 */

export function userProfileSetnameV1(token: string, nameFirst: string, nameLast: string) {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');
  if (nameFirst.length < 1 || nameFirst.length > 50 || nameLast.length < 1 || nameLast.length > 50) throw HTTPError(400, 'Input is invalid.');

  const authUserId = tokenId(token);

  for (const user of data.users) {
    if (user.uId === authUserId) {
      user.nameFirst = nameFirst;
      user.nameLast = nameLast;
      break;
    }
  }

  setData(data);
  return {};
}

/**
 * Updates the authorised user's email address.
 * @function
 * @param {string} token - Token of user.
 * @param {string} email - Email of user.
 * @throws 400 error if email is invalid.
 * @throws 400 error if email address is already being used by another user.
 * @throws 403 error if token is invalid.
 * @returns {}.
 */

export function userProfileSetemailV1(token: string, email: string) {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');
  if (validator.isEmail(email) === false || checkEmail(email) === true) throw HTTPError(400, 'Input is invalid.');

  const authUserId = tokenId(token);

  for (const user of data.users) {
    if (user.uId === authUserId) {
      user.email = email;
      break;
    }
  }

  setData(data);
  return {};
}

/**
 * Updates the authorised user's handle.
 * @function
 * @param {string} token - Token of user.
 * @param {string} handleStr - Handle of user.
 * @throws 400 error if length of handleStr is not between 3 and 20 characters inclusive.
 * @throws 400 error if handleStr contains characters that are not alphanumeric.
 * @throws 400 error if the handle is already used by another user.
 * @throws 403 error if the token is invalid.
 */

export function userProfileSethandleV1(token: string, handleStr: string) {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');
  if (handleStr.match(/^[0-9A-Za-z]+$/) === null || handleStr.length < 3 || handleStr.length > 20) throw HTTPError(400, 'Input is invalid.');

  for (const user of data.users) {
    if (user.handleStr === handleStr) throw HTTPError(400, 'Handle is taken.');
  }

  const authUserId = tokenId(token);

  for (const user of data.users) {
    if (user.uId === authUserId) {
      user.handleStr = handleStr;
      break;
    }
  }

  setData(data);
  return {};
}

/**
 * Gets the notifications for the given user.
 * @function
 * @param {string} token - Token of user.
 * @throws 403 error if the token is invalid.
 * @returns {notification[]} data.notifications[i].notifications - the notifications of the given user.
 * @returns [] if the user has no notifications.
 */

export function getNotifications(token: string) {
  const authUserId = tokenId(token);
  if (authUserId === -1) throw HTTPError(403, 'Invalid token.');

  const data = getData();

  for (let i = 0; i < data.notifications.length; i++) {
    if (data.notifications[i].uId === authUserId) {
      if (data.notifications[i].notifications.length < 20) {
        return data.notifications[i].notifications;
      } else {
        return data.notifications[i].notifications.slice(0, 20);
      }
    }
  }

  return [];
}

/**
 * Adds the notification to the user's notification array.
 * @function
 * @param {string} reason - type of notification.
 * @param {number} uId - Id of user.
 * @param {string} userHandle - Handle of user that triggered the notification.
 * @param {number} channelId - Id of channel that the event happened in (-1 if in dm).
 * @param {number} dmId - Id of dm that the event happened in (-1 if in channel).
 * @param {string} message - First 20 characters of the message for if the user is tagged.
 */

export function addNotification(reason: string, uId: number, userHandle: string, channelId: number, dmId: number, message: string) {
  let notificationMessage = userHandle;
  let channelName = '';
  let dmName = '';

  const data = getData();

  if (channelId !== -1) {
    for (let i = 0; i < data.channels.length; i++) {
      if (data.channels[i].channelId === channelId) {
        channelName = data.channels[i].name;
      }
    }
  } else if (dmId !== -1) {
    for (let i = 0; i < data.dms.length; i++) {
      if (data.dms[i].dmId === dmId) {
        dmName = data.dms[i].name;
      }
    }
  }

  if (reason === 'tagged') {
    notificationMessage += ' tagged you in ';
    if (channelId !== -1) {
      notificationMessage += channelName;
    } else if (dmId !== -1) {
      notificationMessage += dmName;
    }
    notificationMessage += ': ';
    notificationMessage += message;
  } else if (reason === 'reacted') {
    notificationMessage += ' reacted to your message in ';
    if (channelId !== -1) {
      notificationMessage += channelName;
    } else if (dmId !== -1) {
      notificationMessage += dmName;
    }
  } else if (reason === 'added') {
    notificationMessage += ' added you to ';
    if (channelId !== -1) {
      notificationMessage += channelName;
    } else if (dmId !== -1) {
      notificationMessage += dmName;
    }
  }

  let notMade = true;
  for (let i = 0; i < data.notifications.length; i++) {
    if (data.notifications[i].uId === uId) {
      data.notifications[i].notifications.unshift({
        channelId: channelId,
        dmId: dmId,
        notificationMessage: notificationMessage
      });
      notMade = false;
    }
  }

  if (notMade) {
    data.notifications.push({
      uId: uId,
      notifications: [{
        channelId: channelId,
        dmId: dmId,
        notificationMessage: notificationMessage
      }]
    });
  }

  setData(data);

  return data;
}
