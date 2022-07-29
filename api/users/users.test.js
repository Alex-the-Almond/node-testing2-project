const request = require('supertest');
const db = require('../../data/db-config');
const server = require('../server');
const User = require('./user-model');

const user1 = {username: "Alex", contents: "it is what it is", user_id: 51 }
const user2 = {username: 'Alex2', contents: 'how did you know', user_id: 52}

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async () => {
    await db('users').truncate()
    await db.seed.run()
})

afterAll(async () => {
    await db.destroy()
})

test('correct env var', () => {
    expect(process.env.NODE_ENV).toBe('testing')
})

describe('users model functions', () => {
    test('findPosts(/:id)', async () => {
        let result = await User.findPosts(1);
        expect(result).toEqual({post_id: 1, contents: 'Let your workings remain a mystery. Just show people the results.', username: 'lao_tzu'})
    })

    test('find()', async () => {
        let result = await User.find();
        expect(result).toHaveLength(4);
        expect(result[0]).toMatchObject({username: 'lao_tzu'})
    })

    test('findById(/:id)', async () => {
        let result = await User.findById(4)
        expect(result).toEqual({username: 'hypatia', posts: [], user_id: 4})
    })

    test('add()', async () => {
        let result = await User.add({username: 'Alex'})
        expect(result).toEqual({user_id: 5, username: 'Alex', posts: []})
    })

    test('remove(/:id)', async () => {
        let result = await User.remove(4)
        expect(result).toEqual(1)
    })

})