import { getData, message, setData } from './dataStore';
import { checkToken, tokenId, checkChannelId, checkUserInChannel, checkMessageIdIsValid, notChannelOwner, unauthorisedUserSend, unauthorisedUserDmSend, checkMessageLength, checkMessageTooBig, checkChannelContainsString, checkDMContainsString, checkdmMember, totalMessages, messageExists, checkdmId, checkMessageReact, whichChannelHasMessage, whichMessageInChannel, whichDmHasMessage, whichMessageInDm, whoCreated, getTags, whichUserId, messageOwner, checkOwnerPermissionsInDm, checkOwnerPermissionsInChannel } from './other';
import HTTPError from 'http-errors';
import { dmSend } from './dm';
import { addNotification } from './users';

/**
 * Send a message from the authorised user to a channel specified channelId.
 * @function
 * @param {string} token - Token of user.
 * @param {integer} channelId - Id of valid channel.
 * @param {string} message - A message that will be sent to the channel.
 * @throws 400 error if channelId does not refer to a valid channel.
 * @throws 400 error if length of the message string is either less than 1 or greater than 1000 letters.
 * @throws 403 error if token is invalid.
 * @throws 403 error if user's uId is not found in channel specified by channelId.
 * @returns {integer} messageId - Message's unique ID.
 */

export function messageSend(token: string, channelId: number, message: string) {
  let data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');
  if (!checkChannelId(channelId)) throw HTTPError(400, 'ChannelId is invalid.');
  if (!checkMessageLength(message)) throw HTTPError(400, 'Message with invalid size.');

  const authUserId = tokenId(token);

  if (!checkUserInChannel(authUserId, channelId)) throw HTTPError(403, 'User not in channel.');

  let currMessageId = totalMessages() + 1;
  while (messageExists(currMessageId)) currMessageId++;

  for (let i = 0; i < data.channels.length; i++) {
    if (data.channels[i].channelId === channelId) {
      data.channels[i].messages.unshift({
        messageId: currMessageId,
        uId: authUserId,
        message: message,
        timeSent: Math.floor((new Date()).getTime() / 1000),
        isPinned: false,
        reacts: [],
      });
      const tags = getTags(message);
      const handleStr = data.users[whichUserId(authUserId)].handleStr;
      let newMessage = '';
      if (message.length <= 20) {
        newMessage = message;
      } else {
        for (let i = 0; i < 20; i++) {
          newMessage += message[i];
        }
      }
      for (let j = 0; j < tags.length; j++) {
        setData(data);
        data = addNotification('tagged', tags[j], handleStr, channelId, -1, newMessage);
      }
      break;
    }
  }

  setData(data);

  return {
    messageId: currMessageId,
  };
}

/**
 * Given a message, allow the user to update its text with new text or delete it in a DM or channel.
 * @function
 * @param {string} token - Token of user.
 * @param {integer} messageId - Message's unique ID.
 * @param {string} message - A message that will be sent to the channel to replace the original message.
 * @throws 400 error if channelId does not refer to a valid channel.
 * @throws 400 error if length of the replacement message string is greater than 1000 letters.
 * @throws 400 error if messageId does not refer to a valid message within the channel/DM.
 * @throws 403 error if token is invalid.
 * @throws 403 error if message was not sent by an authorised user.
 * @throws 403 error if user editing the message is not an owner.
 * @returns {}.
 */

