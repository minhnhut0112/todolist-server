import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '@/config/mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  fullName: Joi.string().required(),
  password: Joi.string().min(8).required(),
  avatarColor: Joi.string().required(),
  starredIds: Joi.array().default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async (email) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: email
    })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByUsername = async (username) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      username: username
    })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
        _destroy: false
      })
  } catch (error) {
    throw new Error(error)
  }
}

const getAllUsers = async () => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).find().toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const findUser = async (email) => {
  try {
    if (!email) {
      throw new Error('At least one of username or email must be provided')
    }

    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find({
        email: { $regex: email, $options: 'i' }
      })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const findMember = async (memberIds) => {
  try {
    const objectIds = memberIds.map((id) => new ObjectId(id))
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .aggregate([{ $match: { _id: { $in: objectIds } } }])
      .toArray()

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const pushItem = async (id, data) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(id)
        },
        {
          $push: data
        },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const pullItem = async (id, data) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(id)
        },
        {
          $pull: data
        },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateUser = async (id, data) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(id)
        },
        {
          $set: data
        },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const usernModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneByEmail,
  findOneById,
  findOneByUsername,
  findUser,
  findMember,
  pushItem,
  pullItem,
  getAllUsers,
  updateUser
}
