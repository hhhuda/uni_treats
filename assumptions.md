- Assumes that if authUserId doesn't match a registered ID, return {error: 'error'}

/auth/logout/v1:
- Assumes that the given token is for a user that has already logged in

channelsCreateV1: 
- Assumes that parameters are provided - and of the specified type - authUserId is a num, name is str, and isPublic is a bool

channelsListV1: 
- Assumes that if there are no channels associated with the ID, or no channels at all, return an empty array {channels: []}

channelMessagesV1:
- Assumes that if the 'start' parameter is a negative integer, return {error: 'error'}
- Assumes that if start == number of total messages in a channel and there are no messages in that channel, return a single empty array rather than {error: 'error'}