export function messageEdit(token: string, messageId: number, message: string) {
  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');
  if (!checkMessageTooBig(message)) throw HTTPError(400, 'Message too long.');

  const authUserId = tokenId(token);

  if (!checkMessageIdIsValid(authUserId, messageId)) throw HTTPError(400, 'Invalid messageId.');
  if (!notChannelOwner(authUserId, messageId) && !messageOwner(authUserId, messageId)) {
    throw HTTPError(403, 'Message was sent by someone else and user is not a channel owner.');
  }

  let data = getData();
  let channelId = -1;
  let dmId = -1;

  for (const i in data.channels) {
    for (const j in data.channels[i].messages) {
      if (data.channels[i].messages[j].messageId === messageId) {
        if (!unauthorisedUserSend(authUserId, messageId)) throw HTTPError(403, 'Unauthorised user.');
        if (message !== '') {
          data.channels[i].messages[j].messageId = messageId;
          data.channels[i].messages[j].uId = authUserId;
          data.channels[i].messages[j].message = message;
        } else {
          data.channels[i].messages.splice(parseInt(j), 1);
        }
        setData(data);
        channelId = data.channels[i].channelId;
        break;
      }
    }
  }

  if (channelId === -1) {
    for (const i in data.dms) {
      for (const j in data.dms[i].messages) {
        if (data.dms[i].messages[j].messageId === messageId) {
          if (!unauthorisedUserDmSend(authUserId, messageId)) throw HTTPError(403, 'Unauthorised user.');
          if (message !== '') {
            data.dms[i].messages[j].messageId = messageId;
            data.dms[i].messages[j].uId = authUserId;
            data.dms[i].messages[j].message = message;
          } else {
            data.dms[i].messages.splice(parseInt(j), 1);
          }
          setData(data);
          dmId = data.dms[i].dmId;
          break;
        }
      }
    }
  }
  const tags = getTags(message);
  const handleStr = data.users[whichUserId(authUserId)].handleStr;
  let newMessage = '';
  if (message.length <= 20) {
    newMessage = message;
  } else {
    for (let i = 0; i < 20; i++) {
      newMessage += message[i];
    }
  }
  for (let j = 0; j < tags.length; j++) {
    setData(data);
    data = addNotification('tagged', tags[j], handleStr, channelId, dmId, newMessage);
  }
  setData(data);
  return {};
}

/**
 * Given a valid messageId, it will find the message associated with the ID and delete it from the channel/DM.
 * @function
 * @param {string} token - Token of user.
 * @param {integer} messageId - Message's unique ID.
 * @throws 400 error if messageId does not refer to a valid message within the channel/DM.
 * @throws 403 error if token is invalid.
 * @throws 403 error if message was not sent by an authorised user.
 * @throws 403 error if user removing the message is not an owner.
 * @returns {}.
 */

export function messageRemove(token: string, messageId: number) {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');
  const authUserId = tokenId(token);

  if (!checkMessageIdIsValid(authUserId, messageId)) throw HTTPError(400, 'MessageId not valid.');
  if (!notChannelOwner(authUserId, messageId) && !messageOwner(authUserId, messageId)) {
    throw HTTPError(403, 'Message was sent by someone else and user is not a channel owner.');
  }

  for (const i in data.channels) {
    for (const j in data.channels[i].messages) {
      if (data.channels[i].messages[j].messageId === messageId) {
        if (!unauthorisedUserSend(authUserId, messageId)) throw HTTPError(403, 'Unauthorised user sending.');
        data.channels[i].messages.splice(parseInt(j), 1);
        setData(data);
        return {};
      }
    }
  }

  for (const i in data.dms) {
    for (const j in data.dms[i].messages) {
      if (data.dms[i].messages[j].messageId === messageId) {
        if (!unauthorisedUserDmSend(authUserId, messageId)) throw HTTPError(403, 'Unauthorised user sending.');
        data.dms[i].messages.splice(parseInt(j), 1);
        setData(data);
        return {};
      }
    }
  }
}

/**
 * Search through all of the messages and return the messages that have the query string.
 * @function
 * @param {string} token - Token of user.
 * @param {string} queryStr - query string.
 * @throws 400 error if length of queryStr is less than 1.
 * @throws 400 error if length of queryStr is greater than 1000.
 * @throws 403 error if the token is invalid.
 * @returns {message[]} messages - array of messages that contain the query string.
 */

export function search(token: string, queryStr: string): message[] {
  const data = getData();
  const messages: message[] = [];

  if (queryStr.length < 1) throw HTTPError(400, 'Query String too short.');
  if (queryStr.length > 1000) throw HTTPError(400, 'Query String too long.');
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');

  const authUserId = tokenId(token);

  for (let i = 0; i < data.channels.length; i++) {
    for (let j = 0; j < data.channels[i].allMembers.length; j++) {
      if (authUserId === data.channels[i].allMembers[j].uId) {
        let currMessage = checkChannelContainsString(i, queryStr, messages);
        while (currMessage !== null) {
          messages.push(currMessage);
          currMessage = checkChannelContainsString(i, queryStr, messages);
        }
      }
    }
  }

  for (let i = 0; i < data.dms.length; i++) {
    for (let j = 0; j < data.dms[i].members.length; j++) {
      if (authUserId === data.dms[i].members[j].uId) {
        let currMessage = checkDMContainsString(i, queryStr, messages);
        while (currMessage !== null) {
          messages.push(currMessage);
          currMessage = checkDMContainsString(i, queryStr, messages);
        }
      }
    }
  }

  return messages;
}

