import each from 'jest-each';

import store from '@/store';


describe('groupByDate', () => {
  const { groupByDate, currentRoomMessages } = store.getters;

  const state = {
    room: { id: 100500 },
    messages: {
      100500: [
        { date: '2019-10-28T12:58:19', author: 'gdml' },
        { date: '2019-10-28T12:59:19', author: 'gdml' },
        { date: '2019-10-28T12:59:20', author: '100500' },
        { date: '2019-10-28T12:59:21', author: 'gdml' },
        { date: '2019-10-28T12:59:22', author: 'gdml' },
        { date: '2019-10-28T12:58:17', author: 'gdml' },
        { date: '2019-10-28T13:00:22', author: '100500' },
        { date: '2019-10-28T13:00:23', author: '100500' },
        { date: '2019-10-29T13:00:24', author: '100500' },
        { date: '2019-11-29T13:00:23', author: '100500' },
        { date: '2020-11-29T13:00:23', author: '100500' },
        { date: '2020-11-29T13:00:23', author: 'gdml' },
        { date: '2020-11-29T13:00:24', author: '100500' },
      ],
    },
  };

  it('Returns messages grouped by minute', () => {
    const got = groupByDate(state, { currentRoomMessages: currentRoomMessages(state) });

    expect(got).toEqual([
      [
        { date: '2019-10-28T12:58:17', author: 'gdml' },
        { date: '2019-10-28T12:58:19', author: 'gdml' },
      ],
      [
        { date: '2019-10-28T12:59:19', author: 'gdml' },
      ],
      [
        { date: '2019-10-28T12:59:20', author: '100500' },
      ],
      [
        { date: '2019-10-28T12:59:21', author: 'gdml' },
        { date: '2019-10-28T12:59:22', author: 'gdml' },
      ],
      [
        { date: '2019-10-28T13:00:22', author: '100500' },
        { date: '2019-10-28T13:00:23', author: '100500' },
      ],
      [
        { date: '2019-10-29T13:00:24', author: '100500' },
      ],
      [
        { date: '2019-11-29T13:00:23', author: '100500' },
      ],
      [
        { date: '2020-11-29T13:00:23', author: '100500' },
      ],
      [
        { date: '2020-11-29T13:00:23', author: 'gdml' },
      ],
      [
        { date: '2020-11-29T13:00:24', author: '100500' },
      ],
    ]);
  });
});


describe('currentRoomMessages getter', () => {
  const state = {
    room: { id: 100500 },
    messages: {
      100: ['lol'],
      500: ['kek'],
    },
  };

  const { currentRoomMessages } = store.getters;

  it('Returns empty array when getting messages from non existent room', () => {
    const got = currentRoomMessages(state);

    expect(got).toEqual([]);
  });

  each([
    [100, ['lol']],
    [500, ['kek']],
  ]).test('Returns messages of the room -> %s', (roomId, expected) => {
    state.room.id = roomId;

    const got = currentRoomMessages(state);

    expect(got).toEqual(expected);
  });
});


describe('lastMessageOfCurrentRoom getter', () => {
  const { lastMessageOfCurrentRoom } = store.getters;

  each([
    [[{ date: '2019-10-28T12:58:18' }, { date: '2019-10-28T12:58:17' }], { date: '2019-10-28T12:58:18' }],
    [[{ date: '2019-10-28T12:58:17' }], { date: '2019-10-28T12:58:17' }],
    [[], undefined],
  ]).test('Returns last message of current room', (currentRoomMessages, expected) => {
    const got = lastMessageOfCurrentRoom({}, { currentRoomMessages });

    expect(got).toEqual(expected);
  });
});
