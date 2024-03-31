import { getData, setData } from './dataStore';
import { checkToken, tokenId, checkPermissions, checkId, whichUserId } from './other';
import HTTPError from 'http-errors';

/**
 * Remove user from treats
 * @function
 * @param {string} token - Token of user.
 * @param {integer} uId - Id of valid user.
 * @throws 400 error if uId does not refer to a valid user.
 * @throws 400 error if removing only global owner.
 * @throws 403 error if token is invalid.
 * @throws 400 if attempt is not by global owners.
 * @returns {}
 */

export function adminuserRemove(token:string, uId: number) {
  const data = getData();
  const og = tokenId(token);
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');
  if (!checkPermissions(og)) throw HTTPError(403, 'Not global owner.');
  if (!checkId(uId)) throw HTTPError(400, 'Id does not exist.');
  if (data.globalowners.length === 1 && tokenId(token) === uId) throw HTTPError(400, 'Cannot remove only global owner.');
  const userindex = whichUserId(uId);
  data.users.splice(userindex, 1);
  for (const i in data.channels) {
    for (const j in data.channels[i].allMembers) {
      if (data.channels[i].allMembers[j].uId === uId) data.channels[i].allMembers.splice(parseInt(j), 1);
    }
    for (const j in data.channels[i].ownerMembers) {
      /* istanbul ignore next */
      if (data.channels[i].ownerMembers[j].uId === uId) data.channels[i].ownerMembers.splice(parseInt(j), 1);
    }
    for (const j in data.channels[i].messages) {
      /* istanbul ignore if */
      if (data.channels[i].messages[j].uId === uId) data.channels[i].messages[j].message = 'Removed user';
    }
  }
  for (const i in data.dms) {
    for (const j in data.dms[i].members) {
      if (data.dms[i].members[j].uId === uId) data.dms[i].members.splice(parseInt(j), 1);
    }
    for (const j in data.dms[i].messages) {
      if (data.dms[i].messages[j].uId === uId) data.dms[i].messages[j].message = 'Removed user';
    }
  }
  setData(data);
  return {};
}
/**
 * Change a user's permissions
 * @function
 * @param {string} token - Token of user.
 * @param {integer} uId - Id of valid user.
 * @param {integer} permissionId - permission Id
 * @throws 400 error if uId does not refer to a valid user.
 * @throws 400 error if demoting only global owner.
 * @throws 403 error if token is invalid.
 * @throws 400 if attempt is not by global owners.
 * @throws 400 if permission id is invalid
 * @returns {}
 */
export function adminpermissionChange(token:string, uId: number, permissionId: number) {
  const data = getData();
  const og = tokenId(token);
  if (!checkToken(token)) throw HTTPError(403, 'Invalid token.');
  if (!checkPermissions(og)) throw HTTPError(403, 'Not global owner.');
  if (!checkId(uId)) throw HTTPError(400, 'Id does not exist.');
  if (permissionId !== 1 && permissionId !== 2) throw HTTPError(400, 'Invalid permissionId');
  if ((data.globalowners.length === 1 && permissionId === 1) && tokenId(token) === uId) throw HTTPError(400, 'Cannot demote only global owner');
  if (permissionId === 2) {
    for (const i in data.globalowners) {
      /* istanbul ignore if */
      if (data.globalowners[i] === uId) throw HTTPError(400, 'Already global owner.');
    }
    data.globalowners.push(uId);
    setData(data);
    return {};
  } else {
    for (const i in data.globalowners) {
      if (data.globalowners[i] === uId) {
        data.globalowners.splice(parseInt(i), 1);
        setData(data);
        return {};
      }
    }
    throw HTTPError(400, 'Already basic member.');
  }
}
