import { getData, setData } from './dataStore';
import { checkglobal, whichUser, checkToken, returnDm, tokenId, checkuserIds, checkdmId, checkdmMember, returndmMember, whichUserId, totalMessages, getTags } from './other';
import HTTPError from 'http-errors';
import { addNotification } from './users';

/**
 * Create a dm list.
 * @function
 * @param {string} token - Token of user.
 * @param {number[]} uIds - uId array.
 * @throws 400 error if any uId in uIds does not refer to a valid user.
 * @throws 400 error if there are duplicate uId's in uIds.
 * @throws 403 error if the token is invalid.
 * @returns {number} dmId - id of the dm.
 */

function dmCreate(token: string, uIds: number[]) {
  let data = getData();

  if (!checkuserIds(uIds)) throw HTTPError(400, 'Invalid uIds.');
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');

  const authUserId = tokenId(token);

  let dmId = data.dms.length;
  while (returnDm(dmId) !== -1) dmId++;
  // Push name strings to an array
  const array = [];
  const memberarray = [];
  const currUser = whichUser(token);
  memberarray.push({
    uId: data.users[currUser].uId,
    email: data.users[currUser].email,
    nameFirst: data.users[currUser].nameFirst,
    nameLast: data.users[currUser].nameLast,
    handleStr: data.users[currUser].handleStr,
  });
  array.push(data.users[currUser].handleStr);
  for (const a in uIds) {
    for (const b in data.users) {
      if (uIds[a] === data.users[b].uId) {
        array.push(data.users[b].handleStr);
        memberarray.push({
          uId: data.users[b].uId,
          email: data.users[b].email,
          nameFirst: data.users[b].nameFirst,
          nameLast: data.users[b].nameLast,
          handleStr: data.users[b].handleStr,
        });
      }
    }
  }
  array.sort();
  // Take those names and convert it to a namestring
  let name = '';
  for (const a in array) {
    if (parseInt(a) === array.length - 1) {
      name += array[a];
    } else {
      name += array[a];
      name += ', ';
    }
  }
  data.dms.push({
    members: memberarray,
    owner: authUserId,
    dmId: dmId,
    name: name,
    messages: [],
  });
  setData(data);
  for (let i = 0; i < uIds.length; i++) {
    const userHandle = data.users[whichUserId(authUserId)].handleStr;
    data = addNotification('added', uIds[i], userHandle, -1, dmId, '');
  }
  setData(data);
  return { dmId: dmId };
}

/**
 * Returns an array of DMs the user is a member of.
 * @function
 * @param {string} token - Token of user.
 * @throws 403 error if the token is invalid.
 * @returns {array} dms - an array of all of the dms that the user is a member of.
 */

function dmList(token: string) {
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');
  const data = getData();
  const dms = [];
  const uId = tokenId(token);
  for (const a in data.dms) {
    for (const b in data.dms[a].members) {
      if (data.dms[a].members[b].uId === uId) {
        dms.push({
          dmId: data.dms[a].dmId,
          name: data.dms[a].name,
        });
      }
    }
  }
  return { dms: dms };
}

/**
 * Removes an existing dm.
 * @function
 * @param {string} token - Token of user.
 * @param {number} dmId - Id of dm.
 * @throws 400 error if the dmId is invalid.
 * @throws 403 error if the token is invalid.
 * @throws 403 error if the authorised user is not the original creator.
 * @throws 403 error if the authorised user is not in the dm.
 * @returns {}.
 */

function dmRemove(token: string, dmId: number) {
  if (!checkdmId(dmId)) throw HTTPError(400, 'Invalid dmId.');
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');
  const authUserId = tokenId(token);
  if (!checkdmMember(authUserId, dmId) && !checkglobal(authUserId)) throw HTTPError(403, 'Not a dm member.');

  const data = getData();
  const dmsindex = returnDm(dmId);
  if (data.dms[dmsindex].owner !== authUserId) throw HTTPError(403, 'Not owner');
  data.dms.splice(dmsindex, 1);
  setData(data);
  return {};
}

/**
 * Given a dm from dmId provide some basic information about dm.
 * @function
 * @param {string} token - Token of user.
 * @param {number} dmId - Id of a dm.
 * @throws 400 error if dmId is invalid.
 * @throws 403 error if token is invalid.
 * @throws 403 error if the authorised user is not a member of the dm.
 * @returns {string} name - the name of the dm.
 * @returns {member[]} members - the members that are in the dm.
 */

