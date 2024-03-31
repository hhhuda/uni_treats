import { getData, setData } from './dataStore';
import { checkglobal, checkToken, tokenId, checkUserId, checkChannelId, checkUserInChannel, checkPrivate, checkOwnerInChannel, whichUserId, checkPublic } from './other';
import HTTPError from 'http-errors';
import { addNotification } from './users';

/**
 * Gives the details of a given channel that the user is in
 * @function
 * @param {string} token - Token of user.
 * @param {number} channelId - Id of valid channel.
 * @throws 400 error if token is invalid.
 * @throws 400 error if channelId is invalid.
 * @throws 403 error if the user is not a member of the channel.
 * @returns {string} name - name of the given channel.
 * @returns {boolean} isPublic - Returns 1 for public and 0 for private.
 * @returns {user[]} ownerMembers - array of all owners in the channel.
 * @returns {user[]} allMembers - array of all members in the channel.
 */

export function channelDetailsV1(token: string, channelId: number) {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');
  if (!checkChannelId(channelId)) throw HTTPError(400, 'ChannelId is invalid.');

  const authUserId = tokenId(token);

  let whichChannel = 0;
  for (const channel in data.channels) {
    if (data.channels[channel].channelId === channelId) {
      whichChannel = parseInt(channel);
      break;
    }
  }

  let valid = 0;
  for (const user in data.channels[whichChannel].allMembers) {
    if (data.channels[whichChannel].allMembers[user].uId === authUserId) {
      valid = 1;
      break;
    }
  }

  if (valid === 0) throw HTTPError(403, 'User is already a channel member.');

  return {
    name: data.channels[whichChannel].name,
    isPublic: data.channels[whichChannel].isPublic,
    ownerMembers: data.channels[whichChannel].ownerMembers,
    allMembers: data.channels[whichChannel].allMembers,
  };
}

/**
 * Given an token it will allow the user to join the given channel
 * @function
 * @param {string} token - Token of user.
 * @param {number} channelId - Id of valid channel.
 * @throws 400 error if channelId is invalid.
 * @throws 400 error if user is already a member of the channel.
 * @throws 403 error if token is invalid.
 * @throws 403 error if the channel is private and the authorised user is not a member or global owner of the channel.
 * @returns {}.
 */

export function channelJoinV1(token: string, channelId: number) {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');
  if (!checkChannelId(channelId)) throw HTTPError(400, 'ChannelId is invalid.');

  const authUserId = tokenId(token);

  if (checkUserInChannel(authUserId, channelId)) throw HTTPError(400, 'User is already a channel member.');
  if (!checkPublic(channelId) && !checkPrivate(authUserId, channelId) && !checkglobal(authUserId)) throw HTTPError(403, 'Channel is private.');

  let userToAdd = data.users[0];
  for (const i in data.users) {
    if (data.users[i].uId === authUserId) {
      userToAdd = data.users[i];
      break;
    }
  }

  for (const i in data.channels) {
    if (data.channels[i].channelId === channelId) {
      if (data.channels[i].isPublic === false) {
        data.channels[i].allMembers.push(userToAdd);
        data.channels[i].ownerMembers.push(userToAdd);
      } else {
        data.channels[i].allMembers.push(userToAdd);
      }
      setData(data);
    }
  }

  return {};
}

/**
 * Allows another user to join channel given valid token.
 * @function
 * @param {string} token - Token of user.
 * @param {number} channelId - Id of valid channel.
 * @param {number} uId - Id of a registered user.
 * @throws 400 error if channelId is invalid.
 * @throws 400 error if uId is invalid.
 * @throws 400 error if uId is already a member of the channel.
 * @throws 403 error if token is invalid.
 * @throws 403 error if the user with the given token is not a member of the channel.
 * @returns {}.
 */

