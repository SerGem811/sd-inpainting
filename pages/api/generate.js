// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const aws = require('aws-sdk')
const axios = require('axios')

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
  signatureVersion: 'v4'
})

const uploadFile = (fileName, encoded) => {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(
      encoded.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    )
    s3.putObject(
      {
        Key: fileName,
        Body: buffer,
        Bucket: process.env.S3_BUCKET_NAME,
        ContentEncoding: 'base64',
        ContentType: 'image/png'
      },
      function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(`${process.env.S3_URL}/${fileName}`)
        }
      }
    )
  })
}

const generateInpaint = async data => {
  return new Promise((resolve, reject) => {
    axios
      .post(process.env.STABLE_DIFFUSION_API, data)
      .then(response => {
        console.log(response)
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default async function handler(req, res) {
  try {
    const {
      prompt,
      negative,
      guidance_scale,
      steps,
      width,
      height,
      image,
      mask
    } = req.body
    const dt = Date.now()
    const originPath = `tmp/${dt}-origin.png`
    const maskPath = `tmp/${dt}-mask.png`
    const init_image = await uploadFile(originPath, image)
    const mask_image = await uploadFile(maskPath, mask)

    // generate image
    const response = await generateInpaint({
      key: process.env.STABLEDIFFUSION_KEY,
      prompt,
      model_id: 'midjourney',
      negative_prompt: negative ? negative : null,
      guidance_scale,
      width,
      height,
      samples: 1,
      num_inference_steps: steps,
      init_image,
      mask_image
    })

    if (response.status === 200) {
      const { data } = response
      if (data.status === 'success') {
        return res.status(200).json({ status: 'success', url: data.output[0] })
      } else if (data.status === 'processing') {
        return res.status(200).json({ status: 'processing', task_id: '1111' })
      }
      return res.status(400).json({ error: `Error while generating image` })
    } else {
      return res.status(400).json({ error: `Error while generating image` })
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: `Error while generating image` })
  }
}