/**
 * Shares the given message to the channel/dm with an optional extra message.
 * @function
 * @param {string} token - Token of user.
 * @param {number} ogMessageId - Id of message to be shared.
 * @param {string} message - additional message to add to the shared message.
 * @param {number} channelId - Id of a channel (-1 if being sent to a dm).
 * @param {number} dmId - Id of a dm (-1 if being sent to a channel).
 * @throw 400 error - both channelId and dmId are -1.
 * @throw 400 error - neither channelId and dmId are -1.
 * @throw 400 error - channelId is invalid and dmId is -1.
 * @throw 400 error - channelId is -1 and dmId is invalid.
 * @throw 400 error - ogMessageId does not refer to a valid message within a channel/dm that the user has joined.
 * @throw 400 error - length of message is more than 1000 characters.
 * @throw 403 error - token is invalid.
 * @throw 403 error - channelId refers to a channel that the user hasn't joined.
 * @throw 403 error - dmId refers to a dm that the user hasn't joined.
 * @returns {number} sharedMessageId - the id of the new message.
 */

export function messageShare(token: string, ogMessageId: number, message: string, channelId: number, dmId: number): number {
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');
  if (channelId === -1 && dmId === -1) throw HTTPError(400, 'Both channelId and dmId are -1.');
  if (channelId !== -1 && dmId !== -1) throw HTTPError(400, 'Neither channelId and dmId are -1.');
  if (channelId !== -1 && !checkChannelId(channelId)) throw HTTPError(400, 'ChannelId is invalid.');
  if (dmId !== -1 && !checkdmId(dmId)) throw HTTPError(400, 'DmId is invalid.');
  if (message.length > 1000) throw HTTPError(400, 'Length of message is more than 1000 characters.');

  const authUserId = tokenId(token);

  if (!checkMessageIdIsValid(authUserId, ogMessageId)) throw HTTPError(400, 'ogMessageId is invalid within a channel/dm that the user has joined.');
  if (channelId !== -1 && !checkUserInChannel(authUserId, channelId)) throw HTTPError(403, 'User is not apart of given channel.');
  if (dmId !== -1 && !checkdmMember(authUserId, dmId)) throw HTTPError(403, 'User is not apart of given dm.');

  let sharedMessageId = -1;
  let newMessage = '';
  const data = getData();

  // Search through the data store to find the ogMessage
  for (let i = 0; i < data.channels.length; i++) {
    for (let j = 0; j < data.channels[i].messages.length; j++) {
      if (data.channels[i].messages[j].messageId === ogMessageId) {
        newMessage = data.channels[i].messages[j].message;
      }
    }
  }

  for (let i = 0; i < data.dms.length; i++) {
    for (let j = 0; j < data.dms[i].messages.length; j++) {
      if (data.dms[i].messages[j].messageId === ogMessageId) {
        newMessage = data.dms[i].messages[j].message;
      }
    }
  }

  newMessage += message;
  if (channelId !== -1) {
    sharedMessageId = messageSend(token, channelId, newMessage).messageId;
  }

  if (dmId !== -1) {
    sharedMessageId = dmSend(token, dmId, newMessage).messageId;
  }

  return sharedMessageId;
}

/**
 * Reacts to the given message with the given reactId.
 * @function
 * @param {string} token - Token of user.
 * @param {number} messageId - Id of user.
 * @param {number} reactId - Id of react.
 * @throw 403 error if token is invalid.
 * @throw 400 error if reactId is not 1.
 * @throw 400 error if messageId is not valid for the user.
 * @throw 400 error if the message has already been reacted with the same id by the user.
 * @returns {}.
 */