export function channelInviteV1(token: string, channelId: number, uId: number): { error ?: string } {
  let data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');
  if (!checkChannelId(channelId)) throw HTTPError(400, 'ChannelId is invalid.');
  if (!checkUserId(uId)) throw HTTPError(400, 'uId is invalid.');

  const authUserId = tokenId(token);

  if (checkUserInChannel(uId, channelId)) throw HTTPError(400, 'User is already a channel member.');
  if (!checkUserInChannel(authUserId, channelId)) throw HTTPError(403, 'User is not a channel member.');

  let userToInvite = data.users[0];
  for (const i in data.users) {
    if (data.users[i].uId === uId) {
      userToInvite = data.users[i];
      break;
    }
  }

  for (const i in data.channels) {
    if (data.channels[i].channelId === channelId) {
      data.channels[i].allMembers.push(userToInvite);
      setData(data);
      const userHandle = data.users[whichUserId(authUserId)].handleStr;
      data = addNotification('added', userToInvite.uId, userHandle, channelId, -1, '');
      setData(data);
      break;
    }
  }

  return {};
}

/**
 * Returns up to 50 messages from specified channel.
 * @function
 * @param {string} token - Token of user.
 * @param {number} channelId - Id of valid channel.
 * @param {number} start - Given index from messages array.
 * @throws 400 error if channelId is invalid.
 * @throws 400 error if start is less than zero.
 * @throws 400 error if start is greater than the total number of messages in the channel.
 * @throws 403 error if token is invalid.
 * @throws 403 error if the user with the given token is not a member of the channel.
 * @returns {message} messages - the selected messages.
 * @returns {number} start - the start of the messages.
 * @returns {number} end - the end of the messages.
 */

export function channelMessagesV1(token: string, channelId: number, start: number) {
  const data = getData();

  const authUserId = tokenId(token);

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');
  if (!checkChannelId(channelId)) throw HTTPError(400, 'ChannelId is invalid.');
  if (!checkUserInChannel(authUserId, channelId)) throw HTTPError(403, 'User is not a channel member.');

  let selectedChannel = 0;
  for (const i in data.channels) {
    if (data.channels[i].channelId === channelId) {
      selectedChannel = parseInt(i);
      break;
    }
  }

  const messagesLength = data.channels[selectedChannel].messages.length;

  if (start < 0 || start > messagesLength) throw HTTPError(400, 'Start is invalid.');

  let end;
  let selectedMessages = [];

  if (start + 50 > messagesLength) {
    end = -1;
    /* eslint-disable no-unused-vars */
    selectedMessages = (data.channels[selectedChannel].messages).slice(start, messagesLength);
    /* eslint-enable no-unused-vars */
  } else {
    end = start + 50;
    /* eslint-disable no-unused-vars */
    selectedMessages = (data.channels[selectedChannel].messages).slice(start, end);
    /* eslint-enable no-unused-vars */
  }

  setData(data);

  return {
    messages: selectedMessages,
    start: start,
    end: end,
  };
}

/**
 * Removes the given user from the given channel
 * @function
 * @param {string} token - Token of user.
 * @param {number} channelId - Id of valid channel.
 * @throws 400 error if channelId is invalid.
 * @throws 400 error if the user with the given token is the starter of an active standup in the channel.
 * @throws 403 error if token is invalid.
 * @throws 403 error if the user with the given token is not a member of the channel.
 * @returns {}.
 */

export function channelLeave(token: string, channelId: number): { error?: string } {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');
  if (!checkChannelId(channelId)) throw HTTPError(400, 'Channel Id is invalid.');

  const authUserId = tokenId(token);

  if (!checkUserInChannel(authUserId, channelId)) throw HTTPError(403, 'Given user is not in channel.');

  // NEED TO ADD ERROR FOR IF IN ACTIVE STANDUP AFTER STANDUP HAS BEEN IMPLEMENTED

  for (let i = 0; i < data.channels.length; i++) {
    if (data.channels[i].channelId === channelId) {
      for (let j = 0; j < data.channels[i].allMembers.length; j++) {
        if (data.channels[i].allMembers[j].uId === authUserId) {
          data.channels[i].allMembers.splice(j, 1);
          break;
        }
      }
      for (let j = 0; j < data.channels[i].ownerMembers.length; j++) {
        if (data.channels[i].ownerMembers[j].uId === authUserId) {
          data.channels[i].ownerMembers.splice(j, 1);
          break;
        }
      }
    }
  }

  setData(data);

  return {};
}

