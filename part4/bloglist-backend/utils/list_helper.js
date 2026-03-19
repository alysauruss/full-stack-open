const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite;
  });
};

const mostBlogs = (blogs) => {
  const counts = blogs.reduce((result, blog) => {
    result[blog.author] = (result[blog.author] || 0) + 1;
    return result;
  }, {});

  const topAuthor = Object.keys(counts).reduce((currentWinner, nextAuthor) =>
    counts[currentWinner] > counts[nextAuthor] ? currentWinner : nextAuthor,
  );

  return {
    author: topAuthor,
    blogs: counts[topAuthor],
  };
};

const mostLikes = (blogs) => {
  const likeCounts = blogs.reduce((result, blog) => {
    result[blog.author] = (result[blog.author] || 0) + blog.likes;
    return result;
  }, {});

  const topAuthor = Object.keys(likeCounts).reduce(
    (currentWinner, nextAuthor) =>
      likeCounts[currentWinner] > likeCounts[nextAuthor]
        ? currentWinner
        : nextAuthor,
  );

  return { author: topAuthor, likes: likeCounts[topAuthor] };
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
