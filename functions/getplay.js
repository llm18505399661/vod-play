import Core from '@alicloud/pop-core';

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get("videoId");
  if (!videoId) {
    return new Response(JSON.stringify({msg:"缺少videoId"}),{status:400});
  }

  const accessKeyId = env.ALIYUN_AK;
  const accessKeySecret = env.ALIYUN_SK;
  const regionId = "cn-shanghai";
  const authTimeout = 604800;

  const client = new Core({
    accessKeyId,
    accessKeySecret,
    endpoint: `https://vod.${regionId}.aliyuncs.com`,
    apiVersion: '2017-03-21'
  });

  try {
    const result = await client.request('GetPlayInfo', {
      VideoId: videoId,
      AuthTimeout: authTimeout
    });
    return new Response(JSON.stringify(result),{
      headers:{"Content-Type":"application/json"}
    });
  } catch (err) {
    return new Response(JSON.stringify({msg:"获取播放地址失败",err:err.message}),{status:500});
  }
}
