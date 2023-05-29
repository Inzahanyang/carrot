import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { topic, keywords },
    session: { user },
  } = req;
  console.log(topic, keywords);
  console.log(user);

  if (!topic || !keywords || !user) {
    res.status(422);
    return;
  }

  const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(config);
  const postResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a blog post generator",
      },
      {
        role: "user",
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
        The response should be formatted in SEO-friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`,
      },
    ],
    temperature: 0.5,
  });

  const postContent = postResponse.data.choices[0]?.message?.content;

  if (!postContent) {
    res.status(422).json({ ok: false });
    return;
  }
  const titleResult = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a blog post generator.",
      },
      {
        role: "user",
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
          The response should be formatted in SEO-friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content: "generate appropriate title tag text for the adove blog post",
      },
    ],
    temperature: 1,
  });

  const metaDescriptionResult = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a blog post generator.",
      },
      {
        role: "user",
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
          The response should be formatted in SEO-friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content:
          "Generate SEO-friendly meta description content for the above blog post",
      },
    ],
    temperature: 1,
  });

  const title = titleResult.data.choices[0].message?.content;
  const metaDescription =
    metaDescriptionResult.data.choices[0].message?.content;

  if (!title || !metaDescription) {
    res.status(422).json({ ok: false });
    return;
  }

  const blogPost = await client.blogPost.create({
    data: {
      userId: parseInt(user.id.toString()),
      postContent,
      title,
      metaDescription,
      keywords,
      topic,
    },
  });

  console.log(blogPost);

  res.status(200).json({ ok: true, id: blogPost.id });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
