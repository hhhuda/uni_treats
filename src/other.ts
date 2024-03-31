import { getData, setData, message } from './dataStore';
import hash from 'string-hash';

const SECRET = 678;

/**
 * Clears all data of the application to its beginning state.
 * @function
 * @returns {}.
 */

export function clearV1() {
  const data = getData();
  data.dms = [];
  data.users = [];
  data.channels = [];
  data.standups = [];
  data.globalowners = [];
  data.notifications = [];
  setData(data);
  return {};
}

/**
 * Checks whether the given token is related to any user.
 * @function
 * @param {string} token - Token of user.
 * @returns {boolean} true - if the token is valid.
 * @returns {boolean} false - if the token isn't related to any user.
 */

export function checkToken(token: string): boolean {
  const data = getData();

  for (let i = 0; i < data.users.length; i++) {
    for (let j = 0; j < data.users[i].tokens.length; j++) {
      if (data.users[i].tokens[j] === hash(token + SECRET).toString()) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks which user the given token is associated with.
 * @function
 * @param {string} token - Token of user.
 * @returns {number} data.users[i].uId - the Id of the user related to the given token.
 * @returns {number} -1 - no user exists with the given token.
 */

export function tokenId(token: string): number {
  const data = getData();
  for (let i = 0; i < data.users.length; i++) {
    for (let j = 0; j < data.users[i].tokens.length; j++) {
      if (data.users[i].tokens[j] === hash(token + SECRET).toString()) {
        return data.users[i].uId;
      }
    }
  }
  return -1;
}

/**
 * Finds the total number of tokens in the data store.
 * @function
 * @returns {number} totalTokens - the total amount of tokens in the data store.
 */

export function totalTokens(): number {
  const data = getData();
  let totalTokens = 0;
  for (let i = 0; i < data.users.length; i++) {
    totalTokens += data.users[i].tokens.length;
  }
  return totalTokens;
}

/**
 * Checks which element in the user array the given token is related to.
 * @function
 * @param {string} token - Token of user.
 * @returns {number} -1 - if there is no user related to that token.
 * @returns {number} i - index of the user in the array.
 */

export function whichUser(token: string): number {
  const data = getData();
  for (let i = 0; i < data.users.length; i++) {
    for (let j = 0; j < data.users[i].tokens.length; j++) {
      if (data.users[i].tokens[j] === hash(token + SECRET).toString()) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Checks which element in the user array the given Id is related to.
 * @function
 * @param {string} authUserId - Id of user.
 * @returns {number} -1 - if there is no user related to that Id.
 * @returns {number} i - index of the user in the array.
 */

export function whichUserId(authUserId: number): number {
  const data = getData();
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === authUserId) {
      return i;
    }
  }
}

/**
 * Checks which element in the token array for the
 * relevant user the given token is related to.
 * @function
 * @param {string} token - Token of user.
 * @returns {number} -1 - if there is no user related to that token.
 * @returns {number} j - index of the token in the array.
 */

export function whichToken(token: string): number {
  const data = getData();
  for (let i = 0; i < data.users.length; i++) {
    for (let j = 0; j < data.users[i].tokens.length; j++) {
      if (data.users[i].tokens[j] === hash(token + SECRET).toString()) {
        return j;
      }
    }
  }
}

/**
 * Checks whether the given email is related to a registered user.
 * @function
 * @param {string} email - email of a registered user.
 * @returns {boolean} true - if the email is related to a registered user.
 * @returns {boolean} false - if no user has the given email.
 */

export function checkEmail(email: string): boolean {
  const data = getData();

  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].email === email) {
      return true;
    }
  }

  return false;
}

/**
 * Checks which user has the given email.
 * @function
 * @param {string} email - email of a registered user.
 * @returns {number} -1 - if there is no user with that email.
 * @returns {number} i - the index in the array of the user with that email.
 */

export function findEmail(email: string): number {
  const data = getData();

  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].email === email) {
      return i;
    }
  }

  return -1;
}

