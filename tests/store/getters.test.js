import each from 'jest-each';

import store from '@/store';


describe('groupByDate', () => {
  const { groupByDate, currentChannelMessages } = store.getters;

  const state = {
    currentChannelName: 100500,
    messages: {
      100500: [
        { timestamp: '2019-10-28T12:58:19', author: 'gdml' },
        { timestamp: '2019-10-28T12:59:19', author: 'gdml' },
        { timestamp: '2019-10-28T12:59:20', author: '100500' },
        { timestamp: '2019-10-28T12:59:21', author: 'gdml' },
        { timestamp: '2019-10-28T12:59:22', author: 'gdml' },
        { timestamp: '2019-10-28T12:58:17', author: 'gdml' },
        { timestamp: '2019-10-28T13:00:22', author: '100500' },
        { timestamp: '2019-10-28T13:00:23', author: '100500' },
        { timestamp: '2019-10-29T13:00:24', author: '100500' },
        { timestamp: '2019-11-29T13:00:23', author: '100500' },
        { timestamp: '2020-11-29T13:00:23', author: '100500' },
        { timestamp: '2020-11-29T13:00:23', author: 'gdml' },
        { timestamp: '2020-11-29T13:00:24', author: '100500' },
      ],
    },
  };

  it('Returns messages grouped by minute', () => {
    const got = groupByDate(state, { currentChannelMessages: currentChannelMessages(state) });

    expect(got).toEqual([
      [
        { timestamp: '2019-10-28T12:58:17', author: 'gdml' },
        { timestamp: '2019-10-28T12:58:19', author: 'gdml' },
      ],
      [
        { timestamp: '2019-10-28T12:59:19', author: 'gdml' },
      ],
      [
        { timestamp: '2019-10-28T12:59:20', author: '100500' },
      ],
      [
        { timestamp: '2019-10-28T12:59:21', author: 'gdml' },
        { timestamp: '2019-10-28T12:59:22', author: 'gdml' },
      ],
      [
        { timestamp: '2019-10-28T13:00:22', author: '100500' },
        { timestamp: '2019-10-28T13:00:23', author: '100500' },
      ],
      [
        { timestamp: '2019-10-29T13:00:24', author: '100500' },
      ],
      [
        { timestamp: '2019-11-29T13:00:23', author: '100500' },
      ],
      [
        { timestamp: '2020-11-29T13:00:23', author: '100500' },
      ],
      [
        { timestamp: '2020-11-29T13:00:23', author: 'gdml' },
      ],
      [
        { timestamp: '2020-11-29T13:00:24', author: '100500' },
      ],
    ]);
  });
});


describe('currentChannelMessages getter', () => {
  const state = {
    currentChannelName: 100500,
    messages: {
      100: ['lol'],
      500: ['kek'],
    },
  };

  const { currentChannelMessages } = store.getters;

  it('Returns empty array when getting messages from non existent room', () => {
    const got = currentChannelMessages(state);

    expect(got).toEqual([]);
  });

  each([
    [100, ['lol']],
    [500, ['kek']],
  ]).test('Returns messages of the room -> %s', (channelId, expected) => {
    state.currentChannelName = channelId;

    const got = currentChannelMessages(state);

    expect(got).toEqual(expected);
  });
});


describe('lastMessageOfCurrentChannel getter', () => {
  const { lastMessageOfCurrentChannel } = store.getters;

  each([
    [[{ timestamp: '2019-10-28T12:58:18' }, { timestamp: '2019-10-28T12:58:17' }], { timestamp: '2019-10-28T12:58:18' }],
    [[{ timestamp: '2019-10-28T12:58:17' }], { timestamp: '2019-10-28T12:58:17' }],
    [[], undefined],
  ]).test('Returns last message of current room', (currentChannelMessages, expected) => {
    const got = lastMessageOfCurrentChannel({}, { currentChannelMessages });

    expect(got).toEqual(expected);
  });
});
