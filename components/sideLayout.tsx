import Link from "next/link";
import { Logo } from "./logo";
import useUser from "@/libs/client/useUser";
import useSWR from "swr";
import { BlogPost } from "@prisma/client";

interface PostsResponse {
  ok: boolean;
  posts: BlogPost[];
}

export const SideLayout = ({ children }: any) => {
  const { user } = useUser();
  const { data, isLoading } = useSWR<PostsResponse>("/api/blog");

  return (
    <div className="grid h-screen grid-cols-[300px_1fr]">
      <div className="flex flex-col overflow-hidden text-white">
        <div className="bg-pink-800 px-2">
          <Logo />
          <Link className="btn" href="/blog/post/new">
            New Post
          </Link>
        </div>
        <div className="flex-1 overflow-auto bg-gradient-to-b from-pink-800 to-yellow-800 px-4">
          {data?.posts?.map((post) => (
            <Link
              href={`/blog/post/${post.id}`}
              key={post.id}
              className={`my-1 block cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-md border border-white/0 bg-white/10 px-2 py-1`}
            >
              {post.topic}
            </Link>
          ))}
        </div>
        <div className="flex h-20 items-center gap-2 border-t border-t-white/50 bg-yellow-800 px-2">
          {!!user ? (
            <>
              <div className="min-w-[50px]">
                <div className="h-12 w-12 rounded-full bg-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
              </div>
            </>
          ) : (
            <Link href={"/enter"}>Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
