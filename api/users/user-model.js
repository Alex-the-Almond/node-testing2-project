const db = require('../../data/db-config.js')

module.exports = {
  findPosts,
  find,
  findById,
  add,
  remove
}

function findPosts(user_id) {
  /*
    Implement so it resolves this structure:

    [
      {
          "post_id": 10,
          "contents": "Trusting everyone is...",
          "username": "seneca"
      },
      etc
    ]
  */

  // select posts.id as post_id, username, contents
  // from posts
  //     join users on user_id = users.id
  // where user_id = 3
  return db('users')
    .join('posts', 'user_id', 'users.id')
    .where('user_id', user_id)
    .select('posts.id as post_id', 'username', 'contents')
    .first()
}

function find() {
  /*
    Improve so it resolves this structure:

    [
        {
            "user_id": 1,
            "username": "lao_tzu",
            "post_count": 6
        },
        {
            "user_id": 2,
            "username": "socrates",
            "post_count": 3
        },
        etc
    ]
  */

  // select users.id as user_id, username, count(posts.id) as post_id

  // from users
  //     left join posts on users.id = user_id

  // group by users.id

  return db('users')
    .leftJoin('posts', 'users.id', 'user_id')
    .groupBy('users.id')
    .select('users.id as user_id', 'username')
    .count('posts.id as post_count');
}

async function findById(id) {
  /*
    Improve so it resolves this structure:

    {
      "user_id": 2,
      "username": "socrates"
      "posts": [
        {
          "post_id": 7,
          "contents": "Beware of the barrenness of a busy life."
        },
        etc
      ]
    }
  */

  // select users.id as user_id, username, posts.id as post_id, contents

  // from users
  //     left join posts on users.id = user_id

  // where users.id = ?

  const array = await db('users')
    .leftJoin('posts', 'users.id', 'user_id')
    .where('users.id', id)
    .select('users.id as user_id', 'username', 'posts.id as post_id', 'contents');
  
  const { username, user_id } = array[0];
  const result = {
    username,
    user_id,
    posts: array
      .filter(item => item.post_id != null)
      .map(item => ({ post_id: item.post_id, contents: item.contents })),
  }

  return result;
}

function add(user) {
  return db('users')
    .insert(user)
    .then(([id]) => { // eslint-disable-line
      return findById(id)
    })
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del()
}
