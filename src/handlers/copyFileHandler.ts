import { S3 } from 'aws-sdk';
import axios, { AxiosResponse } from 'axios';
import { Stream, PassThrough } from 'stream';

interface CopyFileEvent {
  fileUrl: string;
  fileName: string;
  bucket?: string; // Destination S3 bucket.
}

const uploadFromStream = (
  fileResponse: AxiosResponse,
  fileName: string,
  bucket: string,
): { passThrough: PassThrough; promise: Promise<S3.ManagedUpload.SendData> } => {
  const s3 = new S3();
  const passThrough = new PassThrough();
  const promise = s3
    .upload({
      Bucket: bucket,
      Key: fileName,
      ContentType: fileResponse.headers['content-type'],
      ContentLength: fileResponse.headers['content-length'],
      Body: passThrough,
    })
    .promise();
  return { passThrough, promise };
};

const downloadFile = async (fileUrl: string): Promise<AxiosResponse<Stream>> => {
  return axios.get(fileUrl, {
    responseType: 'stream',
  });
};

// Returns the location of file
export const handler = async (event: CopyFileEvent): Promise<string> => {
  const responseStream = await downloadFile(event.fileUrl);

  const { passThrough, promise } = uploadFromStream(responseStream, event.fileName, event.bucket || 'test-bucket');

  responseStream.data.pipe(passThrough);

  return promise
    .then((result) => {
      return result.Location;
    })
    .catch((e) => {
      throw e;
    });
};
