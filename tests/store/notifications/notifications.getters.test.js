import store from '@/store/notifications';

describe('notifications getter', () => {
  const { notifications } = store.getters;
  let state;

  beforeEach(() => {
    state = {
      container: [{ message: 'lol', kind: 'success' }],
    };
  });

  it('Returns notification items', () => {
    const got = notifications(state);

    expect(got[0].message).toEqual('lol');
  });
});
