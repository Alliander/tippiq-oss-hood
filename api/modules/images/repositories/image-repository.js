/**
 * ImageRepository.
 * @module modules/images/repositories/image-repository
 */

import autobind from 'autobind-decorator';
import BPromise from 'bluebird';

import { Image } from '../models';
import BaseRepository from '../../../common/base-repository';

@autobind
/**
 * A Repository for Images.
 * @class ImageRepository
 * @extends BaseRepository
 */
export class ImageRepository extends BaseRepository {
  /**
   * Construct a ImageRepository for Image.
   * @constructs ImageRepository
   */
  constructor() {
    super(Image);
  }

  /**
   * Find an Image or create a new one if not found
   * @function findOrCreateByUrl
   * @param {string} url Image url.
   * @param {Object} [transaction] Bookshelf transaction.
   * @returns {Promise<Image>} A Promise that resolves to an Image.
   */
  findOrCreateByUrl(url, transaction) {
    return super
      .findOne({ url })
      .catch(this.Model.NotFoundError, () => super.create({ url }, transaction));
  }


  /**
   * Create object image record
   * @function createObjectImageRecord
   * @param {string} objectType The object type
   * @param {object} images Images object
   * @param {object} transaction Transaction to use for this action
   * @returns {array} Objects image record
   */
  createObjectImageRecord(objectType, images, transaction) {
    return (key) =>
      this.findOrCreateByUrl(images[key], transaction)
        .then(this.createObjectImageRecordFromImageModel(objectType, key));
  }

  /**
   * Create object image record from image model
   * @function createObjectImageRecordFromImageModel
   * @param {string} objectType The object type
   * @param {string} key The key
   * @returns {object} Object image record
   */
  createObjectImageRecordFromImageModel(objectType, key) {
    return (model) => ({
      image: model.get('id'),
      key,
      object_type: objectType,
    });
  }


  /**
   * Find or create image models
   * @function findOrCreateImageModels
   * @param {string} objectType The object type
   * @param {object} imagesObject Images object
   * @param {object} transaction Transaction to use for this action
   * @returns {Promise<Image>} A Promise that resolves to an Image
   */
  findOrCreateImageModels(objectType, imagesObject, transaction) {
    const images = imagesObject || {};
    const getObjectImageRecords = Object.keys(images).map(this.createObjectImageRecord(objectType,
      images, transaction));
    return BPromise.all(getObjectImageRecords);
  }

  /**
   * Create a new Image
   * @function createImage
   * @param {Object} image Image json object.
   * @param {Object} [transaction] Bookshelf transaction.
   * @returns {Promise<Image>} A Promise that resolves to an Image.

   static createImage(image, transaction) {
    return new Image(image).save(null, bookshelfOptions(transaction));
  }*/

  /**
   * Update images
   * @function updateImages
   * @param {string} objectType Type of object the image is for
   * @param {object} model The model to process
   * @param {array} images Images to update
   * @param {object} transaction Transaction to use
   * @returns {object} Card model
   */
  updateImages(objectType, model, images, transaction) {
    return BPromise
      .all([
        model,
        this.findOrCreateImageModels(objectType, images, transaction),
      ])
      .spread((modelToSetImagesFor, imageMap) =>
        modelToSetImagesFor.setImages(imageMap, transaction)
      );
  }

  OBJECT_IMAGE_TYPES = Object.freeze({
    CARD: 'card',
    ORGANIZATION: 'organization',
    SERVICE: 'service',
  });
}

export default new ImageRepository();
