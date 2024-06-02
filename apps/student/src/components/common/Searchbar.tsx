import { useRouter } from "next/router";
import { FormEvent } from "react";

export default function Searchbar() {
    const router = useRouter();

    function submit(e:FormEvent) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData);
        if(!data.keyword) return;
        router.push(`/courses/search?keyword=${data.keyword}`);
    }
    return (
    <form className="flex justify-center items-center gap-4 mx-auto max-w-6xl" onSubmit={submit} >
        <input type="search" name="keyword" id="search" className="w-full py-1 px-4 rounded-md border outline-none bg-black bg-opacity-10"/>
        <button className="px-4 py-1 rounded-md bg-purple-500">Search</button>
    </form>
  )
}
