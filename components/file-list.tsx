import Pocketbase from "pocketbase";
import { FileRow, columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
const pb = new Pocketbase("http://127.0.0.1:8090");

async function getFiles() {
  const resultList = await pb
    .collection("files")
    .getList(1, 10, {
      sort: "-created",
      expand: "class",
    })
    .catch((err) => {
      if (err.status > 0) console.log(err);
    });

  let data: FileRow[] = [];
  resultList?.items?.map((f) => {
    data.push({
      id: f.id,
      title: f.title,
      created: f.created,
      class_id: f.class,
      class_name: f.expand ? f.expand.class.title : "",
    });
  });

  return data;
}

export default async function FileList() {
  const data = await getFiles();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
