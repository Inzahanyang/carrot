import { SideLayout } from "@/components/sideLayout";
import { faBrain, faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlogPost } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";

interface PostResponse {
  ok: boolean;
  post: BlogPost;
}

export default function PostDetail() {
  const router = useRouter();
  const { data, isLoading } = useSWR<PostResponse>(
    router.query.id ? `/api/blog/post/${router.query.id}` : null
  );

  console.log(data);

  return (
    <div className="h-full overflow-auto">
      {!!isLoading && (
        <div className="flex h-full w-full animate-pulse flex-col items-center justify-center text-center text-green-500">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6 className="text-3xl">Loading...</h6>
        </div>
      )}
      {!!data?.ok ? (
        <div className="mx-auto mb-12 max-w-screen-sm">
          <div className="mt-6 rounded-md bg-stone-200 p-2 text-sm font-bold">
            SEO title and meta description
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: !data.post.title.includes("<title>")
                ? `<title>${data.post.title}</title>`
                : data.post.title,
            }}
          />
          <div className="my-2 rounded-md border border-stone-200 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {!data.post.title.includes("<title>")
                ? data.post.title
                : data.post.title.slice(7, -8)}
            </div>
            <div className="mt-2">{data?.post.metaDescription}</div>
          </div>
          <div className="mt-6 rounded-md bg-stone-200 p-2 text-sm font-bold">
            Keywords
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {data?.post.keywords.split(",").map((keyword, i) => (
              <div key={i} className="rounded-full bg-slate-800 p-2 text-white">
                <FontAwesomeIcon icon={faHashtag} /> {keyword}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-md bg-stone-200 p-2 text-sm font-bold">
            Blog Post
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: data?.post.postContent || "" }}
          />
        </div>
      ) : (
        <div>Not Found Post</div>
      )}
    </div>
  );
}

PostDetail.getLayout = function getLayout(
  page: any,
  pageProps: JSX.IntrinsicAttributes & { children: any }
) {
  return <SideLayout {...pageProps}>{page}</SideLayout>;
};
