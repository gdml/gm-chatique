import each from 'jest-each';

import MessageLibrary from '@/helpers/messageLibrary';

describe('getHash', () => {
  it('Returns null if no message provided', () => {
    const got = MessageLibrary.getMessageHash(null);

    expect(got).toBeNull();
  });

  each([
    [{ timestamp: '2019-10-28T12:58:17', author: 'gdml' }, '201910281258gdml'],
    [{ timestamp: '2019-10-28T12:58:17', author: 'gdml' }, '201910281258gdml'],
    [{ timestamp: '2019-10-28T12:59:17', author: '100500' }, '201910281259100500'],
    [{ timestamp: '2019-11-28T13:11:17', author: '100500' }, '201911281311100500'],
  ]).test('Returns hash of message', (message, expected) => {
    const got = MessageLibrary.getMessageHash(message);

    expect(got).toEqual(expected);
  });
});


describe('sortByIndex', () => {
  it('Doesnt modify argument', () => {
    const messages = [{ index: 22 }, { index: 23 }];

    MessageLibrary.sortByIndex(messages);

    expect(messages).toEqual([{ index: 22 }, { index: 23 }]);
  });

  it('Doesnt sort already sorted', () => {
    const messages = [{ index: 22 }, { index: 23 }];

    const got = MessageLibrary.sortByIndex(messages);

    expect(got).toEqual([{ index: 22 }, { index: 23 }]);
  });

  it('Sorts non sorted', () => {
    const messages = [{ index: 22 }, { index: 23 }];

    const got = MessageLibrary.sortByIndex(messages);

    expect(got).toEqual([{ index: 22 }, { index: 23 }]);
  });
});


describe('group', () => {
  const messages = [
    { index: 2, timestamp: '2019-10-28T12:58:19', author: 'gdml' },
    { index: 3, timestamp: '2019-10-28T12:59:19', author: 'gdml' },
    { index: 4, timestamp: '2019-10-28T12:59:20', author: '100500' },
    { index: 5, timestamp: '2019-10-28T12:59:21', author: 'gdml' },
    { index: 6, timestamp: '2019-10-28T12:59:22', author: 'gdml' },
    { index: 1, timestamp: '2019-10-28T12:58:17', author: 'gdml' },
    { index: 7, timestamp: '2019-10-28T13:00:22', author: '100500' },
    { index: 8, timestamp: '2019-10-28T13:00:23', author: '100500' },
    { index: 9, timestamp: '2019-10-29T13:00:24', author: '100500' },
    { index: 10, timestamp: '2019-11-29T13:00:23', author: '100500' },
    { index: 11, timestamp: '2020-11-29T13:00:23', author: '100500' },
    { index: 12, timestamp: '2020-11-29T13:00:23', author: 'gdml' },
    { index: 13, timestamp: '2020-11-29T13:00:24', author: '100500' },
  ];

  it('Returns messages grouped by minute and author', () => {
    const got = MessageLibrary.group(messages);

    expect(got).toEqual([
      [
        { index: 1, timestamp: '2019-10-28T12:58:17', author: 'gdml' },
        { index: 2, timestamp: '2019-10-28T12:58:19', author: 'gdml' },
      ],
      [
        { index: 3, timestamp: '2019-10-28T12:59:19', author: 'gdml' },
      ],
      [
        { index: 4, timestamp: '2019-10-28T12:59:20', author: '100500' },
      ],
      [
        { index: 5, timestamp: '2019-10-28T12:59:21', author: 'gdml' },
        { index: 6, timestamp: '2019-10-28T12:59:22', author: 'gdml' },
      ],
      [
        { index: 7, timestamp: '2019-10-28T13:00:22', author: '100500' },
        { index: 8, timestamp: '2019-10-28T13:00:23', author: '100500' },
      ],
      [
        { index: 9, timestamp: '2019-10-29T13:00:24', author: '100500' },
      ],
      [
        { index: 10, timestamp: '2019-11-29T13:00:23', author: '100500' },
      ],
      [
        { index: 11, timestamp: '2020-11-29T13:00:23', author: '100500' },
      ],
      [
        { index: 12, timestamp: '2020-11-29T13:00:23', author: 'gdml' },
      ],
      [
        { index: 13, timestamp: '2020-11-29T13:00:24', author: '100500' },
      ],
    ]);
  });
});


describe('withClickableLinks computed', () => {
  const constructLink = (url) => `<a href="${url}" class="gm-chat-message-link" target="_blank">${url}</a>`;

  it('Returns message without link', () => {
    const got = MessageLibrary.withLinks('Yep, i got no links inside but that not means im useless message');

    expect(got).toEqual('Yep, i got no links inside but that not means im useless message');
  });

  it('Returns message with http link', () => {
    const got = MessageLibrary.withLinks('Lets take a look at http://tst.hst/example/100500/ at a simple example that puts into pricttise');

    expect(got).toEqual(`Lets take a look at ${constructLink('http://tst.hst/example/100500/')} at a simple example that puts into pricttise`);
  });

  it('Returns message with https link', () => {
    const got = MessageLibrary.withLinks('Lets take a look at https://tst.hst/example/100500/ at a simple example that puts into pricttise');

    expect(got).toEqual(`Lets take a look at ${constructLink('https://tst.hst/example/100500/')} at a simple example that puts into pricttise`);
  });

  it('Returns message with a few links', () => {
    const got = MessageLibrary.withLinks('https://starts.with/message/ but not contains an only just look at http://my.host/fuckin/joke/ got it?');

    expect(got).toEqual(`${constructLink('https://starts.with/message/')} but not contains an only just look at ${constructLink('http://my.host/fuckin/joke/')} got it?`);
  });
});