/**
 * Checks whether the given Id is related to a registered user.
 * @function
 * @param {number} authUserId - Id of a registered user.
 * @returns {boolean} true - if the Id is related to a registered user.
 * @returns {boolean} false - if no user has the given Id.
 */

export function checkUserId(authUserId: number): boolean {
  const data = getData();
  for (const i in data.users) {
    if (data.users[i].uId === authUserId) return true;
  }
  return false;
}

/**
 * Checks whether the given channelId is related to a created channel.
 * @function
 * @param {number} channelId - Id of a created channel.
 * @returns {boolean} true - if a channel exists with the given Id.
 * @returns {boolean} false - if no channel exists with the given Id.
 */

export function checkChannelId(channelId: number): boolean {
  const data = getData();
  for (const i in data.channels) {
    if (data.channels[i].channelId === channelId) {
      return true;
    }
  }
  return false;
}

/**
 * Checks whether the given user is in the given channel.
 * @function
 * @param {number} authUserId - Id of a registered user.
 * @param {number} channelId - Id of a created channel.
 * @returns {boolean} true - if the user is a member in the channel.
 * @returns {boolean} false - if the user is not a member in the channel.
 */

export function checkUserInChannel(authUserId: number, channelId: number): boolean {
  const data = getData();
  for (const i in data.channels) {
    if (data.channels[i].channelId === channelId) {
      for (const j in data.channels[i].allMembers) {
        if (data.channels[i].allMembers[j].uId === authUserId) {
          return true;
        }
      }
      break;
    }
  }
  return false;
}

/**
 * Checks whether the given user is an owner in the given channel.
 * @function
 * @param {number} authUserId - Id of a registered user.
 * @param {number} channelId - Id of a created channel.
 * @returns {boolean} true - if the user is an owner in the channel.
 * @returns {boolean} false - if the user is not an owner in the channel.
 */

export function checkOwnerInChannel(authUserId: number, channelId: number): boolean {
  const data = getData();
  for (const i in data.channels) {
    if (data.channels[i].channelId === channelId) {
      for (const j in data.channels[i].ownerMembers) {
        if (data.channels[i].ownerMembers[j].uId === authUserId) {
          return true;
        }
      }
      break;
    }
  }
  return false;
}

/**
 * Given a uId checks if global owner
 * @function
 * @param uId
 * @returns {boolean} true if global owner, false otherwise
 */
export function checkglobal(uId: number) {
  const data = getData();
  for (const i in data.globalowners) {
    if (data.globalowners[i] === uId) return true;
  }
  return false;
}

/**
 * Checks whether the given channel is private for the given user.
 * @function
 * @param {number} authUserId - Id of a registered user.
 * @param {number} channelId - Id of a created channel.
 * @returns {boolean} true - if the user is an owner of the private channel.
 * @returns {boolean} false - if the user is not an owner of the private channel.
 */

