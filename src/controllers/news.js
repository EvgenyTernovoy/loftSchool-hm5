const { createNews, getNewsList, updateNews, deleteNews } = require('../helpers/db');


const create = async (req, res) => {
  const { theme, userId, date, text } = JSON.parse(req.body);
  try {
    await createNews({theme, userId, date, text})
    const result = await getNewsList()

    return res.json(result)
  } catch (e) {
    throw new Error(e)
  }
};

const get = async (req, res) => {
  try {
    const result = await getNewsList()
    return res.json(result)
  } catch (e) {
    throw new Error(e)
  }
}

const update = async (req, res) => {
  const { theme, userId, date, text, id } = JSON.parse(req.body);

  try {
    await updateNews(id, { theme, userId, date, text })

    const result = await getNewsList()
    return res.json(result)
  } catch (e) {
    throw new Error(e)
  }
}

const deleteItem = async (req, res) => {
  try {
    await deleteNews(req.params.id)

    const result = await getNewsList()
    return res.json(result)
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  create,
  get,
  update,
  deleteItem,
};
