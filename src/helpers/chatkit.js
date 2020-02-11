import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

export default {
  currentUser: null,

  connect(chatkitInstance, userId) {
    const path = chatkitInstance.split(':')[2];

    const manager = new ChatManager({
      instanceLocator: chatkitInstance,
      userId: String(userId),
      tokenProvider: new TokenProvider({
        url: `https://us1.pusherplatform.io/services/chatkit_token_provider/v1/${path}/token`,
      }),
    });

    return manager.connect();
  },
};
