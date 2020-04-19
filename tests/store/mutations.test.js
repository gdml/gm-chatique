import store from '@/store';

describe('RECEIVE_MESSAGE', () => {
  it('Receive message from particular room', () => {
    const state = {
      messages: {
        100500: [],
      },
    };

    store.mutations.RECEIVE_MESSAGE(state, { channelName: 100500, message: { sid: 1, text: 'lol' } });
    store.mutations.RECEIVE_MESSAGE(state, { channelName: 100500, message: { sid: 2, text: 'kek' } });

    expect(state.messages[100500]).toEqual([
      { sid: 1, text: 'lol' },
      { sid: 2, text: 'kek' },
    ]);
  });

  it('Modify existent message', () => {
    const state = {
      messages: {
        100500: [],
      },
    };

    store.mutations.RECEIVE_MESSAGE(state, { channelName: 100500, message: { sid: 1, text: 'lol' } });
    store.mutations.RECEIVE_MESSAGE(state, { channelName: 100500, message: { sid: 1, text: 'kek' } });

    expect(state.messages[100500]).toEqual([{ sid: 1, text: 'kek' }]);
  });
});
