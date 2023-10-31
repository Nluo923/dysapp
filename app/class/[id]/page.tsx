export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 10,
  fetchCache = "auto";

import PocketBase from "pocketbase";
import Link from "next/link";

const pb = new PocketBase("http://127.0.0.1:8090");

async function getClassInfo(id: string) {
  const res = await pb
    .collection("classes")
    .getFirstListItem("id='" + id + "'");

  return res as any;
}

/*
 * Retrieve a list of students in the classroom
 */
async function getStudents(id: string) {
  const resultList = await pb.collection("enrollments").getList(1, 25, {
    filter: "class='" + id + "'",
    sort: "-created",
    expand: "user",
  });

  return resultList?.items as any[];
}

/*
 * Retrieve a list of materials assigned to the classroom
 */
async function getFiles(id: string) {
  const resultList = await pb.collection("files").getList(1, 10, {
    filter: "class='" + id + "'",
    sort: "-created",
  });

  return resultList?.items as any[];
}

export default async function ClassPage({
  params,
}: {
  params: { id: string };
}) {
  const classInfo = await getClassInfo(params.id);
  const students = await getStudents(params.id);
  const files = await getFiles(params.id);

  return (
    <div>
      <h1 className="p-5 text-xl text-teal-400">{classInfo.title}</h1>
      <h1 className="p-5">TEACHER: {classInfo.teacher}</h1>
      <h1 className="p-5">CLASS FILES:</h1>
      <div>
        {files?.map((file) => {
          return <File key={file.id} f={file} />;
        })}
      </div>
      <div>
        {students?.map((student) => {
          return <Student key={student.id} s={student} />;
        })}
      </div>
    </div>
  );
}

function File({ f }: any) {
  const { id, title, file, created } = f || {};
  return (
    <Link href={`/file/${id}`}>
      <div className="max-w-sm rounded overflow-hidden shadow-lg">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{title}</div>
          <p className="text-gray-700 text-base">{created}</p>
        </div>
      </div>
    </Link>
  );
}

function Student({ s }: any) {
  const { id, user, expand } = s || {};
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <div className="px-6 py-4">
        <div className="leading-tight">
          <h1 className="font-bold"> {expand.user.name}</h1>
          <h6 className="text-zinc-400 text-xs font-extralight">
            user id: {user}
          </h6>
          <h6 className="text-zinc-400 text-xs font-extralight">
            enrollment id: {id}
          </h6>
        </div>
      </div>
    </div>
  );
}
