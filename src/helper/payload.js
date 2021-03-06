/* eslint-disable camelcase */
import DB from '../providers/Database';
import hashingUtil from '../utils/hashing';
// eslint-disable-next-line import/no-cycle
import payloadUtils from '../utils/payload';

export default class PayloadModule {
  static async existCheck(where) {
    return (
      (await DB.models.Payload.count({
        where,
      })) > 0
    );
  }

  static countBy(where) {
    return DB.models.Payload.count({
      where,
    });
  }

  static async get(where, params = {}) {
    const returnData = await DB.models.Payload.findOne({
      where,
      ...params,
      attributes: {
        exclude: ['user_id'],
      },
      include: [{ model: DB.models.User, as: 'owner', attributes: ['displayName'] }],
    }).then((payLoad) => (payLoad || {}));
    return returnData;
  }

  static async getFullData(where, params = {}) {
    const returnData = await DB.models.Payload.findOne({
      where,
      ...params,
    }).then((payLoad) => (payLoad || {}));
    return returnData;
  }

  static async getAll(where, params = {}) {
    const attributes = params.attributes || {
      exclude: ['user_id'],
    };
    return DB.models.Payload.findAll({
      where,
      ...params,
      attributes,
      include: [{ model: DB.models.User, as: 'owner', attributes: ['displayName'] }],
    });
  }

  static async create(body, userID, data) {
    const hash = await hashingUtil.payloadHashGenerator(body.title);
    const url = await payloadUtils.urlMaker(body.title);
    const createData = {
      url,
      title: body.title,
      description: body.description,
      keywords: body.keywords,
      data,
      hasAuth: true,
      hash,
      type: body.type,
      visibility: body.visibility,
      user_id: userID,
    };
    if (body.cloneUrl) {
      createData.parentId = body.cloanID;
    }
    const returnData = await DB.models.Payload.create(createData);
    return returnData;
  }

  static async update(where, body, data) {
    const url = await payloadUtils.urlMaker(body.title);
    const returnData = await DB.models.Payload.update(
      {
        url,
        title: body.title,
        description: body.description,
        keywords: body.keywords,
        data,
        hasAuth: true,
        hash: body.hash,
        type: body.type,
        visibility: body.visibility,
      },
      {
        where,
      },
    );
    return returnData;
  }

  static async updateAny(where, updateData) {
    const returnData = await DB.models.Payload.update(updateData,
      {
        where,
      });
    return returnData;
  }

  static async statusUpdate(where, status) {
    const returnData = await DB.models.Payload.update(
      {
        status,
      },
      {
        where,
      },
    );
    return returnData;
  }
}
