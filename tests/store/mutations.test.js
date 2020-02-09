import store from '@/store';

describe('RECEIVE_MESSAGE', () => {
  it('Receive message from particular room', () => {
    const state = {
      messages: {
        100500: [],
      },
    };

    store.mutations.RECEIVE_MESSAGE(state, { roomId: 100500, message: { id: 1, text: 'lol' } });
    store.mutations.RECEIVE_MESSAGE(state, { roomId: 100500, message: { id: 2, text: 'kek' } });

    expect(state.messages[100500]).toEqual([
      { id: 1, text: 'lol' },
      { id: 2, text: 'kek' },
    ]);
  });

  it('Modify existent message', () => {
    const state = {
      messages: {
        100500: [],
      },
    };

    store.mutations.RECEIVE_MESSAGE(state, { roomId: 100500, message: { id: 1, text: 'lol' } });
    store.mutations.RECEIVE_MESSAGE(state, { roomId: 100500, message: { id: 1, text: 'kek' } });

    expect(state.messages[100500]).toEqual([{ id: 1, text: 'kek' }]);
  });
});
