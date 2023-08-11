import PocketBase from "pocketbase";
import { useRouter } from "next/router";
import Link from "next/link";

const pb = new PocketBase("http://127.0.0.1:8090");

async function getStudents() {}

/*
 * Retrieve materials assigned to this classroom
 */
async function getFiles(slug: string) {
    const resultList = await pb.collection("files").getList(1, 10, {
        filter: "class.id = " + slug,
        sort: "-created",
    });

    return resultList?.items as any[];
}

export default async function ClassPage({
    params,
}: {
    params: { slug: string };
}) {
    const files = await getFiles(params.slug);

    return (
        <div>
            <h1>class files</h1>
            <div>
                {files?.map((file) => {
                    return <File key={file.id} f={file} />;
                })}
            </div>
        </div>
    );
}

function File({ f }: any) {
    const { id, title, file, created } = f || {};
    return (
        <Link href={`/files/${id}`}>
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <img className="w-full">{}</img>
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{title}</div>
                    <p className="text-gray-700 text-base">{created}</p>
                </div>
            </div>
        </Link>
    );
}