export function messageReact(token: string, messageId: number, reactId: number) {
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');
  if (reactId !== 1) throw HTTPError(400, 'Invalid reactId.');

  const authUserId = tokenId(token);

  if (!checkMessageIdIsValid(authUserId, messageId)) throw HTTPError(400, 'messageId is invalid within a channel/dm that the user has joined.');
  if (checkMessageReact(authUserId, messageId, reactId)) throw HTTPError(400, 'user has already reacted to the message with the same reactId.');

  let data = getData();

  const indexChan = whichChannelHasMessage(messageId);
  const indexChanMess = whichMessageInChannel(messageId);
  const indexDm = whichDmHasMessage(messageId);
  const indexDmMess = whichMessageInDm(messageId);
  const messageCreator = whoCreated(messageId);
  const currHandle = data.users[whichUserId(authUserId)].handleStr;

  let newReact = true;

  if (indexChan !== -1) {
    for (let i = 0; i < data.channels[indexChan].messages[indexChanMess].reacts.length; i++) {
      if (data.channels[indexChan].messages[indexChanMess].reacts[i].reactId === reactId) {
        // Message has been reacted by someone else, so add curr user to uIds
        data.channels[indexChan].messages[indexChanMess].reacts[i].uIds.push(authUserId);
        newReact = false;
        break;
      }
    }
    if (newReact) {
      // New react, so add new object in array
      data.channels[indexChan].messages[indexChanMess].reacts.push({
        reactId: reactId,
        uIds: [authUserId],
        isThisUserReacted: true,
      });
    }
    setData(data);
    data = addNotification('reacted', messageCreator, currHandle, data.channels[indexChan].channelId, -1, '');
  } else if (indexDm !== -1) {
    for (let i = 0; i < data.dms[indexDm].messages[indexDmMess].reacts.length; i++) {
      if (data.dms[indexDm].messages[indexDmMess].reacts[i].reactId === reactId) {
        // Message has been reacted by someone else, so add curr user to uIds
        data.dms[indexDm].messages[indexDmMess].reacts[i].uIds.push(authUserId);
        newReact = false;
        break;
      }
    }
    if (newReact) {
      // New react, so add new object in array
      data.dms[indexDm].messages[indexDmMess].reacts.push({
        reactId: reactId,
        uIds: [authUserId],
        isThisUserReacted: true,
      });
    }
    setData(data);
    data = addNotification('reacted', messageCreator, currHandle, -1, data.dms[indexDm].dmId, '');
  }

  setData(data);
  return {};
}

/**
 * Unreacts to the given message with the given reactId.
 * @param {string} token - Token of user.
 * @param {number} messageId - Id of user.
 * @param {number} reactId - Id of react.
 * @throw 403 error if token is invalid.
 * @throw 400 error if reactId is not 1.
 * @throw 400 error if messageId is not valid for the user.
 * @throw 400 error if the message has not been reacted with the same id by the user.
 * @returns {}.
 */

export function messageUnreact(token: string, messageId: number, reactId: number) {
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');
  if (reactId !== 1) throw HTTPError(400, 'Invalid reactId.');

  const authUserId = tokenId(token);

  if (!checkMessageIdIsValid(authUserId, messageId)) throw HTTPError(400, 'messageId is invalid within a channel/dm that the user has joined.');
  if (!checkMessageReact(authUserId, messageId, reactId)) throw HTTPError(400, 'the message does not contain a react from the user.');

  const data = getData();

  const indexChan = whichChannelHasMessage(messageId);
  const indexChanMess = whichMessageInChannel(messageId);
  const indexDm = whichDmHasMessage(messageId);
  const indexDmMess = whichMessageInDm(messageId);

  if (indexChan !== -1) {
    for (let i = 0; i < data.channels[indexChan].messages[indexChanMess].reacts.length; i++) {
      if (data.channels[indexChan].messages[indexChanMess].reacts[i].reactId === reactId) {
        for (let j = 0; j < data.channels[indexChan].messages[indexChanMess].reacts[i].uIds.length; j++) {
          if (data.channels[indexChan].messages[indexChanMess].reacts[i].uIds[j] === authUserId) {
            if (data.channels[indexChan].messages[indexChanMess].reacts[i].uIds.length === 1) {
              if (data.channels[indexChan].messages[indexChanMess].reacts.length === 1) {
                data.channels[indexChan].messages[indexChanMess].reacts = [];
                break;
              }
              data.channels[indexChan].messages[indexChanMess].reacts.splice(i, 1);
              break;
            }
            // Message is reacted by authUserId, so take it out of the array
            data.channels[indexChan].messages[indexChanMess].reacts[i].uIds.splice(j, 1);
            break;
          }
        }
        break;
      }
    }
  } else if (indexDm !== -1) {
    for (let i = 0; i < data.dms[indexDm].messages[indexDmMess].reacts.length; i++) {
      if (data.dms[indexDm].messages[indexDmMess].reacts[i].reactId === reactId) {
        for (let j = 0; j < data.dms[indexDm].messages[indexDmMess].reacts[i].uIds.length; j++) {
          if (data.dms[indexDm].messages[indexDmMess].reacts[i].uIds[j] === authUserId) {
            if (data.dms[indexDm].messages[indexDmMess].reacts[i].uIds.length === 1) {
              if (data.dms[indexDm].messages[indexDmMess].reacts.length === 1) {
                data.dms[indexDm].messages[indexDmMess].reacts = [];
                break;
              }
              data.dms[indexDm].messages[indexDmMess].reacts.splice(i, 1);
              break;
            }
            // Message is reacted by authUserId, so take it out of the array
            data.dms[indexDm].messages[indexDmMess].reacts[i].uIds.splice(j, 1);
            break;
          }
        }
        break;
      }
    }
  }

  setData(data);
  return {};
}