export function checkPrivate(authUserId: number, channelId: number): boolean {
  const data = getData();
  for (const i in data.channels) {
    if (data.channels[i].channelId === channelId) {
      if (data.channels[i].isPublic === false && checkOwnerInChannel(authUserId, channelId)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks whether the given channel is public.
 * @function
 * @param {number} channelId - Id of a created channel.
 * @returns {boolean} true - if the channel is public.
 * @returns {boolean} false - if the channel is private.
 */

export function checkPublic(channelId: number): boolean {
  const data = getData();
  for (const i in data.channels) {
    if (data.channels[i].channelId === channelId) {
      if (data.channels[i].isPublic === true) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks that all ids in an array match one to one to existing users.
 * @function
 * @param {number[]} userIds - array of Ids.
 * @returns {boolean} true - if the ids match one to one to existing users.
 * @returns {boolean} false - if an id is invalid or a duplicate.
 */

export function checkuserIds(userIds: number[]): boolean {
  const data = getData();

  for (const a in userIds) {
    for (const b in userIds) {
      if (a !== b) {
        if (userIds[a] === userIds[b]) {
          return false;
        }
      }
    }
  }

  for (const a in userIds) {
    let found = 0;
    for (const b in data.users) {
      if (data.users[b].uId === userIds[a]) {
        found = 1;
      }
    }
    if (found === 0) return false;
  }

  return true;
}

/**
 * Checks that dm exits.
 * @function
 * @param {number} dmId - Id of dm.
 * @returns {boolean} true - if the dm exists in the data store.
 * @returns {boolean} false - if the id is ivalid or does not exist.
 */

export function checkdmId(dmId: number): boolean {
  const data = getData();
  for (const a in data.dms) {
    if (data.dms[a].dmId === dmId) {
      return true;
    }
  }
  return false;
}

/**
 * Checks that userid is member of a dm.
 * @function
 * @param {number} uId  - Id of user.
 * @param {number} dmId - Id of dm.
 * @returns {boolean} true - if the user is a member of the given dm.
 * @returns {boolean} false - if uId or dmId is invalid, or the user is not a member of the given dm.
 */

export function checkdmMember(uId: number, dmId: number): boolean {
  const data = getData();
  for (const a in data.dms) {
    if (data.dms[a].dmId === dmId) {
      for (const b in data.dms[a].members) {
        if (data.dms[a].members[b].uId === uId) {
          return true;
        }
      }
      break;
    }
  }
  return false;
}

/**
 * Returns index of userId in a dm.
 * @function
 * @param {number} uId - Id of user.
 * @param {number} dmId - Id of dm.
 * @returns {number} number - the index of the user in the dm array.
 * @returns {number} -1 - if uId or dmId is invalid, or if the user is not a member of the given dm.
 */

export function returndmMember(uId: number, dmId: number): number {
  const data = getData();
  for (const a in data.dms) {
    if (data.dms[a].dmId === dmId) {
      for (const b in data.dms[a].members) {
        if (data.dms[a].members[b].uId === uId) {
          return parseInt(b);
        }
      }
    }
  }
}

/**
 * Returns index of dms in data.dms.
 * @function
 * @param {number} dmId - Id of dm.
 * @returns {number} parseInt(a) - index of dms in data.dms.
 * @returns {number} -1 - if the dm is invalid.
 */

export function returnDm(dmId: number): number {
  const data = getData();
  for (const a in data.dms) {
    if (data.dms[a].dmId === dmId) {
      return parseInt(a);
    }
  }
  return -1;
}

/**
 * Checks if the messageId refers to a valid message within the channel/dm.
 * @function
 * @param {number} userId - Id of user.
 * @param {number} messageId - Id of message.
 * @returns {boolean} true - if the messageId refers to a valid message.
 * @returns {boolean} false - if messageId does not refer to a valid message within either channel or dm.
 */

export function checkMessageIdIsValid(userId: number, messageId: number): boolean {
  const data = getData();
  let boo = false;
  let boo1 = false;

  for (let i = 0; i < data.channels.length; i++) {
    for (let j = 0; j < data.channels[i].allMembers.length; j++) {
      if (data.channels[i].allMembers[j].uId === userId) {
        for (let m = 0; m < data.channels[i].messages.length; m++) {
          if (data.channels[i].messages[m].messageId === messageId) {
            boo = true;
          }
        }
      }
    }
  }

  for (let i = 0; i < data.dms.length; i++) {
    for (let j = 0; j < data.dms[i].members.length; j++) {
      if (data.dms[i].members[j].uId === userId) {
        for (let m = 0; m < data.dms[i].messages.length; m++) {
          if (data.dms[i].messages[m].messageId === messageId) {
            boo1 = true;
          }
        }
      }
    }
  }
  if (boo === false && boo1 === false) return false;
  return true;
}

/**
 * Checks if the user is an owner.
 * @function
 * @param {number} userId - Id of user.
 * @param {number} messageId - Id of message.
 * @returns {boolean} true - if the user is an owner of the channel/dm.
 * @returns {boolean} false - if the user is not an owner of the channel/dm.
 */

export function notChannelOwner(userId: number, messageId: number): boolean {
  const data = getData();
  let boo = false;
  let boo1 = false;
  for (let i = 0; i < data.channels.length; i++) {
    for (let j = 0; j < data.channels[i].ownerMembers.length; j++) {
      if (data.channels[i].ownerMembers[j].uId === userId) {
        for (let m = 0; m < data.channels[i].messages.length; m++) {
          if (data.channels[i].messages[m].messageId === messageId) {
            boo = true;
          }
        }
      }
    }
  }
  for (let i = 0; i < data.dms.length; i++) {
    if (data.dms[i].owner === userId) {
      for (let m = 0; m < data.dms[i].messages.length; m++) {
        if (data.dms[i].messages[m].messageId === messageId) {
          boo1 = true;
        }
      }
    }
  }
  if (boo === false && boo1 === false) return false;
  return true;
}

/**
 * Checks if the message was sent by authorised user in channel.
 * @function
 * @param {number} userId - Id of user.
 * @param {number} messageId - Id of message.
 * @returns {boolean} true - if the message was sent by an authorised user in the channel.
 * @returns {boolean} false - if the user is not an authorised user of the channel.
 */

export function unauthorisedUserSend(userId: number, messageId: number): boolean {
  const data = getData();
  for (let i = 0; i < data.channels.length; i++) {
    for (let j = 0; j < data.channels[i].messages.length; j++) {
      if (data.channels[i].messages[j].uId !== userId) {
        if (data.channels[i].messages[j].messageId === messageId) {
          return false;
        }
      }
    }
  }
  return true;
}

/**
 * Checks if the message was sent by authorised user in dms.
 * @function
 * @param {number} userId - Id of user.
 * @param {number} messageId - Id of message.
 * @returns {boolean} true - if the message was sent by an authorised user in the dm.
 * @returns {boolean} false - if the user is not an authorised user of the dm.
 */

export function unauthorisedUserDmSend(userId: number, messageId: number): boolean {
  const data = getData();
  for (const i in data.dms) {
    for (const j in data.dms[i].messages) {
      if (data.dms[i].messages[j].uId !== userId &&
        data.dms[i].messages[j].messageId === messageId) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Checks if letters in message string is not less than 1 or greater than 1000.
 * @function
 * @param {string} message - the message to be sent.
 * @returns {boolean} true - if the length is between 1 and 1000.
 * @returns {boolean} false - if the length is less than 1 or greater than 1000.
 */

export function checkMessageLength(message: string): boolean {
  if (message.length < 1 || message.length > 1000) return false;
  return true;
}

/**
 * Checks if letters in message string is not greater than 1000.
 * @function
 * @param {string} message - the message to be edited.
 * @returns {boolean} true - if the length is less than 1000.
 * @returns {boolean} false - if the length is greater than 1000.
 */

export function checkMessageTooBig(message: string): boolean {
  if (message.length > 1000) return false;
  return true;
}

/**
 * Checks if the channel contains the given string.
 * @function
 * @param {number} channelIndex - index of the channel in the data store.
 * @param {string} queryStr - query string.
 * @param {message[]} alreadyAdded - the array of the strings already added.
 * @returns {message} message[i] - the message that contains the given string but isn't already in the array.
 * @returns {object} null - no string exists that hasn't been added or in the channel.
 */

export function checkChannelContainsString(channelIndex: number, queryStr: string, alreadyAdded: message[]): message {
  const data = getData();

  for (let i = 0; i < data.channels[channelIndex].messages.length; i++) {
    const currMessage = data.channels[channelIndex].messages[i].message.toLowerCase();
    const query = queryStr.toLowerCase();
    if (currMessage.includes(query)) {
      if (!messageArrayContains(alreadyAdded, data.channels[channelIndex].messages[i])) {
        return data.channels[channelIndex].messages[i];
      }
    }
  }

  return null;
}

/**
 * Checks if the dm contains the given string.
 * @function
 * @param {number} channelIndex - index of the dm in the data store.
 * @param {string} queryStr - query string.
 * @param {message[]} alreadyAdded - the array of the strings already added.
 * @returns {message} message[i] - the message that contains the given string but isn't already in the array.
 * @returns {object} null - no string exists that hasn't been added or in the dm.
 */

export function checkDMContainsString(dmIndex: number, queryStr: string, alreadyAdded: message[]): message {
  const data = getData();

  for (let i = 0; i < data.dms[dmIndex].messages.length; i++) {
    const currMessage = data.dms[dmIndex].messages[i].message.toLowerCase();
    const query = queryStr.toLowerCase();
    if (currMessage.includes(query)) {
      if (!messageArrayContains(alreadyAdded, data.dms[dmIndex].messages[i])) {
        return data.dms[dmIndex].messages[i];
      }
    }
  }

  return null;
}

/**
 * The given message is in the given array.
 * @function
 * @param {message[]} array - array of messages.
 * @param {message} message - message to be checked if in the array.
 * @returns {boolean} true - the message is in the array.
 * @returns {boolean} false - the message isn't in the array.
 */

export function messageArrayContains(array: message[], message: message): boolean {
  for (let i = 0; i < array.length; i++) {
    if (array[i].messageId === message.messageId) return true;
  }

  return false;
}

/**
 * Finds the total number of messages in the data store.
 * @function
 * @returns {number} total - the total amount of messages in the data store.
 */

export function totalMessages(): number {
  const data = getData();
  let total = 0;

  for (let i = 0; i < data.channels.length; i++) {
    total += data.channels[i].messages.length;
  }

  for (let i = 0; i < data.dms.length; i++) {
    total += data.dms[i].messages.length;
  }

  return total;
}

/**
 * Checks whether the given messageId is related to any message in the data store.
 * @function
 * @param {number} messageId - Id of a message.
 * @returns {boolean} true - the message exists in the data store.
 * @returns {boolean} false - the message doesn't exist in the data store.
 */

export function messageExists(messageId: number): boolean {
  const data = getData();

  for (let i = 0; i < data.channels.length; i++) {
    for (let j = 0; j < data.channels[i].messages.length; j++) {
      if (data.channels[i].messages[j].messageId === messageId) return true;
    }
  }

  for (let i = 0; i < data.dms.length; i++) {
    for (let j = 0; j < data.dms[i].messages.length; j++) {
      if (data.dms[i].messages[j].messageId === messageId) return true;
    }
  }

  return false;
}

/**
 * Checks if the message has been reacted by the given user with the same reactId.
 * @function
 * @param {number} authUserId - Id of user.
 * @param {number} messageId - Id of message.
 * @param {number} reactId - Id of react.
 * @returns {boolean} true - if the message has been reacted by the user with reactId.
 * @returns {boolean} false - if the message hasn't been reacted by the user with reactId.
 */

export function checkMessageReact(authUserId: number, messageId: number, reactId: number): boolean {
  const data = getData();

  for (let i = 0; i < data.channels.length; i++) {
    for (let j = 0; j < data.channels[i].allMembers.length; j++) {
      if (data.channels[i].allMembers[j].uId === authUserId) {
        for (let k = 0; k < data.channels[i].messages.length; k++) {
          if (data.channels[i].messages[k].messageId === messageId) {
            for (let l = 0; l < data.channels[i].messages[k].reacts.length; l++) {
              if (data.channels[i].messages[k].reacts[l].reactId === reactId) {
                for (let a = 0; a < data.channels[i].messages[k].reacts[l].uIds.length; a++) {
                  if (data.channels[i].messages[k].reacts[l].uIds[a] === authUserId) {
                    return true;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  for (let i = 0; i < data.dms.length; i++) {
    for (let j = 0; j < data.dms[i].members.length; j++) {
      if (data.dms[i].members[j].uId === authUserId) {
        for (let k = 0; k < data.dms[i].messages.length; k++) {
          if (data.dms[i].messages[k].messageId === messageId) {
            for (let l = 0; l < data.dms[i].messages[k].reacts.length; l++) {
              if (data.dms[i].messages[k].reacts[l].reactId === reactId) {
                for (let a = 0; a < data.dms[i].messages[k].reacts[l].uIds.length; a++) {
                  if (data.dms[i].messages[k].reacts[l].uIds[a] === authUserId) {
                    return true;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return false;
}

/**
 * Returns which index in the channel array in the data store the given message is in.
 * @function
 * @param {number} messageId - Id of message.
 * @returns {number} i - index of the channel.
 * @returns {number} -1 - no message exists with that id.
 */

export function whichChannelHasMessage(messageId: number): number {
  const data = getData();

  for (let i = 0; i < data.channels.length; i++) {
    for (let j = 0; j < data.channels[i].messages.length; j++) {
      if (data.channels[i].messages[j].messageId === messageId) return i;
    }
  }

  return -1;
}

/**
 * Returns which index in the message array the given message is.
 * @function
 * @param {number} messageId - Id of message.
 * @returns {number} j - index of the message within the channel.
 * @returns {number} -1 - no message exists with that id.
 */

export function whichMessageInChannel(messageId: number): number {
  const data = getData();

  for (let i = 0; i < data.channels.length; i++) {
    for (let j = 0; j < data.channels[i].messages.length; j++) {
      if (data.channels[i].messages[j].messageId === messageId) return j;
    }
  }

  return -1;
}

/**
 * Returns which index in the dms array in the data store the given message is in.
 * @function
 * @param {number} messageId - Id of message.
 * @returns {number} i - index of the dm.
 * @returns {number} -1 - no message exists with that id.
 */

export function whichDmHasMessage(messageId: number): number {
  const data = getData();

  for (let i = 0; i < data.dms.length; i++) {
    for (let j = 0; j < data.dms[i].messages.length; j++) {
      if (data.dms[i].messages[j].messageId === messageId) return i;
    }
  }

  return -1;
}

/**
 * Returns which index in the message array the given message is.
 * @function
 * @param {number} messageId - Id of message.
 * @returns {number} j - index of the message within the dm.
 * @returns {number} -1 - no message exists with that id.
 */

export function whichMessageInDm(messageId: number): number {
  const data = getData();

  for (let i = 0; i < data.dms.length; i++) {
    for (let j = 0; j < data.dms[i].messages.length; j++) {
      if (data.dms[i].messages[j].messageId === messageId) return j;
    }
  }

  return -1;
}

/**
 * Finds out who created the message with the given id.
 * @function
 * @param {number} messageId - Id of message.
 * @returns {string} userHandle - the handle of the user that sent the message.
 * @returns {string} 'NULL' - the message doesn't exist.
 */

export function whoCreated(messageId: number): number {
  const data = getData();
  let user = -1;
  let done = false;

  for (let i = 0; i < data.channels.length; i++) {
    for (let j = 0; j < data.channels[i].messages.length; j++) {
      if (data.channels[i].messages[j].messageId === messageId) {
        user = data.channels[i].messages[j].uId;
        done = true;
        break;
      }
    }
    if (done) break;
  }

  done = false;
  for (let i = 0; i < data.dms.length; i++) {
    for (let j = 0; j < data.dms[i].messages.length; j++) {
      if (data.dms[i].messages[j].messageId === messageId) {
        user = data.dms[i].messages[j].uId;
        done = true;
        break;
      }
    }
    if (done) break;
  }

  return user;
}

/**
 * Check if there are any tags in the message and return them.
 * @function
 * @param {string} message - message.
 * @returns {number[]} tagsIds - array of the ids of the tags in the message.
 */

export function getTags(message: string): number[] {
  const tagsHandles = [];
  const tagsIds = [];
  let tagsHandlesIndex = 0;
  let tagsIdsIndex = 0;
  let currTag = '';
  message = message.toLowerCase();

  for (let i = 0; i < message.length; i++) {
    while (message[i] === '@') {
      currTag = '';
      i++;
      while ((message[i] >= 'a' && message[i] <= 'z') || (message[i] >= '0' && message[i] <= '9')) {
        currTag += message[i];
        i++;
        if (i >= message.length) break;
      }
      tagsHandles[tagsHandlesIndex] = currTag;
      tagsHandlesIndex++;
      if (message[i] === '@') continue;
      i++;
      if (i >= message.length) break;
    }
  }

  // Removes any doubles
  for (let i = 0; i < tagsHandles.length; i++) {
    for (let j = i + 1; j < tagsHandles.length; j++) {
      if (tagsHandles[i] === tagsHandles[j]) {
        tagsHandles.splice(j, 1);
      }
    }
  }

  const data = getData();

  for (let i = 0; i < tagsHandles.length; i++) {
    for (let j = 0; j < data.users.length; j++) {
      if (data.users[j].handleStr === tagsHandles[i]) {
        tagsIds[tagsIdsIndex] = data.users[j].uId;
        tagsIdsIndex++;
        break;
      }
    }
  }

  return tagsIds;
}

/**
 * The message was sent by the given user.
 * @function
 * @param {number} authUserId - Id of user.
 * @param {number} messageId - Id of message.
 * @returns {boolean} true - the user sent the message.
 * @returns {boolean} false - the user didn't send the message.
 */

export function messageOwner(authUserId: number, messageId: number): boolean {
  const data = getData();

  for (let i = 0; i < data.channels.length; i++) {
    for (let j = 0; j < data.channels[i].messages.length; j++) {
      if (data.channels[i].messages[j].messageId === messageId) {
        if (data.channels[i].messages[j].uId === authUserId) return true;
      }
    }
  }

  for (let i = 0; i < data.dms.length; i++) {
    for (let j = 0; j < data.dms[i].messages.length; j++) {
      if (data.dms[i].messages[j].messageId === messageId) {
        if (data.dms[i].messages[j].uId === authUserId) return true;
      }
    }
  }

  return false;
}

/**
 * Check owner permissions in channel
 * @function
 * @param {number} authUserId - User Id
 * @param {number} messageId - Id of the message
 * @returns {boolean} true - if owner in dm
 * @returns {boolean} false - if owner not in dm
 */
export function checkOwnerPermissionsInDm(authUserId: number, messageId: number): boolean {
  const data = getData();
  for (let i = 0; i < data.dms.length; i++) {
    for (let j = 0; j < data.dms[i].messages.length; j++) {
      if (data.dms[i].messages[j].messageId === messageId) {
        if (data.dms[i].owner === authUserId) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Check owner permissions in channel
 * @function
 * @param {number} authUserId - User Id
 * @param {number} messageId - Id of the message
 * @returns {boolean} true - if owner in channel
 * @returns {boolean} false - if owner not in channel
 */
export function checkOwnerPermissionsInChannel(authUserId: number, messageId: number): boolean {
  const data = getData();
  for (let i = 0; i < data.channels.length; i++) {
    for (let j = 0; j < data.channels[i].messages.length; j++) {
      if (data.channels[i].messages[j].messageId === messageId) {
        if (!checkglobal(authUserId) && !checkOwnerInChannel(authUserId, data.channels[i].channelId)) return false;
      }
    }
  }
  return true;
}
/**
 * Checks if Id of user exists
 * @function
 * @param {uId} uId - Id of user.
 * @returns {boolean} true if exists, false otherwise
 */
export function checkId(uId: number) {
  const data = getData();
  for (const i in data.users) {
    if (data.users[i].uId === uId) return true;
  }
  return false;
}
/**
 * Checks permissions of user
 * @function
 * @param {uId} uId - Id of user.
 * @returns {boolean} true if globalowner, false if basic member
 */
export function checkPermissions(uId: number) {
  const data = getData();
  for (const i in data.globalowners) {
    if (data.globalowners[i] === uId) return true;
  }
  return false;
}
