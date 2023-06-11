export const decodeData = async (data: ReadableStream | Buffer): Promise<string> => {
    if (Buffer.isBuffer(data)) {
      return data.toString('utf8');
    } else if (data instanceof ReadableStream) {
      return await streamToString(data);
    } else {
      throw new Error('Invalid data type. Expected Buffer or ReadableStream.');
    }
  }

export const streamToString = async (stream: ReadableStream): Promise<string> => {
const reader = stream.getReader();
let result = '';
while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += value;
}
return result;
}