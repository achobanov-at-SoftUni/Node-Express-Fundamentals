const Image = require('./models/Image')
const Tag = require('./models/Tag')
const mongoose = require('mongoose')

function createTag (tagName) {
  return new Promise((resolve, reject) => {
    Tag.findOne({ name: tagName })
      .then((tagExists) => {
        if (tagExists) {
          resolve(tagExists._id)
          return
        }

        Tag.create({ name: tagName })
          .then((tag) => {
            resolve(tag._id)
          })
      })
  })
}

function addImageToTag (tagData) {
  return new Promise((resolve, reject) => {
    Tag.findOne({ name: tagData.name })
      .then((tag) => {
        tag.images.push(tagData.imageId)
        tag.save()
          .then(() => {
            resolve(`Image "${tagData.imageId}" added to tag "${tag.name}"`)
          })
      })
  })
}

module.exports = {
  saveImage: (imageData) => {
    let image = {
      url: imageData.url,
      description: imageData.description,
      tags: []
    }

    let tags = imageData.tags
    let addTags = []

    for (let tag of tags) {
      addTags.push(
        createTag(tag)
          .then((tagId) => {
            image.tags.push(tagId)
            console.log(`Tag "${tag}" linked!`)
          })
      )
    }

    Promise.all(addTags)
      .then(() => {
        Image.create(image)
          .then((imageData) => {
            console.log(`Image "${imageData._id}" created!`)

            for (let tag of tags) {
              addImageToTag({ name: tag, imageId: imageData._id })
                .then((msg) => console.log(msg))
            }
          })
      })
  },
  findByTag: (tagName) => {
    return new Promise((resolve, reject) => {
      Tag.findOne({ name: tagName })
        .then((tagData) => {
          Image.find({ tags: tagData._id })
            .then((images) => {
              let sorted = images.sort((a, b) => a.creationDate < b.creationDate)

              for (let image of sorted) {
                console.log(image.creationDate)
              }
              resolve(sorted)
            })
        })
    })
  },
  filter: (minDate, maxDate, result) => {
    // Image.find({ })
    //   .then((images) => {
    //     let getMinDate = images.sort((a, b) => a.creationDate > b.creationDate)
    //     minDate = getMinDate[0].creationDate
    //     console.log('minDate')
    //     resolve(minDate)
    //   })
    if (!result) {
      result = 10
    }
    if (!minDate) {
      minDate = new Date(-8640000000000000)
    }
    if (!maxDate) {
      let now = new Date()
      maxDate = now.toISOString()
      console.log(maxDate)
    }

    return new Promise((resolve, reject) => {
      Image.find({
        creationDate: {
          $gte: minDate,
          $lt: maxDate
        }
      })
        .limit(result)
        .then((images) => {
          console.log(images)
          resolve(images)
        })
    })
  }
}
