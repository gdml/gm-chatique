import store from '@/store/notifications';

describe('PUSH_NOTIFICATION mutation', () => {
  const { PUSH_NOTIFICATION } = store.mutations;

  let state;

  beforeEach(() => {
    state = { container: [{ message: 'lol', type: 'success' }] };
  });

  it('Appends notification to container', () => {
    PUSH_NOTIFICATION(state, { message: 100500, type: 'info' });

    expect(state.container[1].message).toEqual(100500);
    expect(state.container[1].type).toEqual('info');
    expect('id' in state.container[1]).toBe(true);
  });
});


describe('DELETE_NOTIFICATION mutation', () => {
  const { DELETE_NOTIFICATION } = store.mutations;
  let state;

  beforeEach(() => {
    state = {
      container: [{ id: 100500 }, { id: 123456 }],
    };
  });

  it('Removes notification from container', () => {
    DELETE_NOTIFICATION(state, { id: 100500 });

    expect(state.container).toHaveLength(1);
    expect(state.container[0].id).toEqual(123456);
  });
});