function dmDetails(token: string, dmId: number) {
  if (!checkdmId(dmId)) throw HTTPError(400, 'Invalid dmId.');
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');
  if (!checkdmMember(tokenId(token), dmId) && !checkglobal(tokenId(token))) throw HTTPError(403, 'Not a dm member.');
  const data = getData();
  const dmsindex = returnDm(dmId);
  return {
    name: data.dms[dmsindex].name,
    members: data.dms[dmsindex].members,
  };
}

/**
 * Given the dmId remove the user is removed of this dm.
 * @function
 * @param {string} token - Token of user.
 * @param {number} dmId - Id of a dm.
 * @throws 400 error if dmId is invalid.
 * @throws 403 error if token is invalid.
 * @throws 403 error if the authorised user is not a member of the dm.
 * @returns {}.
 */

function dmLeave(token: string, dmId: number) {
  if (!checkdmId(dmId)) throw HTTPError(400, 'Invalid dmId.');
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');

  const authUserId = tokenId(token);
  if (!checkdmMember(authUserId, dmId)) throw HTTPError(403, 'Not a dm member.');
  const data = getData();
  const dmsindex = returnDm(dmId);
  const membersindex = returndmMember(authUserId, dmId);
  data.dms[dmsindex].members.splice(membersindex, 1);
  setData(data);
  return {};
}

/**
 * Given the dmId return some messages of this dm.
 * @function
 * @param {string} token - Token of user.
 * @param {number} dmId - Id of a dm.
 * @param {number} start - begining index to display messages from.
 * @throws 400 error if the dmId is invalid.
 * @throws 400 error if the start is less than 0.
 * @throws 400 error if the start is greater than the total number of messages in the channel.
 * @throws 403 error if the token is invalid.
 * @throws 403 error if the authorised user is not a member of the dm.
 * @returns {string} messages - the messages in the dm.
 * @returns {number} start - the index of the start of the messages.
 * @returns {number} end - the index of the end of the messages.
 */

function dmMessages(token: string, dmId: number, start: number) {
  if (!checkdmId(dmId)) throw HTTPError(400, 'Invalid dmId.');
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');
  if (!checkdmMember(tokenId(token), dmId) && !checkglobal(tokenId(token))) throw HTTPError(403, 'Not a dm member.');
  if (start < 0) throw HTTPError(400, 'Invalid start.');
  const data = getData();
  const dmsindex = returnDm(dmId);
  if (data.dms[dmsindex].messages.length < start) throw HTTPError(400, 'Invalid start.');
  let array = [];
  let end = 0;

  if (start + 50 > data.dms[dmsindex].messages.length) {
    end = -1;
    array = (data.dms[dmsindex].messages.slice(start, data.dms[dmsindex].messages.length));
  } else {
    end = start + 50;
    array = (data.dms[dmsindex].messages.slice(start, end));
  }
  array.reverse();
  setData(data);
  return {
    messages: array,
    start: start,
    end: end,
  };
}

/**
 * Sends a message from the authorised user to the dm.
 * @function
 * @param {string} token - Token of user.
 * @param {number} dmId - Id of a dm.
 * @param {string} message - the message being sent.
 * @throws 400 error if the dmId is invalid.
 * @throws 400 error if the length of the message is less than 1 or greater than 1000.
 * @throws 403 error if the token is invalid.
 * @throws 403 error if the authorised user is not a member of the dm.
 * @returns {number} messagedId - the Id of the message that was sent.
 */

function dmSend(token: string, dmId: number, message: string) {
  if (!checkdmId(dmId)) throw HTTPError(400, 'Invalid dmId.');
  if (message.length <= 0) throw HTTPError(400, 'Message too short.');
  if (message.length > 1000) throw HTTPError(400, 'Message too long.');
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');
  const authUserId = tokenId(token);
  if (!checkdmMember(authUserId, dmId)) throw HTTPError(403, 'Not a dm member.');
  let data = getData();
  let mId = totalMessages() + 1;
  while (checkdmId(mId)) mId++;
  const dmsindex = returnDm(dmId);
  data.dms[dmsindex].messages.push({
    messageId: mId,
    uId: authUserId,
    message: message,
    timeSent: Math.floor((new Date()).getTime() / 1000),
    isPinned: false,
    reacts: [],
  });
  setData(data);
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
  for (let i = 0; i < tags.length; i++) {
    setData(data);
    data = addNotification('tagged', tags[i], handleStr, -1, dmId, newMessage);
  }
  return {
    messageId: mId,
  };
}

export { dmCreate, dmList, dmRemove, dmDetails, dmLeave, dmMessages, dmSend };