/**
 * Pins a message given a messageId
 * @function
 * @param {string} token- token of user
 * @param {number} messageId- the Id of the message
 * @throw 403 error - token is invalid
 * @throw 400 error - messageId is invalid
 * @throw 403 error - no owner permissions
 * @throw 400 error - message already pinned
 * @returns {}
 */

export function messagePin(token: string, messageId: number) {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');

  const authUserId = tokenId(token);

  if (!checkMessageIdIsValid(authUserId, messageId)) throw HTTPError(400, 'MessageId not invalid.');

  const indexChan = whichChannelHasMessage(messageId);
  const indexDm = whichDmHasMessage(messageId);

  if (indexChan !== -1) {
    for (let i = 0; i < data.channels.length; i++) {
      for (let j = 0; j < data.channels[i].messages.length; j++) {
        if (data.channels[i].messages[j].messageId === messageId && data.channels[i].messages[j].isPinned === false) {
          if (!checkOwnerPermissionsInChannel(authUserId, messageId)) throw HTTPError(403, 'No owner permissions');
          data.channels[i].messages[j].isPinned = true;
          setData(data);
          return {};
        }
      }
    }
  } else if (indexDm !== -1) {
    for (let i = 0; i < data.dms.length; i++) {
      for (let j = 0; j < data.dms[i].messages.length; j++) {
        if (data.dms[i].messages[j].messageId === messageId && data.dms[i].messages[j].isPinned === false) {
          if (!checkOwnerPermissionsInDm(authUserId, messageId)) throw HTTPError(403, 'No owner permissions');
          data.dms[i].messages[j].isPinned = true;
          setData(data);
          return {};
        }
      }
    }
  }

  throw HTTPError(400, 'Message already pinned.');
}

/**
 * Unpins a message given a messageId
 * @function
 * @param {string} token- token of user
 * @param {number} messageId- the Id of the message
 * @throw 403 error - token is invalid
 * @throw 400 error - messageId is invalid
 * @throw 403 error - no owner permissions
 * @throw 400 error - message not pinned already
 * @returns {}
 */
export function messageUnpin(token: string, messageId: number) {
  const data = getData();

  if (!checkToken(token)) throw HTTPError(403, 'Token is invalid.');

  const authUserId = tokenId(token);

  if (!checkMessageIdIsValid(authUserId, messageId)) throw HTTPError(400, 'MessageId not invalid.');

  const indexChanMess = whichMessageInChannel(messageId);
  const indexDm = whichDmHasMessage(messageId);
  const indexDmMess = whichMessageInDm(messageId);

  if (!checkOwnerPermissionsInChannel(authUserId, messageId) && !checkOwnerPermissionsInDm(authUserId, messageId)) throw HTTPError(403, 'No owner permissions');

  for (let i = 0; i < data.channels.length; i++) {
    for (let j = 0; j < data.channels[i].messages.length; j++) {
      if (data.channels[i].messages[j].messageId === messageId && data.channels[i].messages[j].isPinned === true) {
        data.channels[i].messages[j].isPinned = false;
        setData(data);
        return {};
      } else if (data.channels[i].messages[j].messageId === messageId && data.channels[i].messages[j].isPinned === false) {
        throw HTTPError(400, 'Message already pinned.');
      }
    }
  }

  if (data.dms[indexDm].messages[indexDmMess].messageId === messageId && data.dms[indexDm].messages[indexDmMess].isPinned === true) {
    data.dms[indexDm].messages[indexChanMess].isPinned = false;
    setData(data);
    return {};
  } else if (data.dms[indexDm].messages[indexDmMess].messageId === messageId && data.dms[indexDm].messages[indexDmMess].isPinned === false) {
    throw HTTPError(400, 'Message already pinned.');
  }
  return {};
}
