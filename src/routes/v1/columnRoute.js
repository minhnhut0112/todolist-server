import express from 'express'
import { columnValodation } from '@/validations/columnValidation'
import { columnController } from '@/controllers/columnController'

const Router = express.Router()

Router.route('/').post(columnValodation.createNew, columnController.createNew)

Router.route('/:id')
  .put(columnValodation.updateCardOrderIds, columnController.updateCardOrderIds)
  .delete(columnValodation.deleteColumn, columnController.deleteColumn)

Router.route('/archive/:id').put(columnController.archiveAllCard)

export const columnRoute = Router