/**
 * Makes the given user with Id, uId, an owner of the given channel
 * @function
 * @param {string} token - Token of user.
 * @param {number} channelId - Id of valid channel.
 * @param {number} uId - Id of a registered user.
 * @throws 400 error if channelId is invalid.
 * @throws 400 error if uId is invalid.
 * @throws 400 error if uId is not a member of the channel.
 * @throws 400 error if uId is already an owner of the channel.
 * @throws 403 error if token is invalid.
 * @throws 403 error if the user with the given token does not have owner permissions in the channel.
 * @returns {}.
 */

export function channelAddOwner(token: string, channelId: number, uId: number): { error ?: string } {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');
  if (!checkChannelId(channelId)) throw HTTPError(400, 'Channel Id is invalid.');
  if (!checkUserId(uId)) throw HTTPError(400, 'User Id is invalid.');

  const authUserId = tokenId(token);

  if (!checkglobal(authUserId)) {
    if (!checkOwnerInChannel(authUserId, channelId)) throw HTTPError(403, 'User associated with the token is not a global owner nor an owner of the channel.');
  }

  if (!checkUserInChannel(uId, channelId)) throw HTTPError(400, 'User with Id uId is not a member of the channel.');
  if (checkOwnerInChannel(uId, channelId)) throw HTTPError(400, 'User with Id uId is already an owner of the channel.');

  const currUser = whichUserId(uId);

  for (let i = 0; i < data.channels.length; i++) {
    if (data.channels[i].channelId === channelId) {
      data.channels[i].ownerMembers.push({
        email: data.users[currUser].email,
        handleStr: data.users[currUser].handleStr,
        nameFirst: data.users[currUser].nameFirst,
        nameLast: data.users[currUser].nameLast,
        uId: data.users[currUser].uId
      });
      break;
    }
  }

  setData(data);

  return {};
}

/**
 * Removes the given user with Id, uId, as an owner of the given channel
 * @function
 * @param {string} token - Token of user.
 * @param {number} channelId - Id of valid channel.
 * @param {number} uId - Id of a registered user
 * @throws 400 error if channelId is invalid.
 * @throws 400 error if uId is invalid.
 * @throws 400 error if uId is not an owner of the channel.
 * @throws 400 error if uId is the only owner of the channel.
 * @throws 403 error if token is invalid.
 * @throws 403 error if the user with the given token does not have owner permissions in the channel.
 * @returns {}.
 */

export function channelRemoveOwner(token: string, channelId: number, uId: number): { error ?: string } {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');
  if (!checkChannelId(channelId)) throw HTTPError(400, 'Channel Id is invalid.');
  if (!checkUserId(uId)) throw HTTPError(400, 'User Id is invalid.');

  const authUserId = tokenId(token);

  if (!checkglobal(authUserId)) {
    if (!checkOwnerInChannel(authUserId, channelId)) throw HTTPError(403, 'User associated with the token is not a global owner nor an owner of the channel.');
  }

  if (!checkOwnerInChannel(uId, channelId)) throw HTTPError(400, 'User with Id uId is not an owner of the channel.');

  for (let i = 0; i < data.channels.length; i++) {
    if (data.channels[i].channelId === channelId) {
      if (data.channels[i].ownerMembers.length === 1) throw HTTPError(400, 'User with Id uId is the only owner of the channel.');
      for (let j = 0; j < data.channels[i].ownerMembers.length; j++) {
        if (data.channels[i].ownerMembers[j].uId === uId) {
          data.channels[i].ownerMembers.splice(j, 1);
          break;
        }
      }
    }
  }

  setData(data);

  return {};
}
