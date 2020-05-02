import { successResponce } from '@utils/exchange';
import payloadModule from '../../helper/payload';
import payloadUtils from '../../utils/payload';

export default class Payload {
    static async readAll(req, res, next) {
        try {
            const storeData = await payloadModule.getAll({ user_id: req.userID, status: 'active' });
            return successResponce(req, res, 'All our payload fetched successfully', 202, storeData);
        } catch (_error) {
            return next(_error);
        }
    }

    static async readAllDeleted(req, res, next) {
        try {
            const storeData = await payloadModule.getAll({ user_id: req.userID, status: 'inactive' });
            return successResponce(req, res, 'All our payload fetched successfully', 202, storeData);
        } catch (_error) {
            return next(_error);
        }
    }

    static async read(req, res, next) {
        try {
            const storeData = await payloadModule.get({
                id: req.params.id,
                user_id: req.userID,
            });
            return successResponce(req, res, 'Your payload fetched successfully', 202, storeData);
        } catch (_error) {
            return next(_error);
        }
    }

    static async create(req, res, next) {
        try {
            const data = await payloadUtils.validIt(req.body.data, req.body.type);
            const createData = await payloadModule.create(req.body, req.userID, data);
            return successResponce(req, res, 'Payload created successfully', 202, {
                id: createData.id,
                title: createData.title,
                url: createData.url,
                data: createData.data,
            });
        } catch (_error) {
            return next(_error);
        }
    }

    static async update(req, res, next) {
        try {
            const data = await payloadUtils.validIt(req.body.data, req.body.type);
            const updateData = await payloadModule.update({
                id: req.params.id,
                user_id: req.userID,
            }, req.body, data);
            return successResponce(req, res, 'Payload updated successfully', 202, updateData);
        } catch (_error) {
            return next(_error);
        }
    }

    static async delete(req, res, next) {
        try {
            const statusUpdateData = await payloadModule.statusUpdate({
                id: req.params.id,
                user_id: req.userID,
            }, 'inactive');
            return successResponce(req, res, 'Payload deleted successfully', 202, statusUpdateData);
        } catch (_error) {
            return next(_error);
        }
    }

    static async restore(req, res, next) {
        try {
            const statusUpdateData = await payloadModule.statusUpdate({
                id: req.params.id,
                user_id: req.userID,
            }, 'active');
            return successResponce(req, res, 'Payload restored successfully', 202, statusUpdateData);
        } catch (_error) {
            return next(_error);
        }
    }
}